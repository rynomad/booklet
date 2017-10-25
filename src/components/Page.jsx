import React from 'react'
import StaticPage from './StaticPage'
import Essay from './Essay.jsx'
import Text from './Text.jsx'
import EssayFactory from './EssayFactory.jsx'
import {observer} from 'mobx-react'
import {Collapse} from "@blueprintjs/core"
import {Card, Col} from 'react-onsenui'

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