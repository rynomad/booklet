import {types} from 'mobx-state-tree'
import {Any} from '../Stores'

const factory = {
  name : 'factory',
  props : {
    editable : true,
    button : 'create',
    template_type : 'text',
  },
  actions : self => ({
    create(){
      self.parent.insert({ title : self.value, type : self.template_type, editable : true} , -1)
      self.value = ''
    }
  }),
  mixins : ['text']
}

export {factory}