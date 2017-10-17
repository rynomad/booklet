import React from 'react'
import StaticPage from './StaticPage'
import Essay from './Essay.jsx'
import EssayFactory from './EssayFactory.jsx'
import {observer} from 'mobx-react'

const Page = observer(({store}) => {
  switch (store.type){
    case 'essay': return (<Essay store={store}/>)
    case 'static_page': return (<StaticPage store={store}/>)
    case 'factory': return (<EssayFactory store={store}/>)
    default : 
      throw new Error(`type '${store.type}' has no react component`)
  }
})

export default Page