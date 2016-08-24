'use strict';

require('babel-register')({ extensions: ['.jsx'] });

const React = require('react');
const ReactDOM = require('react-dom');

// const CurrentOpComponent = require('../../../index').CurrentOpComponent;
// const CurrentOpStore = require('./current-op-store');

const OpCountersComponent = require('../../../index').OpCountersComponent;

// const TopComponent = require('../../../index').TopComponent;
// const TopStore = require('./top-store');

const OpCountersStore = require('./opcounters-store');


// ReactDOM.render(
//   React.createElement(CurrentOpComponent, { store: CurrentOpStore, interval: 2000 }),
//   document.getElementById('currentOpContainer') // eslint-disable-line no-undef
// );
ReactDOM.render(
    React.createElement(OpCountersComponent, { store: OpCountersStore, interval: 1000 }),
    document.getElementById('serverStatsContainer') // eslint-disable-line no-undef
);
// ReactDOM.render(
//     React.createElement(TopComponent, { store: TopStore, interval: 2000 }),
//     document.getElementById('topContainer') // eslint-disable-line no-undef
// );
