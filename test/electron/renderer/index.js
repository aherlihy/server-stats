'use strict';

require('babel-register')({ extensions: ['.jsx'] });

const React = require('react');
const ReactDOM = require('react-dom');

const CurrentOpComponent = require('../../../index').CurrentOpComponent;
const CurrentOpStore = require('./current-op-store');

ReactDOM.render(
  React.createElement(CurrentOpComponent, { store: CurrentOpStore, interval: 2000 }),
  document.getElementById('currentOpContainer') // eslint-disable-line no-undef
);
