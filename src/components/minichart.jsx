const React = require('react');
const _ = require('lodash');
const D3Component = require('./d3component');
const vizFns = require('../d3');

// const debug = require('debug')('mongodb-compass:schema:minichart');

const Minichart = React.createClass({

  propTypes: {
    fieldName: React.PropTypes.string.isRequired,
    type: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      containerWidth: null,
      query: {}
    };
  },

  componentDidMount() {
    const rect = this.refs.minichart.getBoundingClientRect();

    /* eslint react/no-did-mount-set-state: 0 */

    // yes, this is not ideal, we are rendering the empty container first to
    // measure the size, then render the component with content a second time,
    // but it is not noticable to the user.
    this.setState({
      containerWidth: rect.width
    });
    window.addEventListener('resize', this.handleResize);

  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.unsubscribeQueryStore();
  },

  handleResize() {
    const rect = this.refs.minichart.getBoundingClientRect(); //built in func for browser DOM elements
    this.setState({
      containerWidth: rect.width
    });
  },

  minichartFactory() {
    /* eslint camelcase: 0 */
    // return (
    //   <D3Component
    //     fieldName={'MyFieldName'}
    //     type={this.props.type}
    //     renderMode="svg"
    //     query={"testQuery"}
    //     width={width}
    //     height={100}
    //     fn={fn}
    //   />
    // );
    return ( <div>SOMETHING</div>);
  },

  render() {
    const minichart = this.state.containerWidth ? this.minichartFactory() : null;
    return (
      <div ref="minichart">
        {minichart}
      </div>
    );
  }

});

module.exports = Minichart;
