import React from 'react'
import {Card,Row} from 'react-onsenui'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import {observer} from 'mobx-react'

class StaticPage extends React.Component {
  render(){
    return (
      <Card style={{verticalAlign: 'middle', padding: "1em", margin: "2em"}}>
      {
        this.props.static_page.text.map(text => (
          <Row style={{justifyContent : 'center', paddingBottom : "1em"}}>
            <h5 style={{align : 'center'}}>{text}</h5>
          </Row>
        ))
      }
      </Card>
    )
  }
}

export default observer(StaticPage)


