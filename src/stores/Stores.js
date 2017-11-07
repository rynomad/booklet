import {types, getSnapshot, detach, getRoot, getPath, getPathParts, isStateTreeNode, walk} from 'mobx-state-tree'
import uuid4 from 'uuid/v4'
import json_stringify from 'safe-json-stringify'

const NODES = new Map()
const noop = () => ({})

const Define = ({name, props = {}, views = noop, actions = noop, mixins = []}) => {
  if (!name) throw new Error(`node required`)
  if (NODES.has(name)) throw new Error(`already have type ${name}`)
  console.log(mixins)
  mixins = mixins.map(name => NODES.get(name).types[1])

  Object.keys(props).forEach(key => {
    if (typeof props[key] === 'string' && props[key].indexOf('#') === 0){
      props[key] = types.maybe(GetDefinition(props[key].substr(1)))
    }
  })


  mixins.push(node.props({
    id : types.optional(types.identifier(), () => `${name}/${uuid4()}`),
    type : name,
    ...props
  }).views(views).actions(actions))

  const type = types.compose.apply(types, mixins).named(name)

  const reference = types.reference(type)

  const union = types.union(type, reference)
  NODES.set(name, union)
}

const GetDefinition = (name) => {
  if (!NODES.has(name)) throw new Error(`no node type '${name}'`)
  return NODES.get(name)
}

const Any = types.union((snapshot) => {
  switch(typeof snapshot){
    case 'string': return NODES.get(snapshot.split('/')[0]) || types.string
    case 'number': return types.number
    case 'boolean': return types.boolean
    case 'undefined': return types.undefined
    case 'object' : {
      if (!snapshot) return types.null
      if (Array.isArray(snapshot)) return AnyArray
      if (snapshot.type && NODES.has(snapshot.type)) return NODES.get(snapshot.type)
      throw new Error(`unknown object:\n${json_stringify(snapshot, null, 4)}`)
    }
    default : throw new Error(`invalid snapshot<${typeof snapshot}> :\n${json_stringify(snapshot)}`)
  }
})

const AnyArray = types.array(Any)
const AnyMap = types.map(Any)

const node = types.model('node').props({
  title : types.maybe(types.string),
  parent : Any,
  focused : Any,
  appendix : Any,
  nodes : types.optional(AnyMap, {})
}).views(self => ({
  get _root(){
    return getRoot(self)
  },
  get _index(){
    if (self.isRoot || !self.parent.items) return -1;
    return self.parent.items.indexOf(self);
  },
  get isRoot(){
    return self._root === self
  },
  get depth(){
    let depth = 0
    let parent = self.parent
    while (parent && parent.parent !== parent) ++depth && (parent = parent.parent)
    return depth
  },
  get deepFocused(){
    let focused = self.focused
    while (focused && focused.focused) focused = focused.focused
    return focused
  },
  get isFocused(){
    let _res = false
    if (self.isRoot) _res = true
    else if (self.parent && self.parent.focused === self) _res = true
    return _res
  },
  get isChildOfFocused(){
    let _res = false
    if (self.isRoot) _res = true
    else if (self.parent && self.parent.isFocused) _res = true
    return _res
  },
  get isOlderSiblingOfFocused(){
    let _res = false
    if (self.isRoot) _res = false
    else if (self.parent && self.parent.focused && (self._index < self.parent.focused._index)) _res = true
    return _res
  },
  get isYoungerSiblingOfFocused(){
    let _res = false
    if (self.isRoot) _res = true
    else if (self.parent && self.parent.focused && (self.parent.focused._index < self._index)) _res = true
    return _res
  },
  get observablePropNames(){
    return Object.keys(self.$mobx.values)
                 .map(v => self.$mobx.values[v])
                 .filter(val => val.constructor.name === 'ObservableValue')
                 .map(v => v.name.split('.')[1])
                 .filter(p => p !== 'parent')
  },
  get observableProps(){
    return self.observablePropNames.map(v => self[v])
  }
})).actions(self => ({
  addNode(node){
    if (!self.isRoot) throw new Error(`nodes must be added to root only (cwd : ${getPath(self)}):\n${getSnapshot(node)}`);
    if (isStateTreeNode(node)) node = getSnapshot(node)
    self.nodes.set(node.id, node)
  },
  _afterCreate(node){
    console.log(getPath(node))
    if (node.replaceChildrenWithReferences) node.replaceChildrenWithReferences()
    if (node._replaceChildrenWithReferences) node._replaceChildrenWithReferences()
    if (node.attachToChildren) node.attachToChildren()
    if (node._attachToChildren) node._attachToChildren()
  },
  attachToChildren(){
    self.observableProps.forEach((node) => {

      if (node && node.setProp) node.setProp('parent', self.id)
    })
  },
  setProp(propName, value){
    self[propName] = value
  },
  replaceChildrenWithReferences(){
    self.observablePropNames.forEach((propName) => {
      if (self[propName] && self[propName].id) self.replaceChildWithReference(propName)
    })
  },
  replaceChildWithReference(propName){
    const node = self[propName]
    console.trace("CALLING DETACH", self.title, propName);
    detach(self[propName])
    getRoot(self).addNode(node, self.id)
    self[propName] = node.id
  },
  clone(){
    const snapshot = JSON.parse(json_stringify(getSnapshot(self)))
    snapshot.id = undefined
    snapshot.parent = undefined
    return snapshot
  },
  deepClone(){
    const clone = self.clone()
    self.observablePropNames.forEach((propName) => {
      if (propName === 'parent' || !self[propName]) return
      if ( self[propName].id) clone[propName] = self[propName].deepClone()
      else if (self[propName].constructor.name === 'ObservableArray'){
        clone[propName] = self[propName].map(item => item.deepClone())
      }
    })
    return clone
  },
  focus(id){
    self.focused = id
    if (self.parent && self.parent.focus){
      self.parent.focus(self.id)
    }
  },
  unFocus(){
    self.focused = undefined
    if (self.parent && self.parent.unFocus){
      self.parent.unFocus(self.id)
    }
  },
}))

export {Any, AnyMap, AnyArray, Define, GetDefinition}