import {types} from 'mobx-state-tree'
import {section, _section} from '../section'
import {view, _view} from '../view'

import {any, _any as _selected} from '../any'

const type = types.literal('menu')

const isOpen = false

const menu = types.model('menu',{
  isOpen,
  _section,
  _selected,
  _view
}).views(self => ({
  get _open(){
    let lineage = self._section.lineage
    let posterity = self._section.posterity
    let selectedIndex = lineage.indexOf(self._selected)

    for (let i = 0; i < posterity.length ; i++){
      if (lineage.indexOf(posterity[i]) >= selectedIndex)
      return posterity[i];
    }

    return null
  }
}).actions(self => ({
  open(){
    self.isOpen = true
  },
  close(){
    self.isOpen = false
  },
  select(node){
    if (node === self._selected){
      self._selected = node.parent.id
    } else {
      self._selected = node.id
    }

    if (!self._selected.lineage){
      self.close()
    }
  }
}))