import React, {Component} from 'react'
import {observer} from 'mobx-react'
import DraggableList from 'react-draggable-list'
import {Card} from 'react-onsenui'
import {Collapse} from '@blueprintjs/core'
import {PageItemInner, PageItemHeader} from './Default.jsx'


class SortablePageItem extends Component{
  getDragHeight(){
    return 70
  }
  render(){
    const {item, dragHandle, anySelected} = this.props
    return (
      <Card>
        {item.title ? dragHandle(<PageItemHeader store={item}/>) : null}
        <Collapse isOpen={anySelected < 0.4}>
          <hr/>
          <PageItemInner store={item}/>
        </Collapse>
      </Card>
    )
  }
}

const SortablePage = observer(({store}) => <DraggableList
                                              itemKey="id"
                                              template={SortablePageItem}
                                              list={store.items.map(item => item)}
                                              onMoveEnd={store.setItems}
                                              container={()=>document.body}
                                            />)

export default SortablePage