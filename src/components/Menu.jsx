import React from 'react'
import {Collapse} from "@blueprintjs/core"
import {List, ListItem, Icon} from 'react-onsenui'
import {observer} from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const MenuItem = observer(({store}) => (
  <Collapse isOpen={store.isOpenInMenu}>
    <ListItem 
      onClick={store.selectInMenu} 
      style={{ background : `#${store.isSelectedInMenu ? 'CCC' : 'FFF'}`}}>
      <Icon style={{ paddingLeft : `${store.depth}em`}} icon={store.menuIcon}/>
      {store.title || `${store.menuIcon}`}
    </ListItem>
  </Collapse>
))

const Menu = observer(({store}) => {
  console.log(store)
  return <List
    dataSource={store.menu.items}
    renderRow={(store, index) => (<MenuItem store={store} key={index}/>)}
  />
})

export default Menu