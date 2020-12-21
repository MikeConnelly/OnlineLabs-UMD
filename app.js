var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var moment = require('moment');
var dotenv = require('dotenv');
var fileUpload = require('express-fileupload');
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
var { BlobServiceClient } = require('@azure/storage-blob');
var User = require('./models/User');
var MotorController = require('./utils/MotorController');
var G3Controller = require('./utils/G3Controller');
var UserManager = require('./utils/UserManager');
var routes = require('./routes/routes');

dotenv.config();
const admin_pass = process.env.ADMIN_PASS;
const mongo_connection = process.env.DBCONN;
const auth_client_id = process.env.AUTHID;
const auth_client_secret = process.env.AUTHSECRET;
const cookieKey = process.env.COOKIEKEY;
const iotHubConnectionString = process.env.CONNECTIONSTRING;
const eventHubConsumerGroup = process.env.CONSUMERGROUP;
const storageConnectionString = process.env.BLOBCONNECTION;
const blobContainerName = 'blob';
const port = process.env.PORT || 3000;


var client = Client.fromConnectionString(iotHubConnectionString);
var eventHubReader = new EventHubReader(iotHubConnectionString, eventHubConsumerGroup);
var blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
var containerClient = blobServiceClient.getContainerClient(blobContainerName);
var controller = new MotorController(client);
var g3Controller = new G3Controller(client);
var manager = new UserManager(io, controller, 'g1');
var g2Manager = new UserManager(io, null, 'g2');
var g3Manager = new UserManager(io, g3Controller, 'g3');
var g4Manager = new UserManager(io, null, 'g4');

let connectionCount = 0;


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



app.use(fileUpload({ createParentPath: true }));
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



routes(admin_pass, app, manager, g2Manager, g3Manager, g4Manager, controller, g3Controller);

// auth routes
// app.use('/:page/auth/google', (req, res, next) => {
//   req.session.returnTo = req.params.page;
//   next();
// });

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/:page/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
  // req.session.returnTo = null;
});

app.get('/auth/umd', passport.authenticate('umd-cas'));

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
    res.redirect('/');  
  }
});



app.post('/api/g4/upload', async (req, res) => {
  if (!req.user || !g4Manager.isCurrentUser(req.user)) {
    res.sendStatus(403);
  } else {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        let file = req.files.update;
        const staticFileName = 'device.bin';

        filepath = path.join('./uploads/', staticFileName);
        await file.mv(filepath);
        const blockBlobClient = containerClient.getBlockBlobClient(staticFileName);
        await blockBlobClient.uploadFile(filepath, { blockSize: file.size });

        const data = {
          'methodName': 'update',
          'responseTimeoutInSeconds': 60,
          'payload': {}
        };
        // g3 and g4 use the same iothub client but different device name
        client.invokeDeviceMethod('gizmo4', data, (err, result) => {
          if (err && !(err instanceof SyntaxError)) {
            console.error(err);
          } else {
            console.log('successfully invoked device method');
            res.sendStatus(200);
          }
        });
      }
    } catch (err) {
      res.sendStatus(400);
    }
  }
});



/**
 * handle user disconnect
 * @param {SocketIO.Socket} socket socket of the client that disconnected
 */
// function handleDisconnect(socket) {
//   const user = socket.request.user;
//   const project = Boolean(user) ? user.project : null;
//   if (project) {
//     switch (project) {
//       case 'g1':
//         if (manager.isCurrentUser(user)) {
//           controller.resetMotorsAndClear(null);
//         }
//         manager.userDisconnected(user);
//         break;
//       case 'g2':
//         g2Manager.userDisconnected(user);
//         break;
//       case 'g3':
//         g3Manager.userDisconnected(user);
//         break;
//       default:
//         break;
//     }
//   }
//   socket.request.user.project = null;
// }

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
  connectionCount++;
  if (connectionCount === 1) { startAllMessages(); }

  socket.on('disconnect', () => {
    if (socket.request.user) {
      console.log('user disconnected: ' + socket.request.user.name);
      // use socket to dequeue user
      // handleDisconnect(socket);
      connectionCount--;
      if (connectionCount === 0) { stopAllMessages(); }
    }
  });
});



/**
 * Sends ultrasonic sensor data to all clients not in a project other than the specified project.
 * This is because any user than is not in another project could currently be looking at that sensor data.
 * @param {Object} payload the data to braodcast
 * @param {String} project the project page to receive the sensor data
 */
function broadcastSensorData(payload, project) {
  passportSocketIo.filterSocketsByUser(io, user => {
    return (!Boolean(user.project) || user.project === project);
  }).forEach(socket => {
    socket.emit(`${project}SensorData`, payload);
  });
  // Object.keys(io.sockets.sockets).forEach(id => {
  //   const socket = io.sockets.connected[id]
  //   socket.emit('sensorData', payload);
  // });
}

// Reads device messages with ultrasonic sensor data and braodcasts it to all clients
(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      // console.log(`${deviceId}, ${JSON.stringify(message)}`);
      if (deviceId === 'gizmo1') { // gizmo1 message
        const dataInMM =  {
          messageId: message.messageId,
          x_distance: (message.x_distance * 25.4),
          y_distance: (message.y_distance * 25.4)
        }
        const now = moment();
        const time = now.format('h:mm:ss');
        const payload = {
          index: time,
          iotData: dataInMM
        };
        broadcastSensorData(payload, 'g1');
      } else { // gizmo3 message
        const payload = {
          iotData: message
        };
        broadcastSensorData(payload, 'g3');
      }
    } catch (err) {
      console.error(err);
    }
  })
})().catch();


/**
 * stops all messages from gizmo-1 and gizmo-3 devices
 */
function stopAllMessages() {
  const data = {
    "methodName": "stop",
    "responseTimeoutInSeconds": 60,
    "payload": {}
  };
  client.invokeDeviceMethod('gizmo1', data, (err, result) => {
    console.log('g1 messages stopped');
  });
  client.invokeDeviceMethod('gizmo3', data, (err, result) => {
    console.log('g3 messages stopped');
  });
}

/**
 * starts all messages from gizmo-1 and gizmo-3 devices
 */
function startAllMessages() {
  const data = {
    "methodName": "start",
    "responseTimeoutInSeconds": 60,
    "payload": {}
  };
  client.invokeDeviceMethod('gizmo1', data, (err, result) => {
    console.log('g1 messages started');
  });
  client.invokeDeviceMethod('gizmo3', data, (err, result) => {
    console.log('g3 messages started');
  });
}


// start listening and stop all incoming device messages by default
http.listen(port, () => {
  console.log(`listening on port ${port}`);
  stopAllMessages();
});
