

import React from 'react'
import {Card, Col} from 'react-onsenui'
import Text from '../items/Text.jsx'
import {observer} from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

const PageItemInner = observer(({store, pos}) => {
  switch(store.type){
    case 'text': return <Text store={store}/>
    default : return <div>{store.value}</div>
  }
})

const PageItem = ({store}) => <Card><PageItemInner store={store}/></Card>

const Page = observer(({store}) => 
  <Col>
    {
      store.items.map((item, key) => 
        <PageItem key={key} store={item}/>
      )
    }
  </Col>
)

export {PageItem}

export default Page