import React from 'react'
import { EditableText, Collapse } from "@blueprintjs/core"
import { Card, Col } from 'react-onsenui'
import { observer } from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const Header = ({store}) => (
  <div>
    <h5 style={{textAlign : 'center'}}>{store.header}</h5>
    <hr/>
  </div>
)

const Text = observer(({store}) => (
  <div>
    {store.header ? <Header store={store}/> : null}
    {
      store.editable ? <EditableText 
                        multiline
                        placeholder={store.placeholder}
                        value={store.value}
                        onEdit={store.onEdit}
                        onChange={store.onChange}
                        onConfirm={store.onConfirm}
                        /> 
                     : <p>{store.value}</p>
    } 
  </div>
))

export default Text