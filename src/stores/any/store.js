import {types} from 'mobx-state-tree'

import section from '../section/store.js'
import static_page from '../static_page/store.js'

const any = types.late(() => types.union(section, static_page))
const _any = types.reference(any)
export { any, _any }
