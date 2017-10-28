import React from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';
import Any from './stores'
import {walk} from 'mobx-state-tree'
import {Page} from 'react-onsenui'

import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import '@blueprintjs/core/dist/blueprint.css'

const MobxProxy = props => {
  console.log(props)
  const { value: NextProxy, next } = props.nextProxy;
  let store = window.store = Any.create(props.fixture._store)

  //if (props.fixture._prop) store = store[props.fixture._prop]
  props.fixture.props = {store};
  return (<NextProxy {...props} nextProxy={next()}/>)
};

MobxProxy.propTypes = proxyPropTypes;

const IframeProxy = props => {
  const { value: NextProxy, next } = props.nextProxy;

  return (
    <Page style={{width : 360, height : 640}}>
      <NextProxy {...props} nextProxy={next()}/>
    </Page>
  )
}

export default [
  IframeProxy,
  MobxProxy
  
]
