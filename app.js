var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var axios = require('axios');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var cookieSession = require('cookie-session');
var User = require('./models/User');

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

passport.use(
  new GoogleStrategy({
      clientID: auth_client_id,
      clientSecret: auth_client_secret,
      callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne({googleId: profile.id}).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id
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

app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send(req.user);
  res.send('you reached the redirect URI');
});

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.send(req.user);
});

app.get('/', (req, res) => {
  // const data = {
  //   "methodName": "getColor",
  //   "responseTimeoutInSeconds": 60,
  //   "payload": {}
  // };
  // axios.post(iotHubURL, data, iotHubConfig)
  //   .catch(err => console.log(err))
  //   .then(colorData => {
  //     const data = colorData.data.replace('\u0000', '');
  //     const color = JSON.parse(data).payload;
  //     res.render('home', {
  //       color: color
  //     });
  //   })
  res.render('movement');
});

// app.post('/api/submit', (req, res) => {
//   const color = req.body.colors;
//   let method;
//   switch (color) {
//     case 'red':
//       method = 'ledRed';
//       break;
//     case 'green':
//       method = 'ledGreen';
//       break;
//     default:
//       method = 'ledBlue';
//       break;
//   }
//   const data = {
//     "methodName": method,
//     "responseTimeoutInSeconds": 60,
//     "payload": {}
//   };
//   axios.post(iotHubURL, data, iotHubConfig)
//     .catch(err => console.log(err))
//     .then(response => res.render('home', {
//       color: color
//     }))
// });

app.post('/api/movement', (req, res) => {
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
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

io.on('connection', socket => {
  console.log('new connection');

  // socket.on('color update', update => {
  //   io.emit('color update', update);
  // });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
