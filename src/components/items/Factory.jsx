import React from 'react'
import {observer} from 'mobx-react'
import {Button} from 'react-onsenui'

import Text from './Text'

const Factory = observer(({store}) => 
  <div>
    <Text store={store}/>
    <hr/>
    <Button onClick={store.create} modifier={'large'}>{store.button}</Button>
  </div>
)

export default Factory