'use strict';

const Reflux = require('reflux');
const app = require('ampersand-app');
const Actions = require('mongodb-server-stats').Actions;

/**
 * This store listens to the
 * 'pollTop' action, fetches the top data, and
 * triggers with the result of the command.
 *
 * This store would be passed as a property to the top
 * component:
 *
 *    const ReactDOM = require('react-dom');
 *    const TopComponent = require('mongodb-server-stats').TopComponent;
 *    const TopStore = require('./top-store');
 *
 *    var component = <TopComponent store={TopStore} />;
 *    ReactDOM.render(component, document.getElementById('top-container'));
 *
 */
const TopStore = Reflux.createStore({

  /**
   * Initializing the store should set up the listener for
   * the 'pollTop' command.
   */
  init: function() {
    this.listenTo(Actions.pollTop, this.top);
  },

  /**
   * In Compass, we would use the data service to get the
   * top, then trigger with the result and a potential error if
   * there was one.
   */
  top: function() {
    app.dataService.top((error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = TopStore;
