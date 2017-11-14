import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {types} from 'mobx-state-tree'
import Any from './stores/'
import common from './components/__fixtures__/common.js'
import Booklet from './components/Booklet'

const booklet = Any.create(common)

class App extends Component {
  render() {
    return (
      <Booklet store={booklet}/>
    );
  }
}

export default App;
