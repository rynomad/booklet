import React, {Component} from 'react'
import {observer} from 'mobx-react'
import DraggableList from 'react-draggable-list'
import {PageItem} from './Default.jsx'


class SortablePageItem extends Component{
  render(){
    const {item, dragHandle} = this.props
    return dragHandle(<PageItem store={item}/>)
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