import {types} from 'mobx-state-tree'

import {node} from '../node'

const type = types.literal('static_page')

const text = types.optional(types.array(types.string), [])

const static_page = node.named('static_page').props({
  type,
  text
})

const _static_page = types.reference(static_page)

export { static_page, _static_page}