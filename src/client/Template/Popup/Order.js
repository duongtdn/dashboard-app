"use strict"

import React, { Component } from 'react'

import { localeString, getDay } from '../../lib/util'


export default class PopupOrder extends Component {
  constructor(props) {
    super(props);
    this.state = { action : null, isPushing: false };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.push = this.push.bind(this);
  }
  render() {
    const order = this.props.self.order;
    const subTotal = order.items.reduce( (acc,cur) => acc + cur.price, 0);
    const statusTagColor = this.createStatusTagColor(order.status);
    const isDisabledPush = !this.state.action || this.state.isPushing;
    return (
      <div className = "w3-round w3-white w3-card-4 w3-container" style = {{ margin: 'auto', width: '70%', minWidth: '300px' }}>
        <div style = {{marginBottom: '16px'}}>
          <div className = "w3-text-blue w3-xlarge" style = {{marginTop: '16px'}}>
            <span className = "bold"> {order.number.split('-')[0]} </span> {' '}
            <span style = {{position: 'relative'}}>
              <span className = {`w3-tag ${statusTagColor} w3-small`} style = {{position: 'absolute', bottom: '5px', left: '5px'}} >
                {order.status.toUpperCase()}
              </span>
            </span>
            <span className = "w3-right"> {localeString(subTotal)} đ </span>
          </div>
          <span className = "w3-small w3-text-grey"> <i className = "far fa-calendar-alt" /> {getDay(order.createdAt)} </span>
          <span className = "w3-tag w3-grey bold w3-text-indigo w3-small w3-right" > {order.paymentMethod.toUpperCase()} </span>
        </div>

        <div className = "w3-bar w3-border-top w3-border-bottom" style = {{display: order.status === 'fulfill'? 'none' : 'block'}}>
          <div className = "w3-bar-item w3-small">
            <label className = 'italic w3-text-grey'> Change order status to: </label>
            <button className = {`w3-button outline-none ${this.state.action === 'new' ? 'w3-blue' : ''}`} onClick = {e => this.setState({ action: 'new'})}>
              <i className = "far fa-star" /> New
            </button>
            <button className = {`w3-button outline-none ${this.state.action === 'delivery' ? 'w3-blue' : ''}`} onClick = {e => this.setState({ action: 'delivery'})}>
              <i className = "fas fa-shuttle-van" /> Delivery
            </button>
            {' '}
            <button className = {`w3-button outline-none ${this.state.action === 'fulfill' ? 'w3-green' : ''}`} onClick = {e => this.setState({ action: 'fulfill'})}>
              <i className = "fas fa-check" /> Fulfill
            </button>
            {' '}
            <button className = {`w3-button outline-none ${this.state.action === 'delete' ? 'w3-grey' : ''}`} onClick = {e => this.setState({ action: 'delete'})}>
              <i className = "fas fa-ban" /> Delete
            </button>
          </div>
        </div>

        <div>
          <p className = "w3-small italic w3-text-grey"> Delivery info </p>
          <div>
            <label> <i className = "fas fa-user w3-text-grey" style= {{marginRight: '6px'}} /> {order.delivery.fullName} </label> <br />
            <label> <i className = "fas fa-phone w3-text-grey" style= {{marginRight: '6px'}} /> {order.delivery.phone} </label> <br />
            <label> <i className = "fas fa-home w3-text-grey" style= {{marginRight: '6px'}} /> {order.delivery.address} </label>
          </div>
          <p className = "w3-small italic w3-text-grey"> Items </p>
          <ul className = "w3-ul" >
            {
              order.items.map(item => (
                <li key = {item.code} className = "" >
                  <i className = "fas fa-play w3-text-grey" style= {{marginRight: '6px'}} /> {item.name}
                </li>
              ))
            }
          </ul>
        </div>
        <hr />
        {
          order.status === 'fulfill'?
            <p>
              <button className="w3-button w3-blue" onClick={this.cancel}> Close </button>
            </p>
          :
            <p>
              <button className="w3-button w3-blue" onClick={this.confirm}> Confirm </button>
              {' '}
              <button className="w3-button" onClick={this.cancel}> Cancel </button>
              <button className="w3-button w3-red w3-right" onClick={this.push} disabled = {isDisabledPush}> <i className = "fas fa-upload" /> Push </button>
            </p>
        }
      </div>
    )
  }
  confirm() {
    this.props.self.resolve(this.state.action);
  }
  cancel() {
    this.props.self.reject();
  }
  push() {
    if (!this.state.action) {
      return
    }
    const order = {
      uid: this.props.self.order.uid,
      createdAt: this.props.self.order.createdAt,
      changes: { status: this.state.action }
    };
    if (this.state.action.toUpperCase() === 'FULFILL') {
      const courses = [];
      this.props.self.order.items.forEach( item => {
        if (item.type === 'course') {
          courses.push(item.code);
        } else if (item.type === 'bundle') {
          item.items.forEach( item => {
            if (item.type === 'course') {
              courses.push(item.code);
            }
          });
        }
      });

      if (courses.length > 0) {
        order.courses = courses;
        order.number = this.props.self.order.number;
      }
      if (this.props.self.order.activationCode) {
        order.activationCode = this.props.self.order.activationCode;
      }
    }
    this.setState({ isPushing: true });
    this.props.pushChangedOrders && this.props.pushChangedOrders(order)
    .then(() => {
      this.setState({ isPushing: false, action: null });
      this.props.self.resolve(null);
    })
    .catch(err => console.log(err));
  }
  createStatusTagColor(tag) {
    let color = 'w3-grey';
    switch (tag.toUpperCase()) {
      case 'NEW':
        color = 'w3-yellow';
        break;
      case 'FULFILL':
        color = 'w3-green';
        break;
      case 'DELIVERY':
        color = 'w3-blue';
        break;
      case 'DELETED':
      default:
        color = 'w3-grey';
    }
    return color;
  }
}
