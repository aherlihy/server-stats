'use strict';

const Reflux = require('reflux');
const DataService = require('mongodb-data-service');
const connection = require('./connection');
const Actions = require('../../../index').Actions;
// const debug = require('debug')('server-stats:server-stats-store');

const ServerStatsStore = Reflux.createStore({

  init: function() {
    this.dataService = new DataService(connection);
    this.dataService.connect(() => {
      this.listenTo(Actions.pollServerStats, this.serverStats);
    });
  },

  serverStats: function() {
    this.dataService.serverstats((error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = ServerStatsStore;
