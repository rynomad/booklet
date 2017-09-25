import {types} from 'mobx-state-tree'
import {Card,Row} from 'react-onsenui'
import {observer} from 'mobx-react'

import node from '../node'
import React from 'react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

const StaticPage = observer(({static_page}) => (
  <Card style={{verticalAlign: 'middle', padding: "1em", margin: "2em"}}>
  {
    this.props.static_page.text.map((text, index) => (
      <Row style={{justifyContent : 'center', paddingBottom : "1em"}}>
        <h5 style={{align : 'center'}}>{text}</h5>
      </Row>
    ))
  }
  </Card>
)

const type = types.literal('static_page')

const text = types.optional(types.array(types.string), [])

const static_page = node.named('static_page',{
  type,
  text
}).views(self => ({
  get page() {
    return <StaticPage static_page={self}/>
  }
  get menuItem(){
    return <MenuItem node={self}/>
  }
}))

const _static_page = types.reference(static_page)

export { static_page as node, _static_page as reference, StaticPage as Component }