import {types} from 'mobx-state-tree'

const type = types.literal('static_page')

const text = types.optional(types.array(types.string), [])

const static_page = types.model('static_page',{
  type,
  text
})

export default static_page