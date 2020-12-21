const g1Routes = require('./g1Routes');
const g2Routes = require('./g2Routes');

module.exports = (admin_pass, app, manager, g2Manager, g3Manager, g4Manager, controller, g3Controller) => {

  g1Routes(admin_pass, app, manager, controller);
  g2Routes(admin_pass, app, g2Manager);

  app.get('/g3', (req, res) => {
    res.redirect('/');
  });

  app.get('/g4', (req, res) => {
    res.redirect('/');
  });

  app.get(`/g3/admin/kick/${admin_pass}`, (req, res) => {
    g3Manager.clearQueue();
    res.redirect('/');
  });

  app.get(`/g4/admin/kick/${admin_pass}`, (req, res) => {
    g4Manager.clearQueue();
    res.redirect('/');
  });

  app.post('/api/g3/enqueue', (req, res) => {
    if(!req.user) {
      res.sendStatus(403);
    } else {
      req.user.project = 'g3';
      g3Manager.addUser(req.user);
      res.sendStatus(200);
    }
  });

  app.post('/api/g4/enqueue', (req, res) => {
    if(!req.user) {
      res.sendStatus(403);
    } else {
      req.user.project = 'g4';
      g4Manager.addUser(req.user);
      res.sendStatus(200);
    }
  });

  app.post('/api/g3/returnhome', (req, res) => {
    if (req.user) {
      g3Manager.userDisconnected(req.user);
      req.user.project = null;
    }
    res.sendStatus(200);
  });

  app.post('/api/g4/returnhome', (req, res) => {
    if (req.user) {
      g4Manager.userDisconnected(req.user);
      req.user.project = null;
    }
    res.sendStatus(200);
  });

  app.post('/api/g3/refresh', (req, res) => {
    if (req.user && g3Manager.isCurrentUser(req.user)) {
      g3Manager.refreshCurrentUserTimer();
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  });
  
  app.post('/api/g4/refresh', (req, res) => {
    if (req.user && g4Manager.isCurrentUser(req.user)) {
      g4Manager.refreshCurrentUserTimer();
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  });

  app.get('/api/allinfo', (req, res) => {
    const user = req.user;
    const loggedIn = Boolean(user);
    const qs1 = manager.getQueueState(user);
    const qs2 = g2Manager.getQueueState(user);
    const qs3 = g3Manager.getQueueState(user);
    const qs4 = g4Manager.getQueueState(user);
    res.status(200).json({
      'loggedIn': loggedIn,
      'queueState1': qs1,
      'queueState2': qs2,
      'queueState3': qs3,
      'queueState4': qs4,
    });
  });


  app.get('/api/g3/info', (req, res) => {
    const user = req.user;
    const loggedIn = Boolean(user);
    const queueState = g3Manager.getQueueState(user);
    res.status(200).json({
      'loggedIn': loggedIn,
      'queueState': queueState
    });
  });

  app.get('/api/g4/info', (req, res) => {
    const user = req.user;
    const loggedIn = Boolean(user);
    const queueState = g4Manager.getQueueState(user);
    res.status(200).json({
      'loggedIn': loggedIn,
      'queueState': queueState
    });
  });


  app.post('/g3/data', (req, res) => {
    if (!req.user || !g3Manager.isCurrentUser(req.user)) {
      res.sendStatus(403);
    } else {
      //g3Manager.refreshCurrentUserTimer();
      if ((req.body.resistance == undefined) || (req.body.brightness == undefined) || isNaN(req.body.resistance) || isNaN(req.body.brightness)) {
        res.sendStatus(400);
      } else {
        g3Controller.sendData({
          resistance: parseInt(req.body.resistance),
          brightness: parseInt(req.body.brightness)
        });
      }
    }
  });



  // admin route to replace the current user with the next in the queue
  // app.get('/admin/kick/:pass', (req, res) => {
  //   const pass = req.params.pass;
  //   const admin_pass = process.env.ADMIN_PASS || null;
  //   if (admin_pass && pass === admin_pass) {
  //     manager.replaceCurrentUser();
  //     res.sendStatus(200);
  //   } else {
  //     res.sendStatus(403);
  //   }
  // });
}
