import {types, hasParent, getParent, getRoot, getRelativePath} from 'mobx-state-tree'

const ids = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)

const id = types.optional(types.identifier(types.string), (self) => {
  return `node_${ids()}-${ids()}`
})

const title = types.maybe(types.string)

const node = types.model('node',{
  id,
  title
}).actions(self => ({
  makeId(type){
    let guid = ``
    if (hasParent(self, 2)) guid = `${getParent(self,2).id}_`
    guid = `${guid}${type}-${(((1+Math.random())*0x10000)|0).toString(16).substring(1)}`
    return guid
  },
  afterCreate(){
    if (!self.id){
      self.id = self.makeId()
    }
  },
  onMenuSelect(){
    self.root.menu.select(self)
  }
})).views(self => ({
  get root(){
    return getRoot(self)
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
    return self.root.menu._selected
  },
  get isSelected(){
    return self.currentSelected === self
  },
  get isAncestorOfSelected(){
    return getRelativePath(self.currentSelected, self).split("/").join("").split('.').join('') === ''
  },
  get isChildOfSelected(){
    let path = getRelativePath(self.root.menu._selected, self)
    if (path.indexOf('..') >= 0) return false
    if (path.split('/').length === 2) return true
    return false
  },
  get isYoungerSiblingOfSelected(){
    let parent = getParent(self);
    return parent === getParent(self.currentSelected) && parent.indexOf(self) > parent.indexOf(self.currentSelected)
  },
  get menuIsOpen(){
    return self.isAncestorOfSelected || self.isChildOfSelected || self.isYoungerSiblingOfSelected
  }
}))

export default node