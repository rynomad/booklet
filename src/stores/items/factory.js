import {types, getSnapshot} from 'mobx-state-tree'
import {Any} from '../Stores'

const factory = {
  name : 'factory',
  props : {
    editable : true,
    button : 'create',
    template_item : Any,
    template_appendix : Any
  },
  actions : self => ({
    create(){
      const item = self.template_item.deepClone()
      item.title = self.value
      self.parent.insert(item, -2)
      self.value = ''
      if (self.template_appendix){
        console.log("template appendix")
        const appendix = self.template_appendix.deepClone()
        self.parent.parent.insert(appendix, -1)
        console.log(getSnapshot(self._root))
      }
    }
  }),
  mixins : ['text']
}

export {factory}