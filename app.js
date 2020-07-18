var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cors = require('cors');
var axios = require('axios');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./models/User');
var UserManager = require('./utils/UserManager');
var EventHubReader = require('./scripts/event-hub-reader');
var Client = require('azure-iothub').Client;
var config = require('./scripts/config');
var manager = new UserManager();

dotenv.config();
// const mode = process.env.MODE;
const mongo_connection = process.env.DBCONN;
const auth_client_id = process.env.AUTHID;
const auth_client_secret = process.env.AUTHSECRET;
const cookieKey = process.env.COOKIEKEY;
const sas = process.env.SAS;
const iotHubURL = process.env.URL;
const port = process.env.PORT || 3000;

const iotHubConnectionString = config.iotHubConnectionString;
const eventHubConsumerGroup = config.eventHubConsumerGroup;

const iotHubConfig = {
  'headers': {
    'Content-Type': 'Application/json',
    'Authorization': sas
  }
}

// setup mongo connection
mongoose.connect(mongo_connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => {
  console.log('Mongo Connected');
}).on('error', () => {
  console.log('MongoDB connection error');
  process.exit(1);
});

// setup passport to use Google Strategy
passport.use(
  new GoogleStrategy({
      clientID: auth_client_id,
      clientSecret: auth_client_secret,
      callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id,
            name: profile.displayName
          }).save().then(newUser => {
            done(null, newUser);
          })
        }
      })
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');
// app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, 'build/')));
app.use(cookieParser(cookieKey));

// autoRemove fields are used to run in compatibility mode so it works with CosmosDB because Azure hates my existance
var sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  autoRemove: 'interval',
  autoRemoveInterval: 10
});
app.use(session({
  store: sessionStore,
  secret: cookieKey,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());




// auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

app.get('/auth/logout', (req, res) => {
  if (!req.user) { res.status(400).send('not logged in'); }
  else {
    manager.userDisconnected(req.user);
    resetMotors(null);
    req.logout();
    res.status(200).send('logged out');
    updateAllClients();
  }
});




app.get('/api/info', (req, res) => {
  const user = req.user;
  const loggedIn = Boolean(user);
  const queueState = manager.getQueueState(user);
  res.status(200).json({
    'loggedIn': loggedIn,
    'queueState': queueState
  });
});

// app.post('/api/enqueue', (req, res) => {
//   if (!req.user) {
//     res.redirect('/auth/google');
//   } else {
//     const user = req.user;
//     manager.addUser(user);
//     
//     const queueState = manager.getQueueState(user);
//     res.status(200).json(queueState);
//   }
// });

app.post('/api/movement', (req, res) => {
  if (!req.user || !manager.isCurrentUser(req.user)) {
    res.status(403).send('Not authorized');
  } else {
    // motor input scheme is 0000,0000 to 9999,9999
    const xDelta = parseInt(req.body.x);
    const yDelta = parseInt(req.body.y);
    if (isNaN(xDelta) || isNaN(yDelta)) {
      res.status(400).send('error');
    }
    const data = {
      "methodName": "move",
      "responseTimeoutInSeconds": 60,
      "payload": {
        'x': xDelta,
        'y': yDelta
      }
    };
    deviceMethod(data, () => res.status(200).send('ok'));
    // axios.post(iotHubURL, data, iotHubConfig)
    //   .catch(err => console.log(err))
    //   .then(response => res.status(200).send('ok'))
  }// 
});

app.post('/api/moveArray', (req, res) => {
  if (!req.user || !manager.isCurrentUser(req.user)) {
    res.status(403).send('Not authorized');
  } else {
    const xArr = req.body.x;
    const yArr = req.body.y;
    const data = {
      "methodName": "moveArray",
      "responseTimeoutInSeconds": 60,
      "payload": {
        'x': xArr,
        'y': yArr
      }
    };
    deviceMethod(data, () => res.status(200).send('ok'));
    // axios.post(iotHubURL, data, iotHubConfig)
    //   .catch(err => console.log(err))
    //   .then(response => res.status(200).send('ok'))
  }
});

app.post('/api/reset', (req, res) => {
  if (!req.user || !manager.isCurrentUser(req.user)) {
    res.status(403).send('Not authorized');
  } else {
    resetMotors(() => {
      res.status(200).send('motors reset');
    });
  }
});

app.post('/api/finish', (req, res) => {
  if (!req.user || !manager.isCurrentUser(req.user)) {
    res.status(403).send('Not authorized');
  } else {
    manager.replaceCurrentUser();
    resetMotors(() => {
      res.status(200).send('user finished');
    });
    updateAllClients();
  }
})




/**
 * Calls device method to reset motor position
 * @param {Function} cb optional callback function
 */
function resetMotors(cb) {
  const data = {
    "methodName": "reset",
    "responseTimeoutInSeconds": 60,
    "payload": {}
  };
  deviceMethod(data, () => res.status(200).send('ok'));
  // axios.post(iotHubURL, data, iotHubConfig)
  //   .catch(err => console.log(err))
  //   .then(response => {
  //     console.log('motors reset');
  //     if (cb) { cb(); }
  //   });
}

/**
 * send queue state to clients
 * @param {SocketIO.Socket} socket socket the information is being sent to
 */
function updateClient(socket) {
  let user;
  if (!socket.request.user.logged_in) {
    user = undefined;
  } else {
    user = socket.request.user;
  }

  const queueState = manager.getQueueState(user);
  socket.emit('QueueState', queueState);
}

/**
 * send queue state to all clients
 */
function updateAllClients() {
  Object.keys(io.sockets.sockets).forEach(id => {
    updateClient(io.sockets.connected[id]);
  });
}

/**
 * handle user enqueue event
 * @param {SocketIO.Socket} socket socket of the client entering the queue
 */
function handleEnqueue(socket) {
  if (!socket.request.user.logged_in) { return; }
  const user = socket.request.user;
  manager.addUser(user);
}

/**
 * handle user disconnect
 * @param {SocketIO.Socket} socket socket of the client that disconnected
 */
function handleDisconnect(socket) {
  const user = socket.request.user;
  manager.userDisconnected(user);
  resetMotors(null);
}

// where socket connections and events are handled
io.on('connection', socket => {
  console.log('new connection');

  socket.on('enqueue', () => {
    // enqueue user
    handleEnqueue(socket)
    // broadcast update to all other clients
    updateAllClients();
  });

  socket.on('disconnect', () => {
    if (socket.request.user) {
      console.log('user disconnected: ' + socket.request.user.name);
      // use socket to dequeue user
      handleDisconnect(socket);
      // broadcast update to all other clients
      updateAllClients();
    }
  });
});

/**
 * Optional success callback for passport-socket.io
 */
function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept(null, true);
}

/**
 * Optional failure callback for passport-socket.io
 */
function onAuthorizeFail(data, message, error, accept) {
  console.log('failed connection to socket.io: ', message);
  accept(null, false);
}

// inject user and session data from passport into sockets
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  secret: cookieKey,
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

// go
http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

var client = Client.fromConnectionString(iotHubConnectionString);

/**
 * Wrapper for getting SAS key and sending a post request to our device
 * @param {Object} data direct method parameters
 */
function deviceMethod(data, cb) {
  client.invokeDeviceMethod('MyNodeESP32', data, (err, result) => {
    if (err) {
      console.log('failed to invoke device method...');
    } else {
      console.log(JSON.stringify(result, null, 2));
      cb();
    }
  });
}

const eventHubReader = new EventHubReader(iotHubConnectionString, eventHubConsumerGroup);
let i = 0;

(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      const payload = {
        index: i,
        IotData: message,
        DeviceId: deviceId
      };
      // broadcast shit
      // console.log(JSON.stringify(payload));
      broadcastSensorData(payload);
      i++;
    } catch (err) {
      console.log(`${err}, ${JSON.stringify(message)}`);
    }
  })
})().catch();

function broadcastSensorData(payload) {
  Object.keys(io.sockets.sockets).forEach(id => {
    const socket = io.sockets.connected[id]
    console.log(`broadcasting data: ${JSON.stringify(payload)}`);
    socket.emit('sensor-data', payload);
  });
}
