var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var moment = require('moment');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(expressSession);
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var UMDCASStrategy = require('passport-umd-cas').Strategy;
var Client = require('azure-iothub').Client;
var EventHubReader = require('./scripts/event-hub-reader');
var User = require('./models/User');
var MotorController = require('./utils/MotorController');
var G2Controller = require('./utils/G2Controller');
var UserManager = require('./utils/UserManager');
var routes = require('./routes/routes');

dotenv.config();
const mongo_connection = process.env.DBCONN;
const auth_client_id = process.env.AUTHID;
const auth_client_secret = process.env.AUTHSECRET;
const cookieKey = process.env.COOKIEKEY;
const iotHubConnectionString = process.env.CONNECTIONSTRING;
const eventHubConsumerGroup = process.env.CONSUMERGROUP;
const vConnectionString = process.env.VCONNECTIONSTRING;
const port = process.env.PORT || 3000;


var client = Client.fromConnectionString(iotHubConnectionString);
var g2Client = Client.fromConnectionString(vConnectionString);
var eventHubReader = new EventHubReader(iotHubConnectionString, eventHubConsumerGroup);
var controller = new MotorController(client);
var g2Controller = new G2Controller(g2Client);
var manager = new UserManager(io, controller);


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

// setup passport to use UMD-CAS Strategy
passport.use(new UMDCASStrategy({ callbackURL: '/auth/umd/redirect'}, (profile, done) => {
  User.findOne({ siteId: profile.uid }).then(user => {
    if (user) {
      done(user);
    } else {
      new User({
        siteId: profile.uid,
        name: profile.uid
      }).save().then(newUser => {
        done(newUser);
      });
    }
  })
}));

// setup passport to use Google Strategy
passport.use(
  new GoogleStrategy({
    clientID: auth_client_id,
    clientSecret: auth_client_secret,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ siteId: profile.id }).then(currentUser => {
      if (currentUser) {
        done(null, currentUser);
      } else {
        new User({
          siteId: profile.id,
          name: profile.displayName
        }).save().then(newUser => {
          done(null, newUser);
        })
      }
    })
  })
);

// needed for passport authentication
/*passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});*/

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'build/')));
app.use(cookieParser(cookieKey));

// autoRemove fields are used to run in compatibility mode so it works with CosmosDB because Azure hates my existance
var sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  autoRemove: 'interval',
  autoRemoveInterval: 10
});
app.use(expressSession({
  store: sessionStore,
  secret: cookieKey,
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   secure: false
  // }
}));

app.use(passport.initialize());
app.use(passport.session());
// { secret: cookieKey, key: 'connect.sid', store: sessionStore }



routes(app, manager, controller, g2Controller);

// auth routes
// app.use('/:page/auth/google', (req, res, next) => {
//   req.session.returnTo = req.params.page;
//   next();
// });

app.get('/:page/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
  // req.session.returnTo = null;
});

app.get('/:page/auth/umd', passport.authenticate('umd-cas'));

app.get('/auth/umd/redirect', passport.authenticate('umd-cas'), (req, res) => {
  res.redirect('/');
});

app.get('/auth/logout', (req, res) => {
  if (!req.user) { res.sendStatus(400); }
  else {
    const user = req.user;
    if (manager.isCurrentUser(user)) { controller.resetMotorsAndClear(null); }
    manager.userDisconnected(req.user);
    req.logout();
    res.sendStatus(200);
  }
});


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
  if (manager.isCurrentUser(user)) {
    controller.resetMotorsAndClear(null);
  }
  manager.userDisconnected(user);
}

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

// where socket connections and events are handled
io.on('connection', socket => {
  console.log('new connection');

  socket.on('enqueue', () => {
    // enqueue user
    handleEnqueue(socket);
  });

  socket.on('disconnect', () => {
    if (socket.request.user) {
      console.log('user disconnected: ' + socket.request.user.name);
      // use socket to dequeue user
      handleDisconnect(socket);
    }
  });
});



/**
 * Sends ultrasonic sensor data to all clients
 * @param {Object} payload the data to braodcast
 */
function broadcastSensorData(payload) {
  Object.keys(io.sockets.sockets).forEach(id => {
    const socket = io.sockets.connected[id]
    socket.emit('sensorData', payload);
  });
}

// Reads device messages with ultrasonic sensor data and braodcasts it to all clients
(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      const now = moment();
      const time = now.format('h:mm:ss');
      const payload = {
        index: time,
        IotData: message,
        DeviceId: deviceId
      };
      broadcastSensorData(payload);
    } catch (err) {
      console.log(`${err}, ${JSON.stringify(message)}`);
    }
  })
})().catch();


// go
http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
