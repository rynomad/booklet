import React from 'react'
import { EditableText } from "@blueprintjs/core"
import { observer } from 'mobx-react'
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const Text = observer(({store}) => (
  <div>
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