import React from 'react'
import {observer} from 'mobx-react'

import SortablePage from './pages/Sortable'
import DefaultPage from './pages/Default'


const Page = observer(({store}) => {
  console.log(store.type)
  switch (store.type){
    case 'sorter' : return <SortablePage store={store}/>
    case 'page' :
    default : return <DefaultPage store={store}/>
  }
})

export default Page