var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var exphbs = require('express-handlebars');
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
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var UserManager = require('./utils/UserManager');
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
// passport.use(
//   new GoogleStrategy({
//       clientID: auth_client_id,
//       clientSecret: auth_client_secret,
//       callbackURL: '/auth/google/redirect'
//     }, (accessToken, refreshToken, profile, done) => {
//       User.findOne({ googleId: profile.id }).then(currentUser => {
//         if (currentUser) {
//           done(null, currentUser);
//         } else {
//           new User({
//             googleId: profile.id,
//             name: profile.displayName
//           }).save().then(newUser => {
//             done(null, newUser);
//           })
//         }
//       })
//     }
//   )
// );

passport.use(
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'username'  
  }, (username, password, done) => {
    console.log('passport authorization function');
    User.findOne({ name: username }).then(currentUser => {
      if (currentUser) { done(null, currentUser); }
      else {
        new User({
          name: username
        }).save().then(newUser => done(null, newUser))
      }
    })
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // needs to be false for sessions to work for some reason???
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
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
// 
// app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
//   res.redirect('/');
// });

app.post('/auth/login', passport.authenticate('local', { failureRedirect: '/failure' }), (req, res) => {
  console.log(`/auth/login user: ${req.user}, session: ${JSON.stringify(req.session)}`);
  manager.addUser(req.user);
  updateAllClients();
});

// app.get('/done', (req, res) => {
//   console.log(`/auth/login user: ${req.user}, session: ${JSON.stringify(req.session)}`);
//   manager.addUser(req.user);
//   updateAllClients();
// });

app.get('/auth/logout', (req, res) => {
  if (!req.user) { res.status(400).send('not logged in'); }
  else {
    manager.userDisconnected(req.user);
    req.logout();
    res.status(200).send('logged out');
    updateAllClients();
  }
});




app.get('/api/info', (req, res) => {
  console.log(`/api/info user: ${req.user}, session: ${JSON.stringify(req.session)}`);
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
    axios.post(iotHubURL, data, iotHubConfig)
      .catch(err => console.log(err))
      .then(response => res.status(200).send('ok'))
  }
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
    axios.post(iotHubURL, data, iotHubConfig)
      .catch(err => console.log(err))
      .then(response => res.status(200).send('ok'))
  }
});




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
  console.log(JSON.stringify(user));

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
  //accept(null, false);
  accept(new Error(message));
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
