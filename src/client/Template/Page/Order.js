"use strict"

import React, { Component } from 'react'

class Popup extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '320px' }}>
        <h3> Popup!!! </h3>
        <p>
          <button className="w3-button w3-blue" onClick={this.props.hide}> Close </button>
        </p>
      </div>
    )
  }
}

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
      <div className="w3-container">
        <h3> Order </h3>
        <br/>
        <button className="w3-button w3-red" onClick = {e => route.navigate('report')}> Report </button>
        {' '}
        <button className="w3-button w3-red" onClick = {e => this.showPopup()}> Popup </button>
      </div>
    );
  }
  showPopup() {
    this.props.page.popup.show(<Popup />, { clickOutsideToClose: true })
    setTimeout(() => this.props.page.popup.hide(), 3000)
  }
}
