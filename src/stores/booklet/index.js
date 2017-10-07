import {types} from 'mobx-state-tree'

import {static_page, _static_page} from '../static_page'
import {essay, _essay, note} from '../essay'

const any = types.late(() => types.union(section, static_page, essay, note))
const _any = types.late(() => types.union(_section, _static_page, _essay))

const ids = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)

const id = types.optional(types.identifier(types.string), () => ids())

const title = types.maybe(types.string)

const _section = types.late(() => types.maybe(types.reference(section)))
const _booklet = types.maybe(types.late(() => types.reference(booklet)))

const node = types.model('node',{
  id,
  _section,
  _booklet,
  title
}).actions(self => ({
  onMenuSelect(){
    self._booklet.menu.onMenuSelect(self.id)
  }
})).views(self => ({
  get iconStyle(){
    return ({ width : `${self.depth * .3}em`, paddingLeft : `${(self.depth - 1) * .3}em`});
  },
  get menuIcon(){
    return 'md-circle'
  },
  get menuBackground(){
    if (self.isSelected){
      return "#CCC"
    }
    return "white"
  },
  get currentSelected(){
    return self._booklet.menu._selected
  },
  get siblingIndex(){
    if (!self._section) return -1;
    return self._section.children.indexOf(self);
  },
  get isRoot(){
    return !self._section
  },
  get isSelected(){
    return self.currentSelected === self
  },
  get isAncestorOfSelected(){
    let next = self.currentSelected._section;
    while (next){
      if (next === self) return true
      next = next._section
    }
    return false;
  },
  get isChildOfSelected(){
    return (self.currentSelected._section === self)
  },
  get isYoungerSiblingOfSelected(){
    let currentSelected = self.currentSelected
    let selectedParent = currentSelected._section

    return self._section === selectedParent && self.siblingIndex >= currentSelected.siblingIndex 
  },
  get menuIsOpen(){
    return self.isRoot || self.isSelected || self.isAncestorOfSelected || self.isChildOfSelected || self.isYoungerSiblingOfSelected
  }
}))

const type = types.literal('section')

const children = types.optional(types.array(_any), [])
const section = node.named('section').props({
  type,
  children
}).views(self => ({
  get menuIconClass(){
    if (self.isSelected || self.isAncestorOfSelected){
      return 'md-chevron-down'
    } else {
      return 'md-chevron-right'
    }
  },

  get lineage(){
    return [self].concat(self.children.reduce(this.childReducer.bind(self, []), []))
  },

  get posterity(){
    return self.lineage.filter(node => !node.lineage)
  },

  childReducer(items, node){
    if (node.lineage){
      return items.concat(node.lineage);
    } else {
      return items.concat([node]);
    }
  }
})).actions((self) => ({
  createChild(obj){
    let node = {
      id : `${self.id}_${obj.type}-${ids()}`,
      _booklet : self._booklet.id,
      _section : self.id,
      ...obj
    }
    self._booklet.addNode(node);
    self.children.push(node.id);
  }
}))


const nodes = types.array(any);
const root = section.named('root')

const booklet = node.named('booklet').props({
  nodes,
  root
})

const processNode = (scaffold, booklet, section) => {
  let _booklet = booklet.id
  let _section = _booklet
  let {type, children, title} = scaffold
  let id = ids()
  if (section){
    _section = section.id
    section.children.push(id)
  }

  let node = null
   

  if (type === `section`){
    node = {id, type, title, _booklet, _section, children : []};
    children.forEach((scaffold) => processNode(scaffold, booklet, node))
  } else {
    node = {id, type, title, _booklet, _section, ...scaffold }
  }

  booklet.nodes.push(node)
} 

const createBooklet = ({id, title, children}) => {
  let _booklet = { id, title, nodes : [] }
  children.forEach((scaffold) => processNode(scaffold, _booklet))
  return booklet.create(_booklet)
}

export {node, any, _any, booklet, _booklet, section, _section, createBooklet}