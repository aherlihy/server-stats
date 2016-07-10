'use strict';

const Connection = require('mongodb-connection-model');

const CONNECTION = {
  hostname: '127.0.0.1',
  port: 27025,
  mongodb_database_name: 'admin'
};

module.exports = new Connection(CONNECTION);
