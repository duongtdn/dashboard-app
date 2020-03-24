"use strict"

const Builder = require('express-api-builder');

const api = Builder();

api.add('/order', {
  get: require('./order/fetch'),
});

module.exports = api
