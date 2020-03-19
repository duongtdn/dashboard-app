"use strict"

import React, { Component } from 'react'

import { localeString, getDay, getTime } from '../../lib/util'
import PopupOrder from '../Popup/Order'
import Dropdown from '../Widget/Dropdown'

const Item = (props) => (
  <div style={{marginBottom: '8px'}}>
    <label> {props.item.name} </label>
    {/* <br />
    <label className = "w3-small w3-text-grey" > {props.item.code} </label> */}
  </div>
);

class Row extends Component {
  constructor(props) {
    super(props);
    this.showPopupOrder = this.showPopupOrder.bind(this);
  }
  render() {
    const order = this.props.order;
    const subTotal = order.items.reduce( (acc,cur) => acc + cur.price, 0);
    let statusTagColor = '';
    switch (order.status.toUpperCase()) {
      case 'NEW':
        statusTagColor = 'yellow';
        break;
      case 'FULFILL':
        statusTagColor = 'green';
        break;
      case 'DELETED':
        statusTagColor = 'grey';
        break;
      default:
        statusTagColor = 'white';
        break;
    };
    return (
      <tr key={order.number} >
        <td> <i className="fas fa-exclamation w3-small w3-text-red" /> </td>
        <td> <a href='' onClick={this.showPopupOrder}> #{order.number.split('-')[0]} </a> </td>
        <td> {order.items.map( item => <Item key={item.code} item = {item} /> )} </td>
        <td> {localeString(subTotal, ',')} </td>
        <td> <label className={`w3-tag w3-${statusTagColor}`}>{order.status.toUpperCase()}</label> </td>
        <td> {order.paymentMethod.toUpperCase()} </td>
        <td> {getDay(order.createdAt)} </td>
      </tr>
    )
  }
  showPopupOrder(e) {
    e.preventDefault();
    const order = this.props.order;
    this.props.page.popup(PopupOrder, { order })
    .then( m => console.log(m) )
    .catch( e => console.log(e) );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: { subTotal: false, createdAt: false },
    };
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
  render() {
    const orders = this.sort([...this.props.orders]);
    return (
      <div style = {{margin: '16px 0 48px 0'}} >
        <h5 className="bold"> {this.months[this.props.month]} <label className="normal"> ({this.props.orders.length}) </label> </h5>
        <table className="w3-table w3-bordered">
          <thead>
            <tr className=" w3-text-blue">
              <th></th>
              <th>
                Number
              </th>
              <th>
                Item
              </th>
              <th>
                Sub Total {' '}
                <span className = "w3-text-grey cursor-pointer" style = {{ position: 'relative'}} onClick = {e => this.toggleSort('subTotal')}>
                  <i className={`fas fa-sort-up ${this.state.sort.subTotal === 'ascending'? ' w3-text-orange' : ''}`}  />
                  <i className={`fas fa-sort-down ${this.state.sort.subTotal === 'descending'? ' w3-text-orange' : ''}`} style = {{ position: 'absolute', left: 0, top: '2px'}} />
                </span>
              </th>
              <th>
                Status <i className="fas fa-filter w3-small w3-text-grey cursor-pointer" />
              </th>
              <th>
                Payment <i className="fas fa-filter w3-small w3-text-grey cursor-pointer" />
              </th>
              <th>
                Created At {' '}
                <span className = "w3-text-grey cursor-pointer" style = {{ position: 'relative'}} onClick = {e => this.toggleSort('createdAt')}>
                  <i className={`fas fa-sort-up ${this.state.sort.createdAt === 'ascending'? ' w3-text-orange' : ''}`}  />
                  <i className={`fas fa-sort-down ${this.state.sort.createdAt === 'descending'? ' w3-text-orange' : ''}`} style = {{ position: 'absolute', left: 0, top: '2px'}} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
             orders.map(order => {
                return (
                  <Row key = {order.number} order = {order} {...this.props} />
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
  sort(orders) {
    const sort = this.state.sort;
    if (!sort.subTotal && !sort.createdAt) {
      return orders;
    } else {
      return orders.sort( (a, b) => {
        if (sort.subTotal) {
          const aTotal = a.items.reduce( (acc,cur) => acc + cur.price, 0);
          const bTotal = b.items.reduce( (acc,cur) => acc + cur.price, 0);
          return sort.subTotal === 'ascending'? aTotal - bTotal : bTotal - aTotal;
        } else if (sort.createdAt) {
          return sort.createdAt === 'ascending'? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
        } else {
          console.error('no sort attribute')
          return a - b;
        }
      });
    }
  }
  toggleSort(attr) {
    const direction = this.state.sort[attr] === 'ascending' ? 'descending' : 'ascending';
    const sort = {...this.state.sort};
    for (let key in sort) {
      sort[key] = false;
    }
    sort[attr] = direction;
    this.setState({ sort });
  }
}

class CommandBoard extends Component {
  constructor(props) {
    super(props);
    const now = new Date();

    this.state = {
      year: props.year,
      month: props.month,
    };

    this.years = [];
    for (let i = parseInt(now.getFullYear()); i > 2018; i--) {
      this.years.push(i);
    }
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.onSelectYear = this.onSelectYear.bind(this);
    this.onSelectMonth = this.onSelectMonth.bind(this);
  }
  render() {
    return (
      <div className="w3-bar w3-border-top w3-border-bottom">
        <div className = "w3-bar-item" style={{paddingLeft: 0}}>
          <Dropdown value = {this.state.year} list = {this.years} onSelectItem = {this.onSelectYear} />
        </div>
        <div className = "w3-bar-item">
          <Dropdown value = {this.months[this.state.month]} list = {this.months} onSelectItem = {this.onSelectMonth} />
        </div>
        <div className = "w3-bar-item w3-text-blue w3-right">
          <label className = "italic w3-text-grey w3-small" style = {{marginRight: '16px'}} >
            Last sync: {getDay(this.props.lastSync, 'short', '-')} {getTime(this.props.lastSync)}
          </label>
          <button className = "w3-button w3-small outline-none w3-ripple">
            <i className = "fas fa-save" /> Save
          </button>
          <button className = "w3-button w3-small outline-none w3-ripple">
            <i className = "fas fa-sync" /> Fetch
          </button>
          {' '}
          <button className = "w3-button w3-small outline-none w3-ripple">
            <i className = "fas fa-upload" /> Push
          </button>
        </div>
      </div>
    )
  }
  onSelectYear(year) {
    this.setState({ year });
    this.props.onSelectYear && this.props.onSelectYear(year);
  }
  onSelectMonth(month) {
    const index = this.months.indexOf(month)
    this.setState({ month: index });
    this.props.onSelectMonth && this.props.onSelectMonth(index);
  }
}

export default class Order extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      years: this.findYearsAndMonthsToShow(parseInt(now.getFullYear()), now.getMonth())
    };


    props.page.onLoad(e => console.log('Load Order'));
    props.page.onEnter(e => console.log('Enter Order'));
    props.page.onLeave(e => console.log('Leave Order'));

    this.onSelectYear = this.onSelectYear.bind(this);
    this.onSelectMonth = this.onSelectMonth.bind(this);
  }
  render() {
    const route = this.props.route
    const page = this.props.page
    console.log(this.props.orders)
    return (
      <div className = "w3-container">
        <h3 className = "w3-text-blue bold"> Order Manager </h3>
        <CommandBoard year = {this.state.years[0].year} month = {this.state.years[0].months[0]}
                      onSelectYear = {this.onSelectYear}
                      onSelectMonth = {this.onSelectMonth}
                      lastSync = {(new Date()).getTime()}
                      {...this.props}
        />
        {
          this.state.years.map(year => {
            return(
              <div key={year.year}>
                <h4 className = "bold" style = {{ marginTop: '16px' }}> {year.year} </h4>
                {
                  year.months.map(month => <Table key = {month} month = {month} {...this.props} />)
                }
              </div>
            );
          })
        }
      </div>
    );
  }
  findYearsAndMonthsToShow(year, month) {
    if (month === 0) {
      return [ { year, months: [0] }, { year: year-1, months: [11] }];
    } else {
      return [ { year, months: [month, month-1] } ];
    }
  }
  onSelectYear(year) {
    const month = this.state.years[0].months[0];
    const years = this.findYearsAndMonthsToShow(year, month);
    this.setState({ years });
  }
  onSelectMonth(month) {
    const year = this.state.years[0].year;
    const years = this.findYearsAndMonthsToShow(year, month);
    this.setState({ years });
  }
}
