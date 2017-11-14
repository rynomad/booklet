import {Any} from '../Stores'

const appendix = {
  name : 'appendix',
  mixins : ['_tagged', '_section', '_menuItem']
}

const appendices = {
  name : 'appendices',
  mixins : ['_tagged', '_menuItem', '_section'],
  actions : self => ({
    update(){
      //console.log('update appendices')
      const items = self.family()
                       .filter((item) => item.appendix && item.parent.type !== 'factory')
                       .sort((item1, item2) => item1.parent.items.indexOf(item1) - item2.parent.items.indexOf(item2))
                       .map(({appendix}) => appendix)

      items.forEach(item => {
        item.setProp('parent', self.id)
      })

      self.items = items.map(({id}) => id)
      //console.log(self.items)
    }
  })
}

export {appendix, appendices}