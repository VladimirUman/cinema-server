require('dotenv').config();

const { configJson } = require('./config');

exports.config = configJson[process.env.NODE_ENV];
