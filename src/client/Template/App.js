"use strict"

import React, { Component } from 'react'

import Navigator from './Navigator'

class Home extends Component {
  constructor(props) {
    super(props)
    props.page.onLoad(e => console.log('Load Home'))
    props.page.onEnter(e => console.log('Enter Home'))
    props.page.onLeave(e => console.log('Leave Home'))
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    return (
      <div>
        <h3> Home </h3>
        <br/>
        <button className="w3-button w3-blue" onClick = {e => route.navigate('dashboard')}> Dashboard </button>
      </div>
    )
  }
}

class Dashboard extends Component {
  constructor(props) {
    super(props)
    props.page.onLoad(e => console.log('Load Dashboard'))
    props.page.onEnter(e => console.log('Enter Dashboard'))
    props.page.onLeave(e => console.log('Leave Dashboard'))
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    return (
      <div>
        <h3> Dashboard </h3>
        <br/>
        <button className="w3-button w3-blue" onClick = {e => route.navigate('home')}> Home </button>
      </div>
    )
  }
}

const routes = {
  home: { Page: Home },
  dashboard: { Page: Dashboard }
}

export default class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="w3-container">
        <h2 className="w3-text-blue"> DASHBOARD PROJECT </h2>
        <Navigator  routes = { routes }
                    initialRoute = 'home'
        />
      </div>
    )
  }
}
