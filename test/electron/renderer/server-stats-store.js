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
    this.opsPerSec = {'insert': [], 'update': [], 'getmore': [], 'delete': [], 'command': [], 'query': []};
    this.rawData = [];
    this.localTime = [];
    this.currentMax = 10;
    this.currentMin = -10;
    this.starting = true;
    this.data = {'operations': [
                    {'op': 'insert', 'count': [], 'active': true, 'current': 0},
                    {'op': 'update', 'count': [], 'active': true, 'current': 0},
                    {'op': 'getmore', 'count': [], 'active': true, 'current': 0},
                    {'op': 'delete', 'count': [], 'active': true, 'current': 0},
                    {'op': 'command', 'count': [], 'active': true, 'current': 0},
                    {'op': 'query', 'count': [], 'active': true, 'current': 0}],
                 'localTime': [],
                 'yDomain': [this.currentMin, this.currentMax],
                 'rawData': []};
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
            this.data.operations[q].current = count;
            continue;
          }
          val = count - this.data.operations[q].current;
          this.opsPerSec[key].push(val);
          this.data.operations[q].count = this.opsPerSec[key].slice(Math.max(this.opsPerSec[key].length - this.maxOps, 0));
          if (val > this.currentMax) {
            this.currentMax = val;
          } else if (val < this.currentMin) {
            this.currentMin = val;
          }
          this.data.operations[q].current = count;
        }
        if (this.starting) {
          this.starting = false;
          return;
        }
        this.rawData.push(doc.opcounters);
        this.data.yDomain = [this.currentMin, this.currentMax];
        this.localTime.push(doc.localTime);
        this.data.localTime = this.localTime.slice(Math.max(this.localTime.length - this.maxOps, 0));
        this.data.rawData = this.rawData.slice(Math.max(this.rawData.length - this.maxOps, 0));
      }
      this.trigger(error, this.data);
    });
  }
});

module.exports = ServerStatsStore;
