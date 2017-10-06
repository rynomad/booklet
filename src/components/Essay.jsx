import React from 'react'
import { EditableText, Collapse } from "@blueprintjs/core"
import { Card, Col } from 'react-onsenui'
import { observer } from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const Note = observer(({ store }) => (
  <Collapse isOpen={store.isOpen}>
    <Card>
      <EditableText 
        multiline
        placeholder={store.placeholder}
        value={store.value}
        onEdit={store.onEdit}
        onChange={store.onChange}
        onConfirm={store.onConfirm}
        />
    </Card>
  </Collapse>
))

const Essay = observer(({store}) => (
  <div style={{flex : 2, marginBottom : "auto"}}>
    <div style={{marginBottom : "auto"}}>
      <br/>
        <h3 style={{lineHeight:"110%", textAlign: "center", marginRight : "1em", marginLeft : "1em"}}>{store.prompt}</h3>
      <hr/>
    </div>
    <Col style={{marginTop : "auto"}}>
    { 
      store.notes.map((note, index) => 
        <Note
          key={index}
          store={note}
          />
      ) 
    }
    </Col>
  </div>
))

export default Essay