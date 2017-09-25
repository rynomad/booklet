import {types, hasParent, getParent} from 'mobx-state-tree'

import any from '../any'

const type = types.literal('section')

const _children = types.optional(types.array(any), [])

const section = node.named('section').props({
  type,
  _children
}).views(self => ({
  get menuIconClass(){
    if (self.isSelected || self.isAncestorOfSelected){
      return 'md-chevron-down'
    } else {
      return 'md-chevron-right'
    }
  },

  get menuIcon(){
    let length = getPathParts(self).length
    let width = `${length * .3}em`
    let paddingLeft = `${(length - 1) * .3}em`
    return (
      <div style={{width, paddingLeft}}>
        <Icon icon={self.menuIconClass}/>
      </div>
    )
  },

  get lineage(){
    return [self].concat(self.children.reduce(this.childReducer.bind(self, []), []))
  }

  get posterity(){
    return self.lineage.filter(node => !node.lineage)
  }

  get children(){
    return self._children
  },

  childReducer(items, node){
    if (node.lineage){
      return items.concat(node.lineage);
    } else {
      return items.concat([node]);
    }
  }
}))

const _section = types.reference(section)

export {section, _section}