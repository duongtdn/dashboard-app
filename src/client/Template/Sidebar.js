"use strict"

import React, { Component } from 'react'

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);
  }
  render() {
    return (
      <div className="w3-sidebar w3-bar-block w3-green w3-xlarge" style={{width: this.props.width || '65px', paddingTop: '70px'}}>
        <a className="w3-bar-item w3-button" onClick={this.navigate('order')}> <i className="fas fa-file-invoice" style={{marginRight: '6px'}}></i> </a>
        <a className="w3-bar-item w3-button" onClick={this.navigate('report')}> <i className="fas fa-chart-line" style={{marginRight: '6px'}}></i> </a>
      </div>
    );
  }

  navigate(route) {
    return e => {
      e.preventDefault();
      if (!this.props.getRouteHandler) {
        console.error('Missing Prop: getRouteHandler in Sidebar');
        return;
      }
      const routeHanlder = this.props.getRouteHandler();
      routeHanlder && routeHanlder.navigate(route);
    };
  }

}
