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
    this.prevCount = {'insert': 0, 'update': 0, 'getmore': 0, 'delete': 0, 'command': 0, 'query': 0};
    this.opsPerSec = {'insert': [], 'update': [], 'getmore': [], 'delete': [], 'command': [], 'query': []};
    this.localTime = [];
    this.currentMax = 10;
    this.currentMin = -10;
    this.starting = true;
    this.data = {'operations': [
                    {'op': 'insert', 'count': [], 'active': true},
                    {'op': 'update', 'count': [], 'active': true},
                    {'op': 'getmore', 'count': [], 'active': true},
                    {'op': 'delete', 'count': [], 'active': true},
                    {'op': 'command', 'count': [], 'active': true},
                    {'op': 'query', 'count': [], 'active': true}],
                 'localTime': [],
                 'yDomain': [this.currentMin, this.currentMax]};
    this.maxOps = 100;
  },

  serverStats: function() {
    this.dataService.serverstats((error, doc) => {
      if (doc) {
        var key;
        var val;
        var count;
        for (var q = 0; q < this.data.operations.length; q++) {
          key = this.data.operations[q].op;
          count = doc.opcounters[key];
          if (this.starting) { // don't add data, starting point
            this.prevCount[key] = count;
            continue;
          }
          val = count - this.prevCount[key];
          this.opsPerSec[key].push(val);
          this.data.operations[q].count = this.opsPerSec[key].slice(Math.max(this.opsPerSec[key].length - this.maxOps, 0));
          if (val > this.currentMax) {
            this.currentMax = val;
          } else if (val < this.currentMin) {
            this.currentMin = val;
          }
          this.prevCount[key] = count;
        }
        if (this.starting) {
          this.starting = false;
          return;
        }
        this.data.yDomain = [this.currentMin, this.currentMax];
        this.localTime.push(doc.localTime);
        this.data.localTime = this.localTime.slice(Math.max(this.localTime.length - this.maxOps, 0));
      }
      this.trigger(error, this.data);
    });
  }
});

module.exports = ServerStatsStore;
