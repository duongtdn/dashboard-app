"use strict"

import React from 'react'
import { render } from 'react-dom'

import App from "../Template/App"


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then ( reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
  })
}


render( <App/>, document.getElementById('root'))
