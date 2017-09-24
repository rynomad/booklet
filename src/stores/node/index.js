import {types, hasParent, getParent} from 'mobx-state-tree'

const id = types.maybe(types.identifier(types.string));

const Node = types.model('node',{
  id
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
  }
}))

export default node