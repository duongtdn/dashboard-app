"use strict"

import React, { Component } from 'react'

export default class PopupOrder extends Component {
  render() {
    const order = this.props.self.order;
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3> #{order.number.split('-')[0]} </h3>
        <p>
          <button className="w3-button w3-blue" onClick={this.close.bind(this)}> Close </button>
        </p>
      </div>
    )
  }
  close() {
    this.props.self.resolve()
  }
}
