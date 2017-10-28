import {page} from './page'
import {sorter} from './sorter'
import {Define} from '../Stores'

export default () => {
  Define(page)
  Define(sorter)
}