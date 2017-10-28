import React, {Component} from 'react'
import {Card, Col} from 'react-onsenui'
import {Collapse} from '@blueprintjs/core'
import {observer} from 'mobx-react'
import DraggableList from 'react-draggable-list'
import {getSnapshot} from 'mobx-state-tree'

import Text from './Text.jsx'

const PageItemInner = observer(({store, pos}) => {
  console.log("inner", store, pos)
  switch(store.type){
    case 'text': return <Text store={store}/>
    default : return <div>{store.value}</div>
  }
})

class PageItem extends Component{
  render(){
    const {item, itemSelected, dragHandle} = this.props
    return dragHandle(
      <Card>
        <PageItemInner store={item}/>
      </Card>
    )
  }
}

class Page extends Component{
  render(){
    const {store} = this.props
    const items = store.items.map(item => item)
    return <DraggableList
      itemKey="id"
      template={PageItem}
      list={items}
      onMoveEnd={newList => store.setItems(newList)}
      container={()=>this.HTMLElement}
    />
  }
}

export default Page