"use strict"

require('dotenv').config();

const api = require('../src/api/main');

// helpers database driver
const DatabaseHelper = require('@realmjs/dynamodb-helper');
const aws = { region: process.env.REGION, endpoint: process.env.ENDPOINT };
if (process.env.PROXY) {
  console.log('# User proxy-agent');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED= '0';
  const proxy = require('proxy-agent');
  aws.httpOptions = { agent: proxy(process.env.PROXY) };
}
const dbh = new DatabaseHelper({ aws, measureExecutionTime: true });
dbh.addTable('ORDER', {indexes: ['ORDERIDX']});
api.helpers({ Database: dbh.drivers});
api.helpers({
  alert({message, action, error}) {
    console.log(`\nALERT: -----------------------------------------------------------`);
    console.log(`--> by action: ${action}`);
    console.log(`--> ${message}`);
    console.log(error);
    console.log(`------------------------------------------------------------------`);
  },
});

const express = require('express');
const app = express();

app.use('/', (req,res,next) => { console.log(`${req.method.toUpperCase()} request to: ${req.path}`); next() }, api.generate())

const PORT = 3400
app.listen(PORT, (err) => {
  if (err) {
    console.log('Failed to start API Server')
  } else {
    console.log(`API Server is running at port ${PORT}`)
  }
})
