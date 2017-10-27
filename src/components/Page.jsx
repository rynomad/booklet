import React, {Component} from 'react'
import {Card, Col} from 'react-onsenui'
import {Collapse} from '@blueprintjs/core'
import {observer} from 'mobx-react'
import Draggable from 'react-draggable'
import {TrackDocument, Track, TrackedDiv} from 'react-track'
import {topTop} from 'react-track/tracking-formulas';

import Text from './Text.jsx'

const PageItemInner = observer(({store, pos}) => {
  console.log("inner", store, pos)
  switch(store.type){
    case 'text': return <Text store={store}/>
    default : return <div>{store.value}</div>
  }
})

const PageItem = observer(({store, pos}) => 
  <Collapse isOpen={true || store.isOpenInViewPort}>
    <Card>
      <PageItemInner store={store} pos={pos}/>
    </Card>
  </Collapse>
)

const Page = observer(({store}) => (
  <TrackDocument formulas={[topTop]}>
  {(topTop) => 
    <Col>
    {
      store.items.map((item, index) =>
        <Draggable
        axis={'y'}

        >
          <TrackedDiv key={index} formulas={[topTop]}>
            {
              pos => {
                console.log(item.id, pos)
                return <PageItem store={item}/>
              }
            }
          </TrackedDiv>  
        </Draggable>
      )
    }
  </Col>
  }
  </TrackDocument>
))

export default Page