import {types} from 'mobx-state-tree'

import {node} from '../node'
import {static_page, _static_page} from '../static_page'
import {essay, _essay, note} from '../essay'

const any = types.late(() => types.union(section, static_page, essay, note))
const _any = types.late(() => types.union(_section, _static_page, _essay))

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
/*
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
*/
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
}))

const _section = types.reference(section)

export {section, _section, any, _any}