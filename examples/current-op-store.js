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
 *
 * This store would be passed as a property to the CurrentOp
 * component:
 *
 *    const ReactDOM = require('react-dom');
 *    const CurrentOpComponent = require('mongodb-server-stats').CurrentOpComponent;
 *    const CurrentOpStore = require('./current-op-store');
 *
 *    var component = <CurrentOpComponent store={CurrentOpStore} />;
 *    ReactDOM.render(component, document.getElementById('current-op-container'));
 *
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
    app.dataService.currentOp(true, (error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = CurrentOpStore;
