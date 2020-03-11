"use strict"

import React, { Component } from 'react'

export default class Order extends Component {
  constructor(props) {
    super(props);
    props.page.onLoad(e => console.log('Load Order'));
    props.page.onEnter(e => console.log('Enter Order'));
    props.page.onLeave(e => console.log('Leave Order'));
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    return (
      <div>
        <h3> Order </h3>
        <br/>
        <button className="w3-button w3-red" onClick = {e => route.navigate('report')}> Report </button>
      </div>
    );
  }
}
