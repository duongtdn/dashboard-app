"use strict"

import React, { Component } from 'react'

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="w3-sidebar w3-bar-block w3-green w3-xlarge" style={{width: this.props.width || '65px', paddingTop: '70px'}}>
        <a className="w3-bar-item w3-button"> <i className="fas fa-file-invoice" style={{marginRight: '6px'}}></i> </a>
        <a className="w3-bar-item w3-button"> <i className="fas fa-chart-line" style={{marginRight: '6px'}}></i> </a>
      </div>
    );
  }
}
