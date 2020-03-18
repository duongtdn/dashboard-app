"use strict"

import React, { Component } from 'react'

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }
  render() {
    return (
      <div onMouseLeave={e => {e.preventDefault(); this.setState({ show: false });}}>
        <div className = "w3-dropdown-click w3-border-grey w3-round" onClick = {this.toggleDropdown}>
          <label style = {{padding: '0 8px'}}> {this.props.value} </label>
          <button className="w3-button w3-small outline-none"> <i className="fas fa-chevron-down  w3-circle" /></button>
          <div className = "w3-dropdown-content w3-bar-block w3-border" style={{display: this.state.show? 'block': 'none'}}>
            {
              this.props.list.map(item => ( <a key={item} href='' className="w3-bar-item w3-button" onClick={e => this.onSelectItem(e, item)}> {item} </a> ))
            }
          </div>
        </div>
      </div>
    );
  }
  toggleDropdown(e) {
    e.preventDefault();
    const show = !this.state.show;
    this.setState({ show });
  }
  onSelectItem(e, item) {
    e.preventDefault();
    this.setState({ show: false });
    this.props.onSelectItem && this.props.onSelectItem(item);
  }
}
