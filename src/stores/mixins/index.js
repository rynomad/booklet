import {types, getSnapshot, detach, getRoot, walk} from 'mobx-state-tree'
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

const _lineage = {
  name : '_lineage',
  views : self => ({
    get lineage(){
      if (!self.items) throw new Error('improper mixin of _lineage type with no items')
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
    },
    get snapshot(){
      return getSnapshot(self)
    }
  }),
}

const _collection = {
  name : '_collection',
  props : {
    items : types.optional(AnyArray,[])
  },
  actions : self => ({
    insert(snapshot, index = 0){
      if (index < 0) index += (self.items.length + 1)
      self.items.unshift(snapshot)
      self.move(0, index)
      walk(self, self._root._afterCreate)
      if (self.parent && self.parent.items){
        self.parent.items.forEach(item => item.update && item.update())
      }
      //console.log(getSnapshot(self._root))
    },
    _attachToChildren(){
      //console.log(getSnapshot(self), self._root)
      self.items.forEach((node) => {
        if (node.setProp) node.setProp('parent', self.id)
        else console.log('no .set', node)
      })
    },
    _replaceChildrenWithReferences(){
      self.items.forEach((node, index) => {
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
    move(fromIndex, toIndex){
      if (fromIndex === toIndex) return
      if (toIndex < 0) toIndex += self.items.length
      if (!(0 <= toIndex && toIndex < self.items.length)) return console.warn("ignoring out of bounds move")
      
      const items = JSON.parse(JSON.stringify(self.items))
      //console.log(items)
      items.splice(toIndex, 0, items.splice(fromIndex, 1)[0])
      //console.log(items)
      self.items = items
    },
    setItems(items){
      self.items = items.map(item => item.id ? item.id : item)
      if (self.parent && self.parent.items){
        //console.log('update from setItems')
        self.parent.items.forEach(item => item.update && item.update())
      }
    }
  }),
  mixins : ['_lineage']
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

const _pageItem = {
  name : '_pageItem',
  props : {
    _position : 0,
  },
  actions : self => ({
    setPosition(value){
      self._position = value
    }
  }),
  mixins : ['_tagged']
}

const _section = {
  name : '_section',
  mixins : ['_collection','_menuItem']
}

const _text = {
  name : '_text',
  props : {
    editable : false,
    value : types.maybe(types.string)
  },
  mixins : ['_input', '_pageItem']
}

const _tagged = {
  name : '_tagged',
  props : {
    tag : types.maybe(types.string)
  },
  views : self => ({
    family(){
      //console.log("computing family", self.parent.title);
      const nodes = []
      const tag = self.tag
      walk(self._root.nodes, node => {
        if (node && node.id && (node.tag === tag) && node !== self){
          //console.log(node.title)
          nodes.push(node)
        }
      })
      return nodes
    }
  })
}

export default () => {
  Define(_menuItem)
  Define(_viewportItem)
  Define(_lineage)
  Define(_collection)
  Define(_input)
  Define(_page)
  Define(_section)
  Define(_tagged)
  Define(_pageItem)
  Define(_text)
}

export {_collection, _input, _page, _section, _text}