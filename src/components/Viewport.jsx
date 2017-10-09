import React from 'react'
import { Carousel, CarouselItem } from 'react-onsenui'
import { observer } from 'mobx-react'
import StaticPage from './StaticPage'
import Essay from './Essay'

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const ViewPage = observer(({store}) => {
  switch (store.type){
    case 'static_page': return <StaticPage store={store}/>
    case 'essay' : return <Essay store={store}/>
    default : throw new Error(`no component for type ${store.type}`)
  }
})

const Viewport = observer(({store}) => (
  <Carousel index={store.viewIndex} onOverscroll={store.onViewOverscroll} onPostChange={store.onViewPostChange} fullscreen swipeable autoScroll overscrollable>
    {
      store.posterity.map((store, index) =>
        <CarouselItem key={index} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <ViewPage store={store}/>
        </CarouselItem>
      )
    }
  </Carousel>
))

export default Viewport