"use strict"

import React from 'react'
import { render } from 'react-dom'

import App from "../Template/App"

const env = {
  assets: {
    logo: {
      png_trans: '',
      png_bg: '',
      icon: 'assets/icon.png'
    }
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then ( reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
  })
}


render( <App env = {env} />, document.getElementById('root'))