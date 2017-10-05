import {types} from 'mobx-state-tree'

import {section, _section} from '../section'
import {static_page, _static_page} from '../static_page'
import {essay, _essay, note} from '../essay'
const any = types.late(() => types.union(section, static_page, essay, note))
const _any = types.late(() => types.union(_section, _static_page, _essay))
console.log(any, _any)
export { any, _any }
