import React from 'react'
import {Collapse} from "@blueprintjs/core"
import {List, ListItem, Icon} from 'react-onsenui'
import {observer} from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const MenuItem = observer(({store}) => (
  <Collapse isOpen={true}>
    <ListItem 
      onClick={store.onMenuSelect} 
      style={{background : store.menuBackground}}>
      <Icon style={store.menuIconStyle} icon={store.menuIcon}/>
      {store.title || `${store.menuIcon} ${store.title}`}
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