var express = require('express');
var exphbs = require('express-handlebars');
var axios = require('axios');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

dotenv.config();
const sr = process.env.SR;
const sig = process.env.SIG;
const se = process.env.SE;
const skn = process.env.SKN;
const hub = process.env.HUB;
const device = process.env.DEVICE;
const PORT = process.env.PORT || 3000;

const iotHubURL = `https://${hub}.azure-devices.net/twins/${device}/methods?api-version=2018-06-30`;

const iotHubConfig = {
  'headers': {
    'Content-Type': 'Application/json',
    'Authorization': `SharedAccessSignature sr=${sr}&sig=${sig}&se=${se}&skn=${skn}`  
  }
}

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/api/submit', (req, res) => {
  const color = req.body.colors;
  let method;
  switch (color) {
    case 'red':
      method = 'ledRed';
      break;
    case 'green':
      method = 'ledGreen';
      break;
    default:
      method = 'ledBlue';
      break;
  }
  const data = {
    "methodName": method,
    "responseTimeoutInSeconds": 60,
    "payload": {}
  };
  axios.post(iotHubURL, data, iotHubConfig)
    .then(response => res.status(200).send('color updated'))
    .catch(err => console.log(err));
});

app.listen(PORT);
