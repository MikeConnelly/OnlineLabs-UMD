module.exports = (admin_pass, app, g2Manager) => {

  app.get('/g2', (req, res) => {
    res.redirect('/');
  });
  
  app.get(`/g2/admin/kick/${admin_pass}`, (req, res) => {
    g2Manager.clearQueue();
    res.redirect('/');
  });

  app.post('/api/g2/enqueue', (req, res) => {
    if(!req.user) {
      res.sendStatus(403);
    } else {
      req.user.project = 'g2';
      g2Manager.addUser(req.user);
      res.sendStatus(200);
    }
  });
  
  app.post('/api/g2/returnhome', (req, res) => {
    if (req.user) {
      g2Manager.userDisconnected(req.user);
      req.user.project = null;
    }
    res.sendStatus(200);
  });
  
  app.get('/api/g2/info', (req, res) => {
    const user = req.user;
    const loggedIn = Boolean(user);
    const queueState = g2Manager.getQueueState(user);
    res.status(200).json({
      'loggedIn': loggedIn,
      'queueState': queueState
    });
  });

  app.post('/api/g2/refresh', (req, res) => {
    if (req.user && g2Manager.isCurrentUser(req.user)) {
      g2Manager.refreshCurrentUserTimer();
      res.sendStatus(200);
    } else {
      res.sendStatus(403);
    }
  });
}
