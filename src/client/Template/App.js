"use strict"

import React, { Component } from 'react'

import Navigator from './Navigator'

import routes from './routes'
import Sidebar from './Sidebar'
import Header from './Header'

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Sidebar width = '65px' />
        <div style={{ marginLeft: '75px', }}>
          <Header {...this.props} />
          <Navigator  routes = { routes }
                      initialRoute = 'order'
                      {...this.props}
          />
        </div>
      </div>
    );
  }
}
