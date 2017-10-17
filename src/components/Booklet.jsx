import React from 'react'

import Viewport from './Viewport'
import Menu from './Menu'
import {observer} from 'mobx-react'
import {Toolbar, ToolbarButton, Page, Splitter, SplitterSide, SplitterContent, Icon} from 'react-onsenui'

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'


const ToolbarWrapper = observer(({store}) => (
  <Toolbar>
    <div className='left'>
      <ToolbarButton onClick={store.showMenu}>
        <Icon icon='ion-navicon, material:md-menu' />
      </ToolbarButton>
    </div>
    <div className='center'>{store.viewPage.title}</div>
  </Toolbar>
))


const Booklet = observer(({store}) => (
  <Splitter>
  <SplitterSide
    style={{
        boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    }}
    side='left'
    width={200}
    collapse={true}
    isOpen={store._menuOpen}
    onClose={store.hideMenu}
    onOpen={store.showMenu}
  >
    <Page>
      <Menu store={store}/>
    </Page>
  </SplitterSide>
  <SplitterContent>
    <Page renderToolbar={() => (<ToolbarWrapper store={store}/>)} >
      <Viewport store={store}/>
    </Page>
  </SplitterContent>
</Splitter>
))

export default Booklet