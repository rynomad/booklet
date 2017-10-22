import React from 'react'
import {Collapse} from "@blueprintjs/core"
import {List, ListItem, Icon} from 'react-onsenui'
import {observer} from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const MenuItem = observer(({store, id}) => (
  <Collapse key={id} isOpen={store.isOpenInMenu}>
    <ListItem 
      onClick={store.selectInMenu} 
      style={{background : store.menuBackground}}>
      <Icon style={{ paddingLeft : `${store.depth}em`}} icon={store.menuIcon}/>
      {store.title || `${store.menuIcon}`}
    </ListItem>
  </Collapse>
))

const Menu = observer(({store}) => {
  console.log(store.menu.parent.lineage[0])
  return <List
    dataSource={store.menu.parent.lineage}
    renderRow={(store, index) => (<MenuItem store={store} key={index} id={index}/>)}
  />
})

export default Menu