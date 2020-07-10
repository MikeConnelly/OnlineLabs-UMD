var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exphbs = require('express-handlebars');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var axios = require('axios');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./models/User');
var Queue = require('./utils/Queue');
var queue = new Queue();

dotenv.config();
const mongo_connection = process.env.DBCONN;
const auth_client_id = process.env.AUTHID;
const auth_client_secret = process.env.AUTHSECRET;
const cookieKey = process.env.COOKIEKEY;
const sr = process.env.SR;
const sig = process.env.SIG;
const se = process.env.SE;
const skn = process.env.SKN;
const hub = process.env.HUB;
const device = process.env.DEVICE;
const port = process.env.PORT || 3000;

const iotHubURL = `https://${hub}.azure-devices.net/twins/${device}/methods?api-version=2018-06-30`;

const iotHubConfig = {
  'headers': {
    'Content-Type': 'Application/json',
    'Authorization': `SharedAccessSignature sr=${sr}&sig=${sig}&se=${se}&skn=${skn}`
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
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
app.use(cookieParser(cookieKey));

// autoRemove fields are used to run in compatibility mode so it works with CosmosDB because Azure hates my existance
var sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  autoRemove: 'interval',
  autoRemoveInterval: 10 // in minutes
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
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

app.get('/auth/logout', (req, res) => {
  req.logout(); // destroys cookie
});





app.get('/', (req, res) => {
  if (!req.user) {
    res.redirect('/auth/google');
  } else {
    res.render('home');
  }
});

app.post('/api/enqueue', (req, res) => {
  if (!req.user) {
    res.redirect('/auth/google');
  } else {
    const user = req.user;
    queue.addUser(user); // need to check if they should be made current user
  }
});

app.post('/api/movement', (req, res) => {
  if (!req.user || !queue.isCurrentUser(req.user)) {
    res.status(403).send('Not authorized');
  } else {
    // motor input scheme is 0000,0000 to 9999,9999
    const xDelta = parseInt(req.body.x);
    const yDelta = parseInt(req.body.y);
    if (isNaN(xDelta) || isNaN(yDelta)) {
      res.send('error');
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




/**
 * send queue state to clients
 * @param {SocketIO.Socket} socket socket the information is being sent to
 */
function updateState(socket) {
  const user = socket.request.user;
  const currentUser = queue.getCurrentUser();

  const placeInQueue = queue.getPlaceInQueue(user); // 0 if user not there
  const queueLength = queue.getLength();
  const currentUserName = currentUser ? currentUser.name : 'None'
  const isCurrentUser = queue.isCurrentUser(user);
  const inQueue = (placeInQueue > 0) ? true : false;

  socket.emit('QueueState', {
    'inQueue': inQueue,
    'isCurrentUser': isCurrentUser,
    'placeInQueue': placeInQueue,
    'queueLength': queueLength,
    'currentUserName': currentUserName
  });
}

/**
 * handle user disconnect
 * @param {SocketIO.Socket} socket socket of the user that disconnected
 */
function handleDisconnect(socket) {
  const user = socket.request.user;
  queue.userDisconnected(user);
}

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  console.log('failed connection to socket.io: ', message);
  accept(null, false);
}

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  secret: cookieKey,
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

let interval; // interval to update state for each socket
io.on('connection', socket => {
  console.log('new connection');

  if (interval) { clearInterval(interval); }
  interval = setInterval(() => updateState(socket), 3000); // update every 3 seconds

  socket.on('disconnect', () => {
    if (socket.request.user) {
      console.log('user disconnected ' + socket.request.user.name);
      clearInterval(interval);
      // use socket to dequeue user
      handleDisconnect(socket);
    }
  });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
