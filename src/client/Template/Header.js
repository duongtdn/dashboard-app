"use strict"

import React, { Component } from 'react'

import Logo from './Logo'

class UserSnipet extends Component {
  constructor(props) {
    super(props);
    this.state = { righEdge: 0 };
    this.signout = this.signout.bind(this);
    this.ref = React.createRef();
    this.adjustDropdownRightPosition = this.adjustDropdownRightPosition.bind(this);
  }
  componentDidMount() {
    this.adjustDropdownRightPosition();
    window.addEventListener('resize', this.adjustDropdownRightPosition, false);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.adjustDropdownRightPosition);
  }
  adjustDropdownRightPosition() {
    const node = this.ref.current;
    const rect = node.getBoundingClientRect();
    const righEdge = innerWidth - (rect.left + rect.width);
    this.setState({ righEdge: `${righEdge}px` });
  }
  render() {
    const user = this.props.user;
    const avata = this._getUserAvata();
    return (
      <div ref={this.ref} className="w3-bar-item w3-dropdown-hover" style={{margin: '4px 0', padding: '3px 16px', cursor: 'pointer'}}>
        <div>
          <img className="w3-circle w3-border w3-border-white"style={{width: '35px'}} src={avata} />
          {' '}
          <span className="w3-text-blue-grey" style={{marginRight: '4px'}}>{user.profile.displayName}</span>
          {' '}
          <i className="w3-text-dark-grey fa fa-ellipsis-v" />
        </div>
        <div className='w3-dropdown-content w3-bar-block' style={{padding: '4px', right: this.state.righEdge}}>
          <button className="w3-bar-item w3-button w3-border w3-green" style={{textAlign: 'center'}} onClick={this.signout}>
            <i className="fas fa-sign-out-alt" style={{marginRight: '4px'}} /> Sign out
          </button>
        </div>
      </div>
    );
  }
  _getUserAvata() {
    const user = this.props.user;
    if (user.profile.picture) { return user.profile.picture; }
    if (user.profile.gender === 'female') {
      return this.props.env.template.avata.female;
    } else {
      return this.props.env.template.avata.male;
    }
  }
  signout(e) {
    this.props.accountClient.signout();
  }
}

class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
  }
  render() {
    return (
      <div className="w3-bar-item w3-button w3-hover-pale-blue w3-hover-border-blue w3-border w3-border-white" style={{marginRight: '8px'}}>
        <span className="w3-text-grey" onClick={this.signin}>
          <span className="w3-hide-small" style={{marginLeft: '4px'}} > Login </span>
        </span>
      </div>
    );
  }
  signin() {
    this.props.accountClient.signin();
  }
}


export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <header style={{margin: 0}}>
        <div className="w3-bar ">
          <a className="w3-bar-item w3-button w3-hover-none" > <Logo {...this.props} /> </a>
          <div className="w3-bar-item w3-right" style={{padding: '10px'}}>
          {
            this.props.user?
              <UserSnipet user={this.props.user}
                          accountClient={this.props.accountClient}
                          env = {this.props.env}
              />
            :
              <span>
                <LoginButton accountClient={this.props.accountClient} />
              </span>
          }
          </div>
        </div>
      </header>
    );
  }
}
