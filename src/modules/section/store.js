import {types, hasParent, getParent} from 'mobx-state-tree'

import any from '../any'

const type = types.literal('section')

const _children = types.optional(types.array(any), [])

const section = node.named('section').props({
  type,
  _children
}).views(self => ({
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