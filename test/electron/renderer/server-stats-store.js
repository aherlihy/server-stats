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
    this.opCounters = {'insert': [], 'update': [], 'getmore': [], 'delete': [], 'command': [], 'query': []};
    this.localTime = [];
    this.currentMax = 0;
    this.data = {'opCounters': {}, 'localTime': [], 'currentMax': this.currentMax}; // TODO: add more
    this.maxOps = 100;
  },

  serverStats: function() {
    this.dataService.serverstats((error, doc) => {
      if (doc) {
        this.localTime.push(doc.localTime);
        this.data.localTime = this.localTime.slice(Math.max(this.localTime.length - this.maxOps, 0));

        var allOps, val;
        for(var key in doc['opcounters']) {
          allOps = this.opCounters[key];
          val = doc['opcounters'][key];
          allOps.push(val);
          this.data.opCounters[key] = allOps.slice(Math.max(allOps.length - this.maxOps, 0));
          if (val > this.currentMax) {
            this.currentMax = val;
          }
        }

        this.data.currentMax = this.currentMax;
      }
      this.trigger(error, this.data);
    });
  }
});

module.exports = ServerStatsStore;
