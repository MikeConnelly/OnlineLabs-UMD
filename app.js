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
var FacebookStrategy = require('passport-facebook').Strategy;
// var LocalStrategy = require('passport-local').Strategy;
var Client = require('azure-iothub').Client;
var EventHubReader = require('./scripts/event-hub-reader');
var User = require('./models/User');
var UserManager = require('./utils/UserManager');
var routes = require('./routes/routes');

dotenv.config();
// const mode = process.env.MODE;
// const sas = process.env.SAS;
// const iotHubURL = process.env.URL;
const mongo_connection = process.env.DBCONN;
const auth_client_id = process.env.AUTHID;
const auth_client_secret = process.env.AUTHSECRET;
const cookieKey = process.env.COOKIEKEY;
const iotHubConnectionString = process.env.CONNECTIONSTRING;
const eventHubConsumerGroup = process.env.CONSUMERGROUP;
const facebook_client_id = process.env.FACEBOOK_CLIENT_ID;
const facebook_client_secret = process.env.FACEBOOK_CLIENT_SECRET;
const port = process.env.PORT || 3000;

// Used along with iotHubURL to manually send post requests to the device given an SAS key
// Not used anymore in favor of the azure-iothub library
/**
const iotHubConfig = {
  'headers': {
    'Content-Type': 'Application/json',
    'Authorization': sas
  }
}
*/
var client = Client.fromConnectionString(iotHubConnectionString);
var eventHubReader = new EventHubReader(iotHubConnectionString, eventHubConsumerGroup);
var manager = new UserManager(io, client);


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

// setup passport to use Facebook strategy
passport.use(
  new FacebookStrategy({
    clientID: facebook_client_id,
    clientSecret: facebook_client_secret,
    callbackURL: '/auth/facebook/redirect',
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ siteId: profile.id }).then(currentUser => {
      if (currentUser) {
        done(null, currentUser);
      } else {
        new User({
          siteId: profile.id,
          name: profile.name
        }).save().then(newUser => {
          done(null, newUser);
        })
      }
    })
  })
);

// setup passport for local strategy
// doesn't work, but would be ideal for faking auth and
// still injecting user data into sockets
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     console.log('passport auth function');
//     User.findOne({ username: username }, (err, user) => {
//       if (err) { return done(err); }
//       if (user) {
//         done(null, user);
//       } else {
//         new User({
//           name: username
//         }).save().then(newUser => {
//           done(null, newUser);
//         })
//       }
//     })
//   }
// ))

// needed for passport authentication
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

routes(app, manager);

// auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
});

// app.post('/auth/login', passport.authenticate('local', { failureRedirect: '/failure' }), (req, res) => {
//   console.log(`/auth/login user: ${req.user}`);
//   manager.addUser(req.user);
//   manager.updateAllClients();
// });



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
    manager.resetMotorsAndClear(null);
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
    console.log(`broadcasting data: ${JSON.stringify(payload)}`);
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
