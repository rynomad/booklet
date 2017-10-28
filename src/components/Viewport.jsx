import React from 'react'
import { Carousel, CarouselItem } from 'react-onsenui'
import { observer } from 'mobx-react'
import Page from './Page'

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const Viewport = observer(({store}) => (
  <Carousel index={store.activeIndex} onOverscroll={store.onViewOverscroll} onPostChange={(evt) => {
    console.log(evt)
    store.goIndex(evt.activeIndex)
  }} fullscreen swipeable autoScroll overscrollable>
    {
      store.items.map((store, index) =>
        <CarouselItem key={index}>
          <Page store={store}/>
        </CarouselItem>
      )
    }
  </Carousel>
))

export default Viewport