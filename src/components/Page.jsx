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
  //<Collapse isOpen={true || store.isOpenInViewPort}>
    <Card>
      <PageItemInner store={store} pos={pos}/>
    </Card>
  //</Collapse>
)

const PageInner = observer(({store, topTop}) => 
  <Col>
  {
    store.items.map((item, index) =>
      <Draggable
      key={index}
      axis={'y'}
      position={null}
      onDrag={(e, data) => {
        const prev = index ? store.items[index - 1] : null
        const next = index < (store.items.length - 1)  ? store.items[index + 1] : null
        const absolute = data.y + item._position
        console.log(index)
        if (prev && absolute < prev._position){
          console.log("move up", index)
          store.move(index, index - 1)
          console.log(store.items.indexOf(item))
        } else if (next && absolute > next._position){
          console.log("move down", index)
          store.move(index, index + 1)
        }
      }}
      onStart={(e, data) => {
        console.log(data.y, item._position)
      }}
      onStop={(e, data) => {
        console.log(data.y, item._position)
      }}
      >
        <TrackedDiv key={index} formulas={[topTop]}>
          {
            pos => {
              console.log(item)
              item.setPosition(pos)
              return <PageItem store={item}/>
            }
          }
        </TrackedDiv>  
      </Draggable>
    )
  }
  </Col>
)

const Page = ({store}) => (
  <TrackDocument updateOnDidMount formulas={[topTop]}>
  {
    (topTop) => <PageInner store={store} topTop={topTop}/>
  }
  </TrackDocument>
)

export default Page