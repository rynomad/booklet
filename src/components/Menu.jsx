import React from 'react'
import {Collapse} from "@blueprintjs/core"
import {List, ListItem, Icon} from 'react-onsenui'
import {observer} from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const MenuItem = observer(({store, id}) => (
  <Collapse key={id} isOpen={store.menuIsOpen}>
    <ListItem 
      onClick={() => store.onMenuSelect(store.id)} 
      style={{background : store.menuBackground}}>
      <Icon style={store.menuIconStyle} icon={store.menuIcon}/>
      {store.title || `${store.menuIcon}`}
    </ListItem>
  </Collapse>
))

const Menu = observer(({store}) => (
  <List
    dataSource={store.lineage}
    renderRow={(store, index) => (<MenuItem store={store} key={index} id={index}/>)}
  />
))

export default Menu