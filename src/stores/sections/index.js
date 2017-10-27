import {booklet, menu, viewport} from './booklet'
import {section} from './section'
import {Define} from '../Stores'

export default () => {
  Define(menu)
  Define(viewport)
  Define(section)
  Define(booklet)
}