import {booklet, menu, viewport} from './booklet'
import {section} from './section'
import {Define} from '../Stores'
import {appendix, appendices} from './appendix'

export default () => {
  Define(menu)
  Define(viewport)
  Define(section)
  Define(booklet)
  Define(appendix)
  Define(appendices)
}