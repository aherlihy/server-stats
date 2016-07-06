'use strict';

const Reflux = require('reflux');
const app = require('ampersand-app');
const Actions = require('mongodb-server-stats').Actions;

/**
 * This is an example implementation of a Reflux store for the
 * current op component, that would work in Compass. The only
 * behaviour the store MUST provide is that it listens to the
 * 'pollCurrentOp' action, fetches the currentOp data, and
 * triggers with the result of the command.
 */
const CurrentOpStore = Reflux.createStore({

  /**
   * Initializing the store should set up the listener for
   * the 'pollCurrentOp' command.
   */
  init: function() {
    this.listenTo(Actions.pollCurrentOp, this.currentOp);
  },

  /**
   * In Compass, we would use the data service to get the current
   * op, then trigger with the result and a potential error if
   * there was one.
   */
  currentOp: function() {
    app.dataService.currentOp((error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = CurrentOpStore;
