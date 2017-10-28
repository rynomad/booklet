import {Define} from '../Stores'

import {text} from './text'
import {factory} from './factory'

export default () => {
  Define(text)
  Define(factory)
}