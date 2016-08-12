'use strict';

const Reflux = require('reflux');
const DataService = require('mongodb-data-service');
const connection = require('./connection');
const Actions = require('../../../index').Actions;

const ServerStatsStore = Reflux.createStore({

  init: function() {
    this.dataService = new DataService(connection);
    this.dataService.connect(() => {
      this.listenTo(Actions.pollServerStats, this.serverStats);
    });
    this.opCounters = [];
    this.localTime = [];
    this.data = {'opCounters': this.opCounters, 'localTime': this.localTime}; // TODO: add more
  },

  serverStats: function() {
    this.dataService.serverstats((error, doc) => {
      if (doc) {
        this.opCounters.push(doc['opcounters']);
        this.data.opCounters = this.opCounters.slice(Math.max(this.opCounters.length - 100, 0));
        this.localTime.push(doc['localTime']);
        this.data.localTime = this.localTime.slice(Math.max(this.localTime.length - 100, 0));
      }
      this.trigger(error, this.data);
    });
  }
});

module.exports = ServerStatsStore;
