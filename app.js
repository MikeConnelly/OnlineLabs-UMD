var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var axios = require('axios');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var http = require('http').Server(app);
var io = require('socket.io')(http);

dotenv.config();
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

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

app.get('/api/distance', (req, res) => {
  // fetch ultrasonic sensor data

  // const data = {
  //   "methodName": "getDistance",
  //   "responseTimeoutInSeconds": 60,
  //   "payload": {}
  // };
  // axios.post(iotHubURL, data, iotHubConfig)
  //   .catch(err => console.log(err))
  //   .then(distData => {
  //     const data = JSON.parse(distData.data.replace('\u0000', ''));
  //     res.render('home', {
  //       xPos: data.x,
  //       yPos: data.y
  //     });
  //   })
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
