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

class LoadingPopup extends Component {
  render() {
    return (
      <div className="w3-round w3-container" style={{ margin: 'auto', width: '300px', textAlign: 'center' }}>
        <p> <i className="fas fa-spinner w3-spin w3-xxxlarge w3-text-white" /> </p>
      </div>
    )
  }
}

class LayerPopup extends Component {
  render() {
    return (
      <div className="w3-round w3-white w3-card-4 w3-container" style={{ margin: 'auto', width: '300px' }}>
        <h3> Popup!!! </h3>
        <p>
          <button className="w3-button w3-blue" onClick={this.open.bind(this)}> Open New Popup </button>
          {' '}
          <button className="w3-button" onClick={this.close.bind(this)}> Close </button>
        </p>
      </div>
    )
  }
  close() {
    this.props.self.resolve('# --- Popup resolve by close button clicked')
  }
  open() {
    console.log(this.props)
    const page = this.props.page;
    page.popup(LoadingPopup, {overlay: true}, self => setTimeout(() =>self.reject('rejected by Timeout'), 3000))
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }
}

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
        {' '}
        <button className="w3-button w3-red" onClick = {e => this.showPopup()}> Popup </button>
        {' '}
        <button className="w3-button w3-red" onClick = {e => this.showManyPopups()}> Many Popup </button>
        {' '}
        <button className="w3-button w3-green" onClick = {e => this.showLayerPopup()}> Layer Popup </button>
      </div>
    );
  }
  showPopup() {
    this.props.page.popup(Popup, self => setTimeout(() =>self.reject('rejected by Timeout'), 3000))
    .then( (m) => {
      console.log(m);
      return this.props.page.popup(Diag);
    })
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }

  showManyPopups() {
    this.props.page.popup(Popup)
    .then( m => console.log(m) )
    .catch( e => console.log(e) );

    this.props.page.popup(Diag)
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }

  showLayerPopup() {
    this.props.page.popup(LayerPopup)
  }
}
