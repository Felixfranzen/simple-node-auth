// imports
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const utils = require('./utils');
const appRouteSetup = require('./routes/index.js');
const { verifyToken } = require('./helpers/auth.js')

// init app
const app = express();

// add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(utils.accessControlAllowOrigin);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const router = express.Router();
app.use('/api', router)
appRouteSetup(router);

module.exports = app;

