import React, {Component} from 'react'
import {Card, Col} from 'react-onsenui'
import {Collapse} from '@blueprintjs/core'
import {observer} from 'mobx-react'
import DraggableList from 'react-draggable-list'
import {_PageItem} from './Default.jsx'


class SortablePageItem extends Component{
  render(){
    const {item, dragHandle} = this.props
    return dragHandle(<_PageItem store={item}/>)
  }
}

const SortablePage = observer(({store}) => <DraggableList
                                              itemKey="id"
                                              template={SortablePageItem}
                                              list={store.items.map(item => item)}
                                              onMoveEnd={newList => store.setItems(newList)}
                                              container={()=>document.body}
                                            />)

export default SortablePage