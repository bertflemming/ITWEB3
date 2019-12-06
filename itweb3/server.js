// Module dependencies
const bodyParser = require('body-parser');
const express = require('express');
let expressWs = require('express-ws');
expressWs = expressWs(express());
const app = expressWs.app;
const router = express.Router();
const passport = require('passport');
const join = require('path').join;
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const API_PORT = process.env.API_PORT || 4000;

// Require all mongoose models
const models = join(__dirname, '/backend/models');
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Setup custom modules here
require('./backend/models/db');
require('./backend/config/passport');

// Server configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
//app.use(express.static('./dist/itweb3'));

require('./backend/config/routes')(router);

app.use('/api', router);

app.listen(API_PORT, () => console.log('Listening on: ' + API_PORT));

module.exports = app;