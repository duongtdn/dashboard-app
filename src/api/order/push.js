"use strict"

/*
  request body:
  orders: [
    {
      uid,
      createdAt,
      changes: {},
      courses: [courseId], // optional, required if change status to fulfill,
      number, // optional, required if change status to fulfill,
      activationCode, // optional
    }
  ]
  depend on the change of order, following action can occurs:
  - change in status:
      + DELIVERY: just update status in ORDER, no other tables are affected.
      + FULFILL: update status in ORDER, activate courses (ENROLL) and remove activation code if any
      + DELETE: remove order and activation code if any
  - other then status:
      + just update changes to ORDER, no other tables are affected.
*/

const jwt = require('jsonwebtoken');

function validate() {
  return function (req, res, next) {
    if (req.body && req.body.orders) {
      if (req.body.orders.length === 0) {
        res.status(304).json({ message: 'Not modified'});
      } else {
        const valid = req.body.orders.every(order => {
          if (order.uid && order.createdAt) {
            return true;
          } else {
            return false;
          }
        });
        if (valid) {
          next();
        } else {
          res.status(400).json({ error: 'Bad parameters'});
        }
      }
    } else {
      res.status(400).json({ error: 'Bad parameters'});
    }
  }
}

function updateOrder(helpers) {
  return function(req, res, next) {
    const updates = [];
    req.body.orders.filter(order => order.changes && order.changes.status && order.changes.status.toUpperCase() !== 'DELETE')
    .forEach(order => {
      const {uid, createdAt, changes} = order;
      updates.push(helpers.Database.ORDER.update({uid, createdAt}, { ...changes }));
    })
    Promise.all(updates)
    .then(() => {
      // filter order need more action
      req.ordersToFulfill = req.body.orders.filter(order =>
            order.changes && order.changes.status &&
            order.changes.status.toUpperCase() === 'FULFILL'
      );
      req.ordersToDelete = req.body.orders.filter(order =>
            order.changes && order.changes.status &&
            order.changes.status.toUpperCase() === 'DELETE'
      );
      next();
    })
    .catch(err =>{
      helpers.alert && helpers.alert({
        message: 'Database operation failed',
        action: 'UPDATE to ORDER',
        error: err
      });
      res.status(500).json({ error: 'Failed to Access Database' });
    });
  }
}

function processOthers(helpers) {
  return function(req, res, next) {
    if (req.ordersToFulfill.length === 0 && req.ordersToDelete.length === 0) {
      next();
      return
    }

    const params = {
      ENROLL: { insert: [] },
      PROGRESS: { insert: [] },
      ACTIVECODE: { remove: [] },
      ORDER: { remove: [] },
    };

    const actions = [];
    const _p = (order) => {
      return new Promise((resolve, reject) => {
        __genEnrollAndProgress(helpers, order).then(({enrolls, progresses, activationCodes}) => {
          if (enrolls) {
            params.ENROLL.insert.push(...enrolls);
          }
          if (progresses) {
            params.PROGRESS.insert.push(...progresses);
          }
          if (activationCodes) {
            params.ACTIVECODE.remove.push(...activationCodes);
          }
          resolve();
        }).catch(err => reject (err));
      });
    };
    req.ordersToFulfill.forEach(order => actions.push(_p(order)));

    req.ordersToDelete.forEach(order => {
      const {orders, activationCodes} = __genDeleteOrder(order);
      if (orders) {
        params.ORDER.remove.push(...orders);
      }
      if (activationCodes) {
        params.ACTIVECODE.remove.push(...activationCodes);
      }
    });

    Promise.all(actions)
    .then(() => {
      if (params.ACTIVECODE.remove.length === 0) {
        delete params.ACTIVECODE;
      }
      if (params.ENROLL.insert.length === 0) {
        delete params.ENROLL;
      }
      if (params.PROGRESS.insert.length === 0) {
        delete params.PROGRESS;
      }
      if (params.ORDER.remove.length === 0) {
        delete params.ORDER;
      }
      if (Object.keys(params).length === 0) {
        next();
        return
      }
      helpers.Database.batchWrite(params)
      .then( () => next() )
      .catch(err =>{
        helpers.alert && helpers.alert({
          message: 'Process orders failed',
          action: 'Activate course/ Remove order',
          error: err
        });
        res.status(500).json({ error: 'Failed' });
      });
    })
    .catch(err =>{
      helpers.alert && helpers.alert({
        message: 'Process orders failed',
        action: 'Create enroll/progress',
        error: err
      });
      res.status(500).json({ error: 'Failed' });
    });;
  }
}


function final() {
  return function(req, res) {
    res.status(200).json({message: 'success'});
  }
}


function _registerTests(helpers, order) {
  return new Promise((resolve) => {
    const euid = jwt.sign({uid: order.uid}, process.env.APP_SHARE_KEY);
    helpers.invoke.registerTests({courses: order.courses, euid})
    .then( tests => resolve(tests) )
    .catch(err => resolve(null));
  });
}

function __genEnrollAndProgress(helpers, order) {
  return new Promise( async (resolve, reject) => {
    const uid = order.uid;
    const courses = order.courses;

    const enrolls = courses.map( course => {
      return {
        courseId: course,
        enrollTo: uid,
        enrollAt: (new Date()).getTime(),
        resolvedBy: 'admin',
        order: order.number,
        status: 'active',
        comments: [{by: 'system', message: 'activate course from admin dashboard'}],
      }
    });

    const tests = await _registerTests(helpers, order);
    if (!tests) {
      return Promise.reject(new Error('failed to register test'));
    }

    const progresses = courses.map( course => {
      return {
        uid,
        id: course,
        study: {},
        test: tests[course]
      }
    });

    const activationCodes =  order.activationCode? [{ code: order.activationCode }] : [];
    resolve({ enrolls, progresses, activationCodes });
  });
}

function __genDeleteOrder(order) {
  const uid = order.uid;
  const createdAt = order.createdAt;
  const orders = [{ uid, createdAt }];
  const activationCodes =  order.activationCode? [{ code: order.activationCode }] : [];
  return { orders, activationCodes };
}

module.exports = [validate, updateOrder, processOthers, final];
