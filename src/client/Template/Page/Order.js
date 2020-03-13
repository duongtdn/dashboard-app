"use strict"

import React, { Component } from 'react'

class Popup extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3> Popup!!! </h3>
        <p>
          <button className="w3-button w3-blue" onClick={this.close.bind(this)}> Close </button>
        </p>
      </div>
    )
  }
  close() {
    this.props.self.resolve('# --- Popup resolve by close button clicked')
  }
}

class Diag extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3> Diag!!! </h3>
        <p>
          <button className="w3-button w3-blue" onClick={this.resolve.bind(this)}> Resolve </button>
          {' '}
          <button className="w3-button w3-blue" onClick={this.reject.bind(this)}> Reject </button>
        </p>
      </div>
    )
  }
  resolve() {
    this.props.self.resolve('# --- Diag resolve button clicked')
  }
  reject() {
    this.props.self.reject('# --- Diag reject button clicked')
  }
}

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupMessage: '',
    };
    // props.page.onLoad(e => console.log('Load Order'));
    // props.page.onEnter(e => console.log('Enter Order'));
    // props.page.onLeave(e => console.log('Leave Order'));
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    return (
      <div className="w3-container">
        <h3> Order </h3>
        <br/>
        <p>
          Popup is {this.state.popupMessage}
        </p>
        <button className="w3-button w3-red" onClick = {e => route.navigate('report')}> Report </button>
        {' '}
        <button className="w3-button w3-red" onClick = {e => this.showPopup()}> Popup </button>
        {' '}
        <button className="w3-button w3-red" onClick = {e => this.showManyPopups()}> Many Popup </button>
      </div>
    );
  }
  showPopup() {
    let p = null;
    this.props.page.popup.new(Popup, self => setTimeout(() =>self.reject('rejected by Timeout'), 3000))
    .then( (m) => {
      console.log(m);
      return this.props.page.popup.new(Diag);
    })
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }

  showManyPopups() {
    this.props.page.popup.new(Popup)
    .then( m => console.log(m) )
    .catch( e => console.log(e) );

    this.props.page.popup.new(Diag)
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }
}
