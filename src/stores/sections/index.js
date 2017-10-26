import {booklet} from './booklet'
import {section} from './section'
import {Define} from '../Stores'

export default () => {
  Define(section)
  Define(booklet)
}