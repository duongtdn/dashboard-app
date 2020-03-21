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
    "paymentMethod": "card",
    "status": "fulfill",
    "uid": "220f71d0-2800-11ea-91a8-9f528720b885"
  }
]

const db = new LocalDB({ stores: {
  order: 'number'
}});

db.order.put(dump).then( () => {
  console.log(`put orders`);
  dump.forEach( order => console.log(`   --> ${order.number}`));
});

export default class AppData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
    db.order.all().then( orders => this.setState({ orders }) );
    this.updateOrder = this.updateOrder.bind(this);
    this.resetOrder = this.resetOrder.bind(this);
    this.saveOrder = this.saveOrder.bind(this);
  }
  render() {
    return (
      <App  orders = {this.state.orders}
            db = {db}
            updateOrder = {this.updateOrder}
            resetOrder = {this.resetOrder}
            saveOrder = {this.saveOrder}
            {...this.props}
      />
    );
  }
  updateOrder({ number, changes }) {
    const orders = [...this.state.orders];
    const order = orders.find(order => order.number === number);
    if (!order) { return; }
    if (!order.__changed) { order.__changed = {}; }
    for (let attr in changes) {
      order[attr] = changes[attr];
      order.__changed[attr] = changes[attr];
    }
    this.setState({ orders });
  }
  async resetOrder({ number }) {
    const orders = [...this.state.orders];
    const index = orders.findIndex(order => order.number === number);
    if (index !== -1) {
      const order = await db.order.get(number);
      orders[index] = order;
      this.setState({ orders });
    }
  }
  saveOrder() {
    const changes = this.state.orders.filter(order => order.__changed !== undefined);
    if (changes.length === 0) { return; }
    const saving = changes.map(order => {
      order.__updated = true;
      return order;
    });
    db.order.put(saving).then( () => {
      console.log('Updated changes to local-db');
      db.order.all().then( orders => this.setState({ orders }) );
    });
  }
}
