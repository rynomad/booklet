import {types, getParent, getSnapshot, getRelativePath, isRoot, detach, getPath, getRoot, getType, isStateTreeNode} from 'mobx-state-tree'
import uuid4 from 'uuid/v4'
import json_stringify from 'safe-json-stringify'

const NODES = new Map()
const noop = () => ({})
window.nodes = NODES


const Define = (name, props = noop, views = noop, actions = noop, ...mixins) => {
  if (!name) throw new Error(`node required`)
  if (NODES.has(name)) throw new Error(`already have type ${name}`)
  mixins = mixins.map(name => NODES.get(name).types[1])

  mixins.push(node.props({
    id : types.optional(types.identifier(), () => `${name}/${uuid4()}`),
    type : name,
    nodes : types.maybe(AnyMap),
    ...props
  }).actions(actions).actions(self => {
    let oldAfterCreate = self.afterCreate || noop
    return ({
      afterCreate(){
        oldAfterCreate()

        setImmediate(() => {
          const _root = self._root
          if (_root === self || _root.nodes === self || _root.nodes === getParent(self)) return

          const parent = getParent(self)
          const propName = getRelativePath(parent, self).slice(1);
          if (parent.replaceWithReference) {
            self.set('parent', parent.id)
            parent.replaceWithReference(propName)
          } else if (parent.constructor.name === 'ObservableArray'){
            const grandparent = getParent(parent)
            const arrayPropName = getRelativePath(grandparent, parent).slice(1)
            self.set('parent', grandparent.id)
            grandparent.replaceArrayMemberWithReference(arrayPropName, Number.parseInt(propName, 10))
          } else {
            console.warn(`don't know what's going on here, expected property or array`)
            console.warn(`parent : \n${json_stringify(getSnapshot(parent))}`)
          }
        })
      },
      set(propName, value){
        self[propName] = value;
      },
      addNode(node, parentId){
        if (!isRoot(self)) throw new Error(`nodes must be added to root only (cwd : ${getPath(self)}):\n${getSnapshot(node)}`);
        if (!self.nodes) self.nodes = {}
        console.log(node, isStateTreeNode(node))
        if (isStateTreeNode(node)) node = getSnapshot(node)
        console.log(self.nodes)
        self.nodes.set(node.id, node)
      },
      replaceWithReference(propName){
        const node = self[propName]
        detach(self[propName])
        getRoot(self).addNode(node, self.id)
        self[propName] = node.id
      },
      replaceArrayMemberWithReference(propName, index){
        const node = self[propName][index]
        detach(self[propName][index])
        console.log("new array", getSnapshot(self[propName]))
        getRoot(self).addNode(node, self.id)
        self[propName].splice(index, 0, node.id)
      },
      clone(){

      },
      deepClone(){

      }
    })
  }))

  const type = types.compose.apply(types, mixins).named(name)

  const reference = types.reference(type);

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
      throw new Error(`unknown object:\n${json_stringify(snapshot)}`)
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
  get _focus(){
    return (self.parent && self.parent.focus) || noop
  },
  get focus(){
    return (id) => (self.focused = id) && self._focus(self.id)
  },
  get _unFocus(){
    return (self.parent && self.parent.unFocus) || noop
  },
  get unFocus(){
    return () => {(self.focused = undefined); self._unFocus()}
  },
  get depth(){
    let depth = 0
    let parent = self.parent
    while (parent) ++depth && (parent = parent.parent)
    return depth
  },
  get deepFocused(){
    let focused = self.focused
    while (focused && focused.focused) focused = focused.focused
    return focused
  },
  get isFocused(){
    return self.isRoot || self.parent.focused === self
  },
  get isChildOfFocused(){
    return self.isRoot || self.parent.isFocused
  },
  get isYoungerSiblingOfFocused(){
    return self.isRoot || (self.parent.focused && self.parent.focused._index < self._index)
  }
}))

Define(
  'collection',
  {
    items : AnyArray
  }, 
  self => ({   
    get lineage(){
      return [self].concat(self.items.reduce((items, node) => {
        if (node.lineage){
          return items.concat(node.lineage);
        } else {
          return items.concat([node]);
        }
      }, []))
    },
    get posterity(){
      return self.lineage.filter(node => !node.lineage)
    }
  }),
  self => ({
    insert(item, index = 0){
      if (index < 0) index += self.items.length

      const insert = (typeof item === 'string') ? item : isStateTreeNode(node) ? item.id : item
      self.items.unshift(insert)
      self.move(0, index)
    },
    delete(item){
      self.items.splice(item._index, 1)
    },
    move(itemOrIndex, index){
      if (index < 0) index += self.items.length
      if (0 <= index && index < self.items.length) throw new Error('index out of bounds')
      const item = (typeof itemOrIndex === 'number') ? self.items[itemOrIndex] : itemOrIndex
      self.items.splice(index, 0, self.items.splice(item._index, 0))
    }
  })
)

Define(
  'menuItem',
  {
    _isMenuItem : types.optional(types.literal(true), true),
  },
  self => ({
    get isSelectedInMenu(){
      if (!self._root.menu || self._root.menu.type !== 'menu') throw new Error('no menu on root')
      return self._root.menu.selected === self
    },
    get isOpenInMenu(){
      return self.isFocused || self.isYoungerSiblingOfFocused
    }
  })
)

Define(
  'viewportItem',
  {
    _isViewportItem : types.optional(types.literal(true), true)
  },
  undefined,
  undefined,
  'menuItem'
)

Define(
  'menu', 
  {
    open : false,
    selected : Any
  },
  self => ({
    get items(){
      if (!self.parent) throw new Error('menu has no parent to get items from')
      if (!self.parent.lineage) throw new Error('menu parent has no lineage')
      return self.parent.lineage.filter(item => item._isMenuItem)
    }
  }),
  self => ({
    open(){
      self.open = true
    },
    close(){
      self.open = false
    },
    onSelect(node){
      self.selected = node.id
      if (node._isViewportItem) self.close()
    }
  })
)

Define(
  'viewport',
  {
    selected : Any
  },
  self => ({
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
  self => ({
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
)



Define(
  'booklet',
  {
    type : types.literal('booklet'),
    _menuOpen : false,
    _menuSelected : Any
  },
  (self) => ({
    get menuItems(){

    },
    get viewPage(){
      let index = self.lineage.indexOf(self.menuSelected);
      while(self.lineage[index].lineage) index++
      return self.lineage[index]
    },
    get viewIndex(){
      return self.posterity.indexOf(self.viewPage)
    }
  }),
  (self) => ({
    onMenuSelect(id){
      self._menuSelected = id;
    },
    onViewPostChange(evt){
      self.onMenuSelect(self.posterity[evt.activeIndex].id)
    },
    showMenu(){
      self._menuOpen = true;
    },
    hideMenu(){
      self._menuOpen = false;
    }
  }),
  'collection'
)




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