import React from 'react'
import {Collapse} from "@blueprintjs/core"
import {List, ListItem} from 'react-onsenui'
import {observer} from 'mobx-react'

const MenuItem = observer(({store}) => (
  <Collapse isOpen={store.menuIsOpen}>
    <ListItem 
      onClick={store.onMenuSelect} 
      style={{background : store.background}}>
      {store.menuIcon}
      {store.title}
    </ListItem>
  </Collapse>
))

const Menu = observer(({store}) => (
  <List
    dataSource={store.lineage}
    renderRow={(store, index) => (<MenuItem store={store} key={index}/>)}
  />
))

export default Menu