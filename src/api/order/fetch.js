"use strict"

const MIN = 1;
const MAX = 5;

function gatherOrders(helpers) {
  return function(req, res, next) {
    const from = req.query.from;
    const to = req.query.to;
    const gatherPromises = [];
    for (let i = MIN; i < MAX + 1; i ++) {
      gatherPromises.push(helpers.Database.ORDERIDX.find({
        gsi: `= ${i}`,
        createdAt: `BETWEEN ${from} AND ${to}`,
      }));
    }
    Promise.all(gatherPromises)
    .then( values => {
      const gather = [];
      values.forEach(data => gather.push(...data));
      req.orders = gather;
      next();
    })
    .catch(err =>{
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'FIND in ORDERIDX',
        error: err
      });
      res.status(500).json({ reason: 'Failed to Access Database' });
    });
  }
}

function fetch() {
  return function(req, res) {
    res.status(200).json(req.orders);
  }
}

module.exports = [gatherOrders, fetch];
