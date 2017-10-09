import React from 'react'
import {observer} from 'mobx-react'
import {Card, Row} from 'react-onsenui'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'

const StaticPage = observer((props, a2, a3) => {
  console.log(props, a2, a3);  
  return (
    <Card style={{verticalAlign: 'middle', flex : "1", padding: "1em", margin: "2em"}}>
    {
      props.store.text.map((text, index) => (
        <Row key={index} style={{justifyContent : 'center'}}>
          <h5 style={{align : 'center'}}>{text}</h5>
        </Row>
      ))
    }
    </Card>
  )
})

export default StaticPage