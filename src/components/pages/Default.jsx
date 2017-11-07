

import React from 'react'
import {Card, Col} from 'react-onsenui'
import Text from '../items/Text.jsx'
import Factory from '../items/Factory.jsx'
import {observer} from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

const PageItemInner = observer(({store}) => {
  switch(store.type){
    case 'factory': return <Factory store={store}/>
    case 'text': return <Text store={store}/>
    default : return <div>{store.id}</div>
  }
})

const PageItemHeader = ({store}) => (
  <div>
    <h5 style={{textAlign : 'center'}}>{store.title}</h5>
  </div>
)

const pass = i => i

const PageItem = ({store, dragHandle = pass }) => 
  <Card>
    {store.title ? dragHandle(<PageItemHeader store={store}/>) : null}
    <hr/>
    <PageItemInner store={store}/>
  </Card>

const Page = observer(({store, dragHandle}) => 
  <Col>
    {
      store.items.map((item, key) => 
        <PageItem key={key} store={item}/>
      )
    }
  </Col>
)

export {PageItemInner, PageItemHeader}

export default Page