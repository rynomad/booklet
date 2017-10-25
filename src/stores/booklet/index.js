import {types, getParent, getSnapshot, getRelativePath, isRoot, detach, getPath, getRoot, getType, isStateTreeNode, walk} from 'mobx-state-tree'
import uuid4 from 'uuid/v4'
import json_stringify from 'safe-json-stringify'

const NODES = new Map()
const noop = () => ({})
window.nodes = NODES


const Define = ({name, props = {}, views = noop, actions = noop, mixins = []}) => {
  if (!name) throw new Error(`node required`)
  if (NODES.has(name)) throw new Error(`already have type ${name}`)
  mixins = mixins.map(name => NODES.get(name).types[1])

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

window.Define = Define
window.Any = Any
window.getSnapshot = getSnapshot
window.AnyMap = types.map(Any)

const node = types.model('node').props({
  parent : Any,
  focused : Any
}).views(self => ({
  get _index(){
    if (self.isRoot || !self.parent.items) return -1;
    return self.parent.items.indexOf(self);
  },
  get _root(){ 
    return getRoot(self) 
  },
  get isRoot(){
    return self._root === self
  },
  get depth(){
    let depth = 0
    let parent = self.parent
    while (parent && parent.parent != parent) ++depth && (parent = parent.parent) && console.log(parent)
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
    else if (self.parent.focused === self) _res = true
    return _res
  },
  get isChildOfFocused(){
    let _res = false
    if (self.isRoot) _res = true
    else if (self.parent.isFocused) _res = true
    return _res
  },
  get isOlderSiblingOfFocused(){
    let _res = false
    if (self.isRoot) _res = false
    else if (self.parent.focused && (self._index < self.parent.focused._index)) _res = true
    return _res
  },
  get isYoungerSiblingOfFocused(){
    let _res = false
    if (self.isRoot) _res = true
    else if (self.parent.focused && (self.parent.focused._index < self._index)) _res = true
    return _res
  },
  get observablePropNames(){
    return Object.keys(self.$mobx.values).map(v => self.$mobx.values[v]).filter(val => val.constructor.name === 'ObservableValue').map(v => v.name.split('.')[1]).filter(p => p != 'parent')
  },
  get observableProps(){
    return self.observablePropNames.map(v => self[v])
  }
})).actions(self => ({
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
    detach(self[propName])
    console.log(node.id)
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
      console.log(propName)
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



Define({
  name : 'collection',
  props : {
    title : types.maybe(types.string),
    items : types.optional(AnyArray,[])
  }, 
  views : self => ({   
    get lineage(){
      return [self].concat(self.items.reduce((items, node) => {
        if (node.lineage){
          return items.concat(node.lineage);
        } else {
          return items.concat([node]);
        }
      }, []))
    },
    get snapshot(){
      return getSnapshot(self)
    },
    get posterity(){
      return self.lineage.filter(node => !node.lineage)
    }
  }),
  actions : self => {
    return ({
      afterCreate(){
        //for (let i = 0; i < self.items.length ; i++) self.replaceArrayMemberWithReference('items', i)
      },
      insert(item, index = 0){
        if (index < 0) index += self.items.length

        const insert = (typeof item === 'string') ? item : isStateTreeNode(node) ? item.id : item
        self.items.unshift(insert)
        self.move(0, index)
        if (!isStateTreeNode(node)){
          self.replaceArrayMemberWithReference('items', index)
        }
      },
      _attachToChildren(){
        //console.log("observable?",Object.keys(self.$mobx.values).map(v => self.$mobx.values[v]))
        self.items.forEach((node) => {
          if (node.setProp) node.setProp('parent', self.id)
          else console.log('no .set', node)
        })
      },
      _replaceChildrenWithReferences(){
        self.items.forEach((node, index) => {
          console.log('here', node)
          if (node.id) self.replaceItemWithReference(index)
        })
      },
      replaceItemWithReference(index){
        if (typeof self.snapshot.items[index] === 'string') return // already a reference
        let node = getSnapshot(self.items[index])
        detach(self.items[index])
        getRoot(self).addNode(node, self.id)
        self.items.splice(index, 0, node.id)
      },
      delete(item){
        self.items.splice(item._index, 1)
      },
      move(itemOrIndex, index){
        if (index === itemOrIndex) return
        if (index < 0) index += self.items.length
        if (!(0 <= index && index < self.items.length)) throw new Error('index out of bounds')
        const item = (typeof itemOrIndex === 'number') ? self.items[itemOrIndex] : itemOrIndex
        self.items.splice(index, 0, self.items.splice(item._index, 0))
      }
    })
  }
})

Define({
  name : 'menuItem',
  props : {
    _isMenuItem : types.optional(types.literal(true), true),
  },
  views : self => ({
    get isSelectedInMenu(){
      if (!self._root.menu || self._root.menu.type !== 'menu') throw new Error('no menu on root')
      return self._root.menu.selected === self
    },
    get isOpenInMenu(){
      console.log(self.title, self.isFocused, self.isChildOfFocused, self.isYoungerSiblingOfFocused)
      return (self.isFocused || self.isChildOfFocused || self.isYoungerSiblingOfFocused) && !self.isOlderSiblingOfFocused
    }
  }),
  actions : self => ({
    selectInMenu(){
      if (!self._root.menu || self._root.menu.type !== 'menu') throw new Error('no menu on root')
      self._root.menu.onSelect(self)
    }
  })
})

Define({
  name : 'viewportItem',
  props : {
    _isViewportItem : types.optional(types.literal(true), true)
  },
  mixins : ['menuItem']
})

Define({
  name : 'menu', 
  props : {
    isOpen : false,
    selected : Any
  },
  views : self => ({
    get items(){
      console.log('get items', self.parent.lineage)
      if (!(self.parent && self.parent.lineage)) {
        console.warn('no or invalid parent')
        return []
      }
      return self.parent.lineage.filter(item => item._isMenuItem)
    }
  }),
  actions : self => ({
    open(){
      self.isOpen = true
    },
    close(){
      self.isOpen = false
    },
    onSelect(node){
      console.log('onSelect', node.title)
      if (self.selected === node) return (node.parent && self.onSelect(node.parent))
      if (self.selected) self.selected.unFocus()
      node.focus()
      self.selected = node.id
      if (node._isViewportItem) self.close()
    }
  })
})

Define({
  name : 'viewport',
  props : {
    selected : Any
  },
  views : self => ({
    get items(){
      if (!self.parent) throw new Error('viewport has no parent to get items from')
      if (!self.parent.lineage) throw new Error('viewport parent has no lineage')
      return self.parent.lineage.filter(item => item._isViewportItem)
    },
    get activeIndex(){
      if (!self.selected) return 0
      return self.items.indexOf(self.selected)
    }
  }),
  actions : self => ({
    goItem(item){
      self.selected = item.id
    },
    goIndex(index){
      self.goItem(self.items[index])
    },
    goNext(){
      self.goIndex(self.activeIndex - 1)
    },
    goPrev(){
      self.goIndex(self.activeIndex + 1)
    }
  })
})

Define({
  name : 'booklet',
  props : {
    type : types.literal('booklet'),
    menu : types.maybe(GetDefinition('menu')),
    viewport : types.maybe(GetDefinition('viewport')),
    nodes : types.optional(AnyMap, {})
  },
  actions : self => ({
    addNode(node, parentId){
      if (!isRoot(self)) throw new Error(`nodes must be added to root only (cwd : ${getPath(self)}):\n${getSnapshot(node)}`);
      if (isStateTreeNode(node)) node = getSnapshot(node)
      self.nodes.set(node.id, node)
    },
    _afterCreate(node){
      if (node === self) console.log("SELF")
      if (node.attachToChildren) node.attachToChildren()
      if (node.replaceChildrenWithReferences) node.replaceChildrenWithReferences()
      if (node._attachToChildren) node._attachToChildren()
      if (node._replaceChildrenWithReferences) node._replaceChildrenWithReferences()
    },
    afterCreate(){
      if (!self.menu) self.menu = {type : 'menu'}
      if (!self.viewport) self.viewport  = {type : 'viewport'}
      console.log('booklet afterCreate')
      walk(self, self._afterCreate)
      console.log(self, getSnapshot(self))
    }

  }),
  mixins : ['collection', 'menuItem']
})

Define({
  name : '_input',
  props : {
    value : Any
  },
  actions : self => ({
    onEdit(){
      self.focus()
    },
    onConfirm(){
      self.unFocus()
    },
    onChange(value){
      self.value = value
    },
  })
})

Define({
  name : 'page',
  mixins : ['collection','menuItem','viewportItem']
})

Define({
  name : 'section',
  mixins : ['collection','menuItem']
})

Define({
  name : 'text',
  props : {
    editable : false,
    header : types.maybe(types.string),
    value : types.string
  },
  mixins : ['_input']
})

Define({
  name : 'text_input',
  props : {
    prompt : types.string,
    placeholder : ''
  },
  mixins : ['_input']
})


/*
const prompt = types.optional(types.string, '')

const cues = types.optional(types.array(types.string), [])

const editing = types.maybe(types.reference(note))

const essay = node.named('essay').props({
  type : types.literal('essay'),
  prompt,
  notes,
  cues,
  editing
}).views(self => ({
  get fresh_cues(){
    if (!self.notes.length) return self.cues;
    
    let cues = self.cues.filter(cue => self.notes.map(({placeholder}) => placeholder).indexOf(cue) === -1)
    if (!cues.length) return self.cues;
    return cues;
  },
  get placeholder(){
    return self.fresh_cues[self.notes.length % self.fresh_cues.length];
  }
})).actions(self => ({
  afterCreate(){
    console.log("afterCreate(")
    self.maybeCreateNote()
  },

  createNote(){
    self.notes = self.notes.concat([{
      placeholder : self.placeholder
    }])
  },

  deleteNote(note){
    let index = self.notes.indexOf(note);
    self.notes = self.notes.slice(0, index).concat(self.notes.slice(index + 1))
  },

  onEdit(id){
    self.editing = id;
  },

  maybeCreateNote(){
    if (self.notes.filter(note => !note.value).length === 0){
      console.log("create")
      self.createNote();
    }
  },

  onConfirm(note){
    self.editing = null;

    if (!note.value) {
      self.deleteNote(note);
    }

    self.maybeCreateNote();
  }
}))

const title_note = note.named('title_note')
.views(self => ({
  get _essay(){return {}}
}))
.actions(self => ({
  onEdit(){},
  onConfirm(){}
}))

const factory = node.named('factory').props({
  type : types.literal('factory'),
  prompt,
  title_note,
  template : essay,
  appendix_template : section_scaffold
}).actions(self => ({
  createEssay(){
    console.log(self)
    let essay = self._section.createChild({
      type : 'essay',
      title : self.title_note.value,
      cues : JSON.parse(JSON.stringify(self.template.cues)),
      prompt : self.template.prompt + ''
    }, -1)
    console.log(self.appendix_template);
    self._section._section.children[self._section._section.children.length - 1].fromScaffold(Object.assign({
      ref : essay.id,
    }, self.appendix_template), self._section._section)

  }
}))

const _factory = types.reference(factory)
*/
export {Define, GetDefinition, Any}