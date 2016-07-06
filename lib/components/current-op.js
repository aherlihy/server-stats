'use strict';

const React = require('react');
const Actions = require('../actions');

/**
 * Represents the component that renders the current op information.
 */
class CurrentOp extends React.Component {

  /**
   * The current op component should be initialized with a 'store'
   * property, that triggers with the result of a { currentOp: 1 }
   * command.
   */
  constructor(props) {
    super(props);
    this.state = { data: {} };
  }

  /**
   * When the component mounts, the component will subscribe to the
   * provided store, so that each time the store triggers the component
   * can update its state.
   */
  componentDidMount() {
    this.unsubscribeRefresh = this.props.store.listen(this.refresh.bind(this));
    this.inervalId = setInterval(() => {
      Actions.currentOp();
    }, this.props.interval);
  }

  /**
   * When the component unmounts, we unsubscribe from the store and stop the
   * timer.
   */
  componentWillUnmount() {
    this.unsubscribeRefresh();
    clearInterval(this.intervalId);
  }

  /**
   * Refreshes the component state with the new current op data that was
   * received from the store.
   *
   * @param {Object} data - The javascript object for the result of the command.
   */
  refresh(data) {
    this.setState({ data: data });
  }

  /**
   * Renders the component.
   *
   * @returns {React.Component} The component.
   */
  render() {
    return React.createElement(
      'div',
      null,
      this.state.data
    );
  }
}

CurrentOp.displayName = 'CurrentOp';

module.exports = CurrentOp;