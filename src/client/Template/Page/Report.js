"use strict"

import React, { Component } from 'react'

export default class Report extends Component {
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('Load Report'));
    props.page.onBeforeEnter(e => alert('Before Enter Report'));
    props.page.onEnter(e => console.log('Enter Report'));
    props.page.onLeave(e => console.log('Leave Report'));
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    return (
      <div className="w3-container">
        <h3> Report </h3>
        <br/>
        <button className="w3-button w3-blue" onClick = {e => route.navigate('order')}> Order </button>
      </div>
    );
  }
}
