'use strict';

const Reflux = require('reflux');
const DataService = require('mongodb-data-service');
const connection = require('./connection');
const Actions = require('../../../index').Actions;

const CurrentOpStore = Reflux.createStore({

  init: function() {
    this.dataService = new DataService(connection);
    this.dataService.connect(() => {
      this.listenTo(Actions.pollCurrentOp, this.currentOp);
    });
  },

  currentOp: function() {
    this.dataService.currentOp(true, (error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = CurrentOpStore;
