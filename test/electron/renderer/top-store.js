'use strict';

const Reflux = require('reflux');
const DataService = require('mongodb-data-service');
const connection = require('./connection');
const Actions = require('../../../index').Actions;

const TopStore = Reflux.createStore({

  init: function() {
    this.dataService = new DataService(connection);
    this.dataService.connect(() => {
      this.listenTo(Actions.pollTop, this.top);
    });
  },

  top: function() {
    this.dataService.top((error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = TopStore;
