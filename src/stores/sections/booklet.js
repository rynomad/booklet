import {types, walk} from 'mobx-state-tree'
import {Any} from '../Stores.js'

const menu = {
  name : 'menu', 
  props : {
    isOpen : false,
    selected : Any
  },
  views : self => ({
    get items(){
      //console.log('get items', self.parent.lineage)
      if (!(self.parent && self.parent.lineage)) {
        console.warn('no or invalid parent')
        return []
      }
      return self.parent.lineage.filter(item => item._isMenuItem)
    }
  }),
  actions : self => ({
    open(){
      //console.log("menu open")
      self.isOpen = true
    },
    close(){
      self.isOpen = false
    },
    onSelect(node){
      //console.log('onSelect', node.title)
      if (self.selected === node) return (node.parent && self.onSelect(node.parent))
      if (self.selected) self.selected.unFocus()
      node.focus()
      self.selected = node.id
      if (node._isViewportItem) {
        self.parent.viewport.goItem(node)
        self.close()
      }
    }
  })
}


const viewport = {
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
      //console.log("goItem")
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
}

const booklet = {
  name : 'booklet',
  props : {
    type : types.literal('booklet'),
    menu : '#menu',
    viewport : '#viewport'
  },
  actions : self => ({
    afterCreate(){
      if (!self.menu) self.menu = {type : 'menu'}
      if (!self.viewport) self.viewport  = {type : 'viewport'}
      walk(self, self._afterCreate)
    }
  }),
  mixins : ['_collection', '_menuItem']
}

export {booklet, menu, viewport}