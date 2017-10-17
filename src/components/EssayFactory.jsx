import React from 'react'
import { EditableText } from "@blueprintjs/core"
import { Card, Col, Button } from 'react-onsenui'
import { observer } from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const EssayTitle = observer(({ store }) => (
  <EditableText 
    multiline
    placeholder={store.placeholder}
    value={store.value}
    onEdit={store.onEdit}
    onChange={store.onChange}
    onConfirm={store.onConfirm}
    />
))

const EssayFactory = observer(({store}) => (
  <div style={{flex : 3, marginBottom : "auto"}}>
    <Col style={{marginTop : "auto", marginBottom : "auto", padding : '1em'}}>
      <Card>
        <h3 style={{lineHeight:"110%", textAlign: "center", marginRight : "1em", marginLeft : "1em"}}>{store.prompt}</h3>
      </Card>
      <Card>
        <EssayTitle store={store.title_note}/>
      </Card>
      <Card>
        <Button onClick={store.createEssay} modifier={'large'}>
          Create
        </Button>
      </Card>
    </Col>
  </div>
))

export default EssayFactory