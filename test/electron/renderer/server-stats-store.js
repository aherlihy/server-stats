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
    this.opcounters = [];
    this.data = {'opcounters': this.opcounters} //TODO: add more
  },

  serverStats: function() {
    this.dataService.serverstats((error, doc) => {
      if (doc != null && 'opcounters' in doc) {
        this.opcounters.push(doc.opcounters);
        this.data.opcounters = this.opcounters.slice(Math.max(this.opcounters.length - 100, 0));
      }
      this.trigger(error, this.data);
    });
  }
});

module.exports = ServerStatsStore;
