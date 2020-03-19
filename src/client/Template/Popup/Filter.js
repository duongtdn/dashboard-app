"use strict"

import React, { Component } from 'react'

export default class PopupFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: props.self.filter || [],
    };
    this.options = props.self.options;
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  render() {
    return (
      <div className = "w3-round w3-white w3-card-4 w3-container w3-padding" style = {{ margin: 'auto', width: '50%', minWidth: '300px' }}>
        <h3> Please select the filter </h3>
        <div className = "w3-cell-row w3-padding">
          {
            this.options.map(value => {
              return (
                <div key={value} className = "w3-cell">
                  <input type="checkbox" className = "w3-check" checked = {this.isChecked(value)} onChange = {this.handleInputChange(value)} /> {value.toUpperCase()}
                </div>
              )
            })
          }
        </div>
        <hr />
        <div className = "w3-cell-row" style = {{marginBottom: '10px'}}>
          <div className = "w3-cell" style = {{textAlign: 'center'}}>
            <button className = "w3-button w3-blue w3-ripple" onClick = {this.confirm}> Confirm </button>
          </div>
          <div className = "w3-cell" style = {{textAlign: 'center'}}>
            <button className = "w3-button w3-ripple" onClick = {this.cancel}> Cancel </button>
          </div>
        </div>
      </div>
    )
  }
  isChecked(value) {
    return !(this.state.filter.indexOf(value) === -1);
  }
  handleInputChange(value) {
    return e => {
      const filter = [...this.state.filter];
      const index = filter.indexOf(value);
      if (index === -1) {
        filter.push(value);
      } else {
        filter.splice(index, 1);
      }
      this.setState({ filter });
    }
  }
  confirm() {
    this.props.self.resolve(this.state.filter.length > 0? [...this.state.filter] : false);
  }
  cancel() {
    this.props.self.reject();
  }
}
