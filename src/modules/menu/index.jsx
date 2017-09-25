import React, {Component} from 'react'
import {types, getPathParts} from 'mobx-state-tree'
import {section, _section} from '../section'
import {view, _view} from '../view'

import {any, _any as _selected} from '../any'

const MenuItem = observer(({node, key}) => (
  <Collapse key={key} isOpen={node.menuIsOpen}>
    <ListItem 
      key={index} 
      onClick={node.onMenuSelect} 
      style={{background : node.background}}>
      {node.menuIcon}
      {node.title}
    </ListItem>
  </Collapse>
))

const RenderMenuItem = (node, index) => (
  <MenuItem node={node} key={index}/>
) 

const Menu = observer(({menu}) => (
  <Page>
    <List
      dataSource={menu._section.lineage}
      renderRow={RenderMenuItem}
    />
  </Page>
))

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
}).views(self => ({
  get menu(){
    return <Menu menu={self}/>
  }
})).actions(self => ({
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