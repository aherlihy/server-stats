'use strict';

const React = require('react');
const Actions = require('../actions');

/**
 * Represents the component that renders the top information.
 */
class TopComponent extends React.Component {

  /**
   * The top component should be initialized with a 'store'
   * property, that triggers with the result of a { top: 1 }
   * command.
   *
   * @param {Object} props - The component properties.
   */
  constructor(props) {
    super(props);
    this.state = { error: null, data: {} };
  }

  /**
   * When the component mounts, the component will subscribe to the
   * provided store, so that each time the store triggers the component
   * can update its state.
   */
  componentDidMount() {
    this.unsubscribeRefresh = this.props.store.listen(this.refresh.bind(this));
    this.intervalId = setInterval(() => {
      Actions.pollTop();
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
   * Refreshes the component state with the new top data that was
   * received from the store.
   *
   * @param {Error} error - The error, if any occured.
   * @param {Object} data - The javascript object for the result of the command.
   */
  refresh(error, data) {
    this.setState({ error: error, data: data });
  }

  /**
   * Renders the component.
   *
   * @returns {React.Component} The component.
   */
  render() {
    return (
        <div>
          {this.state.error ? this.renderError() : this.renderGraph()}
        </div>
    );
  }

  /**
   * Render the error message in the component.
   *
   * @returns {String} The error message.
   */
  renderError() {
    return this.state.error.message;
  }

  /**
   * Render the graph in the component.
   *
   * @todo: Implement.
   */
  renderGraph() {
    return 'TOP =' + JSON.stringify(this.state.data, null, 2);
  }
}

TopComponent.displayName = 'TopComponent';

module.exports = TopComponent;