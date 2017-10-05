import React from 'react'
import { EditableText, Collapse } from "@blueprintjs/core"
import { Card } from 'react-onsenui'
import { observer } from 'mobx-react'

const Note = observer(({ store }) => (
  <Collapse {...store}>
    <Card>
      <EditableText 
        multiline
        {...store}
        />
    </Card>
  </Collapse>
))

const Essay = observer(({store}) => (
  <div style={{flex : 2, marginBottom : "auto"}}>
    <div style={{marginBottom : "auto"}}>
      <br/>
        <h3 align={'center'} style={{lineHeight:"110%", marginRight : "2em", marginLeft : "2em"}}>{store.prompt}</h3>
      <hr/>
    </div>
    <div style={{marginTop : "auto"}}>
    { 
      store.notes.map((note, index) => 
        <Note
          key={index}
          store={note}
          />
      ) 
    }
    </div>
  </div>
))

export default Essay