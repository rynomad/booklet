import React from 'react'
import { Carousel, CarouselItem } from 'react-onsenui'
import { observer } from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const Viewport = observer(({store}) => (
  <Carousel index={store.viewIndex} onOverscroll={store.onViewOverscroll} onPostChange={store.onViewPostChange} fullscreen swipeable autoScroll overscrollable>
    {
      store.posterity.map((store, index) =>
        <CarouselItem key={index} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div>{store.title}</div>
        </CarouselItem>
      )
    }
  </Carousel>
))

export default Viewport