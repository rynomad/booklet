import React from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';
import {static_page} from './stores/static_page'
const defaults = {
  // add option defaults here
};

const MobxProxy = props => {
  console.log(props)
  const { value: NextProxy, next } = props.nextProxy;
  props.fixture.props = {store : static_page.create(props.fixture._store)};
  return (<NextProxy {...props} nextProxy={next()}/>)
};

MobxProxy.propTypes = proxyPropTypes;

MobxProxy;

export default [
  MobxProxy
]
