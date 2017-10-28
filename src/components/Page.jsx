import React from 'react'
import SortablePage from './pages/Sortable'
import DefaultPage from './pages/Default'


const Page = ({store}) => {
  if (store._isSortable){
    return <SortablePage store={store}/>
  } else {
    return <DefaultPage store={store}/>
  }
}

export default Page