import {types, getSnapshot, detach, getRoot, isStateTreeNode} from 'mobx-state-tree'
import {AnyArray, Any, Define} from '../Stores'
const _menuItem = {
  name : '_menuItem',
  props : {
    _isMenuItem : types.optional(types.literal(true), true),
  },
  views : self => ({
    get hasMenu(){
      if (!self._root.menu || self._root.menu.type !== 'menu') {
        console.warn('no menu on root')
        return false
      }
      return true
    },
    get isSelectedInMenu(){
      return self.hasMenu && (self._root.menu.selected === self)
    },
    get isOpenInMenu(){
      return (self.isFocused || self.isChildOfFocused || self.isYoungerSiblingOfFocused) && !self.isOlderSiblingOfFocused
    }
  }),
  actions : self => ({
    selectInMenu(){
      if (self.hasMenu){
        self._root.menu.onSelect(self)
      }
    }
  })
}

const _viewportItem = {
  name : '_viewportItem',
  props : {
    _isViewportItem : types.optional(types.literal(true), true)
  },
  mixins : ['_menuItem']
}

const _collection = {
  name : '_collection',
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
  actions : self => ({
    insert(item, index = 0){
      if (index < 0) index += self.items.length

      const insert = (typeof item === 'string') ? item : isStateTreeNode(item) ? item.id : item
      self.items.unshift(insert)
      self.move(0, index)
      if (!isStateTreeNode(item)){
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

const _input = {
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
}

const _page = {
  name : '_page',
  mixins : ['_collection','_menuItem','_viewportItem']
}

const _section = {
  name : '_section',
  mixins : ['_collection','_menuItem']
}

const _text = {
  name : '_text',
  props : {
    editable : false,
    header : types.maybe(types.string),
    value : types.string
  },
  mixins : ['_input']
}

export default () => {
  Define(_menuItem)
  Define(_viewportItem)
  Define(_collection)
  Define(_input)
  Define(_page)
  Define(_section)
  Define(_text)
}

export {_collection, _input, _page, _section, _text}