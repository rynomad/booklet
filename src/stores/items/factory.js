import {types, getSnapshot} from 'mobx-state-tree'
import {Any} from '../Stores'

const factory = {
  name : 'factory',
  props : {
    editable : true,
    button : 'create',
    template: Any
  },
  actions : self => ({
    create(){
      const item = self.template.deepClone()
      console.log(item)
      item.title = item.appendix.title = self.value
      self.parent.insert(item, -2)
      self.value = ''
    }
  }),
  mixins : ['text']
}

export {factory}