"use strict"

import React, { Component } from 'react'

export default class Loading extends Component {
  render() {
    return (
      <div className="w3-round w3-container" style={{ margin: 'auto', width: '300px', textAlign: 'center' }}>
        <p style={{margin: '128px 0'}}> <i className="fas fa-spinner w3-spin w3-xxxlarge w3-text-white" /> </p>
      </div>
    )
  }
}
