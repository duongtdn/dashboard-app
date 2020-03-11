"use strict"

import React, { Component } from 'react'

import { capitalize } from './lib/util'

class Page extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fire('load')
    if (this.props.active) {
      this.props.fire('enter')
    }
  }
  componentDidUpdate() {
    if (this.props.active) {
      this.props.fire('enter')
    }
  }
  render() {
    return this.props.children
  }
}

/**
 * Navigator component
 * @extends Component
 * */
class Navigator extends Component {
  /**
   * Navigator component that render Page for each Route
   * @param {Array} routes - Object of routes thata are registered
   * @param {Array} initialRouteStack - Array contains the initial routes from the Navigator
   * @param {Object} initialRoute - The initial routes of the Navigator
   * @param {Object} animation
   */
  constructor(props) {
    super(props);

    this.state = {
      routeStack : props.initialRouteStack || [props.initialRoute] || [],
      activeRoute: props.initialRoute || null
    };

    this.route = {
      navigate: this.navigate.bind(this)
    };

    this.__registeredRoutes = {...props.routes};

    this.__supportedPageEvents = ['load', 'beforeEnter', 'enter', 'beforeLeave', 'leave'];
    this.__events = {};
    for (let name in this.__registeredRoutes) {
      this.__events[name] = {};
      this.__supportedPageEvents.forEach( e => this.__events[name][e] = [] );
    }

    this.__createInjectPage = this.__createInjectPage.bind(this);
    this.__fire = this.__fire.bind(this);

  }

  render() {
    return (
      <div>
        {
          this.state.routeStack.map((name, index) => {
            const route = this.__registeredRoutes[name] || this.props.fallingRoute || null;
            const display = this.state.activeRoute === name ? 'block' : 'none';
            const page = this.__createInjectPage(name);
            return (
              <div key = {index} style={{ display }}>
                {/* Page */}
                <Page fire = { e => this.__fire(name, e) } active = {this.state.activeRoute === name} >
                  { React.createElement(route.Page, { route: this.route, page, ...this.props }) }
                </Page>
                {/* Popup */}
                <div>

                </div>
              </div>
            )
          })
        }
      </div>
    );
  }

  __createInjectPage(name) {
    const page = {
      on: (event, handler) => {
        if (this.__supportedPageEvents.indexOf(event) !== -1) {
          this.__events[name][event].push(handler);
        }
      },
      popup: {},
    }
    this.__supportedPageEvents.forEach( e => page[`on${capitalize(e)}`] = handler => page.on(e, handler) )
    return page;
  }

  __fire(route, event) {
    if (this.__events[route][event]) {
      this.__events[route][event].forEach( handler => handler() );
    } else {
      console.error(`event ${event} is not supported`)
    }
  }

  navigate(name) {
    if (name === this.state.activeRoute) { return; }
    if (!this.__registeredRoutes[name]) {
      console.error(`Route ${name} is not registered!`);
      return;
    }
    const activeRoute = name;
    const routeStack = [...this.state.routeStack];
    if (routeStack.indexOf(name) === -1) {
      routeStack.push(name);
    }
    this.__fire(this.state.activeRoute, 'leave');
    this.setState({ routeStack, activeRoute })
  }

}

Navigator.__rjsWidgetType = 'navigator';
export default Navigator;
