import {types} from 'mobx-state-tree'

import section from '../section'
import static_page from '../static_page'

const any = types.late(() => types.union(section, static_page))
const _any = types.reference(any)
export { any, _any }
