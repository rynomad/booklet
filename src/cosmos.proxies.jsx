import React from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';
import {any} from './stores/any'

const MobxProxy = props => {
  console.log(props)
  const { value: NextProxy, next } = props.nextProxy;
  props.fixture.props = {store : any.create(props.fixture._store)};
  return (<NextProxy {...props} nextProxy={next()}/>)
};

MobxProxy.propTypes = proxyPropTypes;

const IframeProxy = props => {
  const { value: NextProxy, next } = props.nextProxy;

  return (
    <div>
      <div style={{width : 360, height : 640, backgroundColor : 'gray'}}>
        <NextProxy {...props} nextProxy={next()}/>
      </div>
    </div>
  )
}

export default [
  IframeProxy,
  MobxProxy
  
]
