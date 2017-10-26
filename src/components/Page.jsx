import React from 'react'
import {Card, Col} from 'react-onsenui'
import {Collapse} from '@blueprintjs/core'
import {observer} from 'mobx-react'

import Text from './Text.jsx'

const PageItemInner = observer(({store}) => {
  console.log("inner", store)
  switch(store.type){
    case 'text': return <Text store={store}/>
    default : return <div>{store.value}</div>
  }
})

const PageItem = observer(({store}) => (
  <Collapse isOpen={true || store.isOpenInViewPort}>
    <Card>
      <PageItemInner store={store}/>
    </Card>
  </Collapse>
))

const Page = observer(({store}) => (
  <Col>
    {
      store.items.map((item, index) => <PageItem key={index} store={item}/>)
    }
  </Col>
))

export default Page