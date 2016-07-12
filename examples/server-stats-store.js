'use strict';

const Reflux = require('reflux');
const app = require('ampersand-app');
const Actions = require('mongodb-server-stats').Actions;

/**
 * This store listens to the
 * 'pollServerStats' action, fetches the serverStatus data, and
 * triggers with the result of the command.
 *
 * This store would be passed as a property to the ServerStats
 * component:
 *
 *    const ReactDOM = require('react-dom');
 *    const ServerStatsComponent = require('mongodb-server-stats').ServerStatsComponent;
 *    const ServerStatsStore = require('./server-stats-store');
 *
 *    var component = <ServerStatsComponent store={ServerStatsStore} />;
 *    ReactDOM.render(component, document.getElementById('server-stats-container'));
 *
 */
const ServerStatsStore = Reflux.createStore({

  /**
   * Initializing the store should set up the listener for
   * the 'pollServerStats' command.
   */
  init: function() {
    this.listenTo(Actions.pollServerStats, this.serverStats);
  },

  /**
   * In Compass, we would use the data service to get the serverStats
   * then trigger with the result and a potential error if
   * there was one.
   */
  serverStats: function() {
    app.dataService.serverstats((error, doc) => {
      this.trigger(error, doc);
    });
  }
});

module.exports = ServerStatsStore;
