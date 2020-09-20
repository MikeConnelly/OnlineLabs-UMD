module.exports = (app, manager, controller) => {
  
  app.get('/g1', (req, res) => {
    res.redirect('/');
  });

  app.post('/api/g1/enqueue', (req, res) => {
    if (!req.user) {
      res.sendStatus(403);
    } else {
      req.user.project = 'g1';
      manager.addUser(req.user); // also calls updateAllClients in manager
      res.sendStatus(200);
    }
  });

  app.post('/api/g1/returnhome', (req, res) => {
    if (req.user) {
      if (manager.isCurrentUser(req.user)) {
        controller.resetMotorsAndClear(null);
      }
      manager.userDisconnected(req.user);
      req.user.project = null;
    }
    res.sendStatus(200);
  });

  // Invoked on Dashboard component mount, sends the user the queue state and their login status
  app.get('/api/g1/info', (req, res) => {
    const user = req.user;
    const loggedIn = Boolean(user);
    const queueState = manager.getQueueState(user);
    res.status(200).json({
      'loggedIn': loggedIn,
      'queueState': queueState
    });
  });

  // Move route not invoked from UI in favor of /api/moveArray, accepts two numbers "x" and "y"
  app.post('/api/move', (req, res) => {
    if (!req.user || !manager.isCurrentUser(req.user)) {
      res.sendStatus(403);
    } else {
      //manager.refreshCurrentUserTimer();
      let xDelta = parseInt(req.body.x);
      let yDelta = parseInt(req.body.y);
      if (isNaN(xDelta) || isNaN(yDelta)) {
        res.sendStatus(400);
      } else {
        const LIMIT = 20000;
        xDelta = (Math.abs(xDelta) > LIMIT) ? (LIMIT * (xDelta / Math.abs(xDelta))) : xDelta;
        yDelta = (Math.abs(yDelta) > LIMIT) ? (LIMIT * (yDelta / Math.abs(yDelta))) : yDelta;
        controller.move(xDelta, yDelta, err => res.sendStatus(200));
      }
    }
  });

  // Move route invoked from UI, accepts arrays of numbers "x" and "y"
  app.post('/api/moveArray', (req, res) => {
    if (!req.user || !manager.isCurrentUser(req.user)) {
      res.sendStatus(403);
    } else {
      //manager.refreshCurrentUserTimer();
      const xArrValid = assertArrayOfNumbers(req.body.x);
      const yArrValid = assertArrayOfNumbers(req.body.y);
      if (!xArrValid || !yArrValid) {
        res.sendStatus(400);
      } else {
        const xArrFormatted = formatInputArray(xArrValid);
        const yArrFormatted = formatInputArray(yArrValid);
        controller.moveArray(xArrFormatted, yArrFormatted, err => res.sendStatus(200));
      }
    }
  });

  // Route is not called from UI, /api/clearReset used instead
  app.post('/api/reset', (req, res) => {
    if (!req.user || !manager.isCurrentUser(req.user)) {
      res.sendStatus(403);
    } else {
      //manager.refreshCurrentUserTimer();
      controller.resetMotors(err => res.sendStatus(200));
    }
  });

  // Route to clear motor queue and reset position
  app.post('/api/clearReset', (req, res) => {
    if (!req.user || !manager.isCurrentUser(req.user)) {
      res.sendStatus(403);
    } else {
      //manager.refreshCurrentUserTimer();
      controller.resetMotorsAndClear(err => res.sendStatus(200));
    }
  });

  app.post('/api/finish', (req, res) => {
    if (!req.user || !manager.isCurrentUser(req.user)) {
      res.sendStatus(403);
    } else {
      manager.replaceCurrentUser();
      req.user.project = null;
      controller.resetMotorsAndClear(err => res.sendStatus(200));
    }
  });

  app.post('/api/g1/refresh', (req, res) => {
    if (req.user && manager.isCurrentUser(req.user)) {
      manager.refreshCurrentUserTimer();
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  });
}

/**
 * Asserts that the input array is all numbers.
 * @param {[number]} arr input array
 * @returns {?[number]} the array of numbers or null
 */
function assertArrayOfNumbers(arr) {
  return arr.map(val => isNaN(val) ? null : parseInt(val));
}

/**
 * Formats the input array of numbers to keep values within a certain limit.
 * Used before sending values to the device to keep them within 16 bits.
 * @param {[number]} arr the input array
 * @returns {[number]} the array of numbers with extreme values squished to +/- 20000
 */
function formatInputArray(arr) {
  const LIMIT = 20000;
  return arr.map(val => (Math.abs(val) > LIMIT) ? (LIMIT * (val / Math.abs(val))) : val);
}
