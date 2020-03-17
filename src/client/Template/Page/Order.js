"use strict"

import React, { Component } from 'react'

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    props.page.onLoad(e => console.log('Load Order'));
    props.page.onEnter(e => console.log('Enter Order'));
    props.page.onLeave(e => console.log('Leave Order'));
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    console.log(this.props.order)
    return (
      <div className="w3-container">
        <h3> Order </h3>
        <ul>
        {
          this.props.order.map(order => {
            return (
            <li key={order.number} > {order.number.split('-')[0]} </li>
            )
          })
        }
        </ul>
      </div>
    );
  }

}
