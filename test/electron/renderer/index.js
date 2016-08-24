'use strict';

require('babel-register')({ extensions: ['.jsx'] });

const React = require('react');
const ReactDOM = require('react-dom');

// const CurrentOpComponent = require('../../../index').CurrentOpComponent;
// const CurrentOpStore = require('./current-op-store');
// const TopComponent = require('../../../index').TopComponent;
// const TopStore = require('./top-store');

const OpCountersComponent = require('../../../index').OpCountersComponent;
const NetworkComponent = require('../../../index').NetworkComponent;
const MemComponent = require('../../../index').MemComponent;
const GlobalLockComponent = require('../../../index').GlobalLockComponent;


const OpCountersStore = require('./opcounters-store');
const NetworkStore = require('./network-store');
const MemStore = require('./mem-store');
const GlobalLockStore = require('./globallock-store');


// ReactDOM.render(
//   React.createElement(CurrentOpComponent, { store: CurrentOpStore, interval: 2000 }),
//   document.getElementById('currentOpContainer') // eslint-disable-line no-undef
// );
// ReactDOM.render(
//     React.createElement(TopComponent, { store: TopStore, interval: 2000 }),
//     document.getElementById('topContainer') // eslint-disable-line no-undef
// );
ReactDOM.render(
    React.createElement(OpCountersComponent, { store: OpCountersStore, interval: 1000 }),
    document.getElementById('opCounterContainer') // eslint-disable-line no-undef
);
ReactDOM.render(
  React.createElement(NetworkComponent, { store: NetworkStore, interval: 1000 }),
  document.getElementById('networkContainer') // eslint-disable-line no-undef
);
ReactDOM.render(
  React.createElement(MemComponent, { store: MemStore, interval: 1000 }),
  document.getElementById('memContainer') // eslint-disable-line no-undef
);
ReactDOM.render(
  React.createElement(GlobalLockComponent, { store: GlobalLockStore, interval: 1000 }),
  document.getElementById('globalLockContainer') // eslint-disable-line no-undef
);
