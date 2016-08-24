'use strict';

const Reflux = require('reflux');
const ServerStatsStore = require('./server-stats-store');
const debug = require('debug')('server-stats:globallock-store');

const GlobalLockStore = Reflux.createStore({

  init: function() {
    this.listenTo(ServerStatsStore, this.globalLock);

    this.opsPerSec = {'aReads': [], 'aWrites': [], 'qReads': [], 'qWrites': []};
    this.rawData = [];
    this.localTime = [];
    this.currentMax = 1;
    this.currentMin = 0;
    this.starting = true;
    this.maxOps = 63;
    this.data = {'operations': [
      {'op': 'aReads', 'count': [], 'active': true, 'current': 0},
      {'op': 'aWrites', 'count': [], 'active': true, 'current': 0},
      {'op': 'qReads', 'count': [], 'active': true, 'current': 0},
      {'op': 'qWrites', 'count': [], 'active': true, 'current': 0}],
      'localTime': [],
      'yDomain': [this.currentMin, this.currentMax],
      'rawData': [],
      'maxOps': this.maxOps,
      'labels': {
        'title': 'read & write',
        'keys': ['active reads', 'active writes', 'queued reads', 'queued writes'],
        'yAxis': ""
      }
    };
  },

  globalLock: function(error, doc) {
      if (!error && doc) {
        var key;
        var val;
        var count;
        var raw = {};
        raw['aReads'] = doc.globalLock.activeClients.readers;
        raw['aWrites'] = doc.globalLock.activeClients.writers;
        raw['qReads'] = doc.globalLock.currentQueue.readers;
        raw['qWrites'] = doc.globalLock.currentQueue.writers;
        for (var q = 0; q < this.data.operations.length; q++) {
          key = this.data.operations[q].op;
          count = raw[key];
          if (this.starting) { // don't add data, starting point
            this.data.operations[q].current = count;
            continue;
          }
          val = count - this.data.operations[q].current;
          this.opsPerSec[key].push(val);
          this.data.operations[q].count = this.opsPerSec[key].slice(Math.max(this.opsPerSec[key].length - this.maxOps, 0));
          if (val > this.currentMax) {
            this.currentMax = val;
          } else if(val < this.currentMin) {
            this.currentMin = val;
          }
          this.data.operations[q].current = count;
        }
        if (this.starting) {
          this.starting = false;
          return;
        }
        this.rawData.push(raw);
        this.data.yDomain = [this.currentMin, this.currentMax];
        this.localTime.push(doc.localTime);
        this.data.localTime = this.localTime.slice(Math.max(this.localTime.length - this.maxOps, 0));
        this.data.rawData = this.rawData.slice(Math.max(this.rawData.length - this.maxOps, 0));
      }
      this.trigger(error, this.data);
  }
});

module.exports = GlobalLockStore;
