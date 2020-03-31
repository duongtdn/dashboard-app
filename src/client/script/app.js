"use strict"

import React from 'react'
import { render } from 'react-dom'

import AccountClient from '@realmjs/account-client'

import env from './env'

import AppData from "../Template/AppData"

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then ( reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
  })
}

const acc = new AccountClient({
  app: env.app,
  baseurl: env.urlAccount,
  timeout: 30000
});

if (acc) {
  acc.on('unauthenticated', () => {
    console.log('unauthenticated');
  })
  acc.on('authenticated', () => {
    console.log('authenticated');
  })
}

acc.signinLocally( (status, user) => {
  if (status === 200) {
    console.log(`Sing-in locally finished with status code: ${status}`)
    console.log(user)
  } else {
    acc.sso( (status, user) => {
      console.log(`SSO finished with status code: ${status}`)
      console.log(user)
    })
  }
})

render( <AppData env = {env} accountClient = {acc} />, document.getElementById('root'))
