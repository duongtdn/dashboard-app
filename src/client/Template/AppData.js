"use strict"

import React, { Component } from 'react'

import LocalDB from '../lib/local-db'
import App from './App'

const dump = [
  {
    "activationCode": "LURB5HQV",
    "billTo": {

    },
    "createdAt": 1584429001775,
    "delivery": {
      "address": "P6-A26.02 Vinhomes Central Park",
      "fullName": "Nguyen The Dai Duong",
      "phone": "0976986633"
    },
    "gsi": 4,
    "items": [
      {
        "checked": true,
        "code": "c-01",
        "name": "Beginning Embedded C Programming",
        "price": 199000,
        "promotion": [
          "promo-01"
        ],
        "type": "course",
        "vouchers": [
          "lucky",
          "welcome"
        ]
      },
      {
        "checked": true,
        "code": "c-02",
        "name": "Applied C for Embedded ARM System",
        "price": 499000,
        "promotion": [
          "promo-02",
          "promo-03"
        ],
        "type": "course",
        "vouchers": [
          "lucky",
          "welcome"
        ]
      }
    ],
    "notes": {
      "1584429001775": "new order created"
    },
    "number": "436063-wwfif7v7t6m",
    "paymentMethod": "cod",
    "status": "new",
    "uid": "220f71d0-2800-11ea-91a8-9f528720b885"
  },
  {
    "activationCode": "VC8KO87H",
    "billTo": {

    },
    "createdAt": 1584429280105,
    "delivery": {
      "address": "P6-A26.02 Vinhomes Central Park",
      "fullName": "Nguyen The Dai Duong",
      "phone": "0976986633"
    },
    "gsi": 2,
    "items": [
      {
        "checked": true,
        "code": "promo-04",
        "items": [
          {
            "code": "c-03",
            "name": "Applied C for Embedded Programming in Detail",
            "type": "course"
          }
        ],
        "name": "Bundle Offer: Embedded Complete for Beginners",
        "price": 649000,
        "promotion": [
          "promo-04"
        ],
        "type": "bundle"
      }
    ],
    "notes": {
      "1584429280105": "new order created"
    },
    "number": "492451-1uo5m91zi1e",
    "paymentMethod": "bank",
    "status": "fulfill",
    "uid": "220f71d0-2800-11ea-91a8-9f528720b885"
  },
  {
    "activationCode": "KAR94NOS",
    "billTo": {

    },
    "createdAt": 1584429302684,
    "delivery": {
      "address": "P6-A26.02 Vinhomes Central Park",
      "fullName": "Nguyen The Dai Duong",
      "phone": "0976986633"
    },
    "gsi": 3,
    "items": [
      {
        "checked": true,
        "code": "c-04",
        "name": "Motor Control: Pratical applied in Embedded System and IoT",
        "price": 999000,
        "promotion": [

        ],
        "type": "course"
      }
    ],
    "notes": {
      "1584429302684": "new order created"
    },
    "number": "553689-3n0qtoxlgjg",
    "paymentMethod": "credit",
    "status": "fulfill",
    "uid": "220f71d0-2800-11ea-91a8-9f528720b885"
  }
]

const db = new LocalDB({ stores: {
  order: 'number'
}});

dump.forEach(order => {
  db.order.put(order).then( () => console.log(`put order: ${order.number}`));
});

export default class AppData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
    db.order.all().then( orders => this.setState({ orders }) );
  }
  render() {
    return (
      <App  orders = {this.state.orders}
            db = {db}
            {...this.props}
      />
    );
  }
}
