"use strict"

import React, { Component } from 'react'

import { localeString, getDay, getTime } from '../../lib/util'
import PopupOrder from '../Popup/Order'
import PopupFilter from '../Popup/Filter'
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
    this.state = {
      spinIcon: false,
    };
    this.showPopupOrder = this.showPopupOrder.bind(this);
    this.resetOrder = this.resetOrder.bind(this);
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
      case 'DELIVERY':
        statusTagColor = 'blue';
        break;
      case 'DELETE':
        statusTagColor = 'grey';
        break;
      default:
        statusTagColor = 'white';
        break;
    };
    const statusIcon = order.__updated ? <i className="fas fa-exclamation w3-small w3-text-red" /> :
      order.__changed !== undefined?
        <i className = {`fas fa-redo-alt w3-small w3-text-gray cursor-pointer ${this.state.spinIcon? 'w3-spin': ''}`} onClick = {this.resetOrder} />
        : null;

    return (
      <tr key={order.number} >
        {/* <td> <i className="fas fa-exclamation w3-small w3-text-red" /> </td> */}
        <td style={{width: '36px'}}> {statusIcon} </td>
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
    this.props.popupOrder && this.props.popupOrder({ order });
  }
  resetOrder(e) {
    e.preventDefault();
    this.setState({ spinIcon: true });
    setTimeout( () => {
      this.setState({ spinIcon: false });
      this.props.resetOrder && this.props.resetOrder({number: this.props.order.number});
    }, 500);
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: { subTotal: false, createdAt: false },
      filter: { status: false, payment: false },
    };
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.popupFilterStatus = this.popupFilterStatus.bind(this);
    this.popupFilterPayment = this.popupFilterPayment.bind(this);
  }
  render() {
    const month = this.props.month;
    const year = this.props.year;
    const begin = new Date(year, month, 1); // first day of month
    const end = new Date(year, month +1, 0, 23, 59, 59);  // last day of month
    const ordersOfThisMonth = this.props.orders.filter(order => order.createdAt >= begin && order.createdAt <= end);
    const orders = this.sort(ordersOfThisMonth).filter(order => {
      const filter = this.state.filter;
      if (filter.status && filter.status.indexOf(order.status) === -1) {
        return false;
      }
      if (filter.payment && filter.payment.indexOf(order.paymentMethod) === -1) {
        return false;
      }
      return true;
    });
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
                  <i className = {`fas fa-sort-up ${this.state.sort.subTotal === 'ascending'? ' w3-text-orange' : ''}`}  />
                  <i className = {`fas fa-sort-down ${this.state.sort.subTotal === 'descending'? ' w3-text-orange' : ''}`} style = {{ position: 'absolute', left: 0, top: '2px'}} />
                </span>
              </th>
              <th>
                Status <i className = {`fas fa-filter w3-small ${this.state.filter.status.length > 0? 'w3-text-orange': 'w3-text-grey'} cursor-pointer`} onClick = {this.popupFilterStatus} />
              </th>
              <th>
                Payment <i className = {`fas fa-filter w3-small ${this.state.filter.payment.length > 0? 'w3-text-orange': 'w3-text-grey'} cursor-pointer`} onClick = {this.popupFilterPayment} />
              </th>
              <th>
                Created At {' '}
                <span className = "w3-text-grey cursor-pointer" style = {{ position: 'relative'}} onClick = {e => this.toggleSort('createdAt')}>
                  <i className = {`fas fa-sort-up ${this.state.sort.createdAt === 'ascending'? ' w3-text-orange' : ''}`}  />
                  <i className = {`fas fa-sort-down ${this.state.sort.createdAt === 'descending'? ' w3-text-orange' : ''}`} style = {{ position: 'absolute', left: 0, top: '2px'}} />
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
  popupFilterStatus(e) {
    e.preventDefault();
    this.props.page.popup(PopupFilter, {filter: this.state.filter.status, options: ['new', 'delivery', 'fulfill', 'deleted']})
    .then( status => {
      const filter = {...this.state.filter};
      filter.status = status;
      this.setState({ filter });
    })
    .catch( () => {});
  }
  popupFilterPayment(e) {
    e.preventDefault();
    this.props.page.popup(PopupFilter, {filter: this.state.filter.payment, options: ['cod', 'bank', 'card', 'momo']})
    .then( payment => {
      const filter = {...this.state.filter};
      filter.payment = payment;
      this.setState({ filter });
    })
    .catch( () => {});
  }
}

class CommandBoard extends Component {
  constructor(props) {
    super(props);
    const now = new Date();

    this.state = {
      year: props.year,
      month: props.month,
      isFetching: false,
      isPushing: false,
    };

    this.years = [];
    for (let i = parseInt(now.getFullYear()); i > 2018; i--) {
      this.years.push(i);
    }
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.onSelectYear = this.onSelectYear.bind(this);
    this.onSelectMonth = this.onSelectMonth.bind(this);
    this.fetchOrder = this.fetchOrder.bind(this);
    this.pushChangedOrders = this.pushChangedOrders.bind(this);
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
          <button className = "w3-button w3-small outline-none w3-ripple" onClick = {e => this.props.saveOrder && this.props.saveOrder()}>
            <i className = "fas fa-save" /> Save
          </button>
          <button className = "w3-button w3-small outline-none w3-ripple" onClick = {this.fetchOrder}>
            <i className = {`fas fa-sync ${this.state.isFetching? 'w3-spin' : ''}`} /> Fetch
          </button>
          {' '}
          <button className = "w3-button w3-small outline-none w3-ripple" onClick = {this.pushChangedOrders} disabled = {this.state.isPushing}>
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
  fetchOrder(e) {
    e.preventDefault();
    const now = new Date(this.state.year, this.state.month + 1, 0, 23, 59, 59); // till the last day of current month
    const thisMonth = now.getMonth();
    const prevMonth = thisMonth === 0? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const year =  thisMonth === 0? thisYear - 1 : thisYear
    const from = (new Date(year, prevMonth, 1)).getTime();
    const to = now.getTime();
    const query = `from=${from}&to=${to}`;
    this.setState({ isFetching: true });
    this.props.fetchOrder && this.props.fetchOrder(query)
    .then( () => this.setState({ isFetching: false }) )
    .catch( () => this.setState({ isFetching: false }) );
  }
  pushChangedOrders(e) {
    e.preventDefault();
    this.setState({ isPushing: true });
    this.props.pushChangedOrders && this.props.pushChangedOrders()
    .then( () => this.setState({ isPushing: false }) )
    .catch( () => this.setState({ isPushing: false }) );
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
    this.popupOrder = this.popupOrder.bind(this);
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
                  year.months.map(month => <Table key = {month} month = {month} year = {year.year} popupOrder = {this.popupOrder} {...this.props} />)
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
  popupOrder({ order }) {
    this.props.page.popup(PopupOrder, { order })
    .then( action => {
      action && this.props.updateOrder && this.props.updateOrder({number: order.number, changes: {status: action}});
    })
    .catch(() => {});
  }
}
