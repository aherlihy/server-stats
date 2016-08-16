const d3 = require('d3');
const debug = require('debug')('server-stats:testchart');
const testfunction = function() {
  'use strict';
  debug('Setting up testfunction');
  var width = 400;
  var height = 300;
  var x = d3.time.scale();
  var y = d3.scale.linear();
  var yAxis = d3.svg.axis().scale(y).orient('left');
  var xAxis = d3.svg.axis()
    .scale(x).orient('bottom')
    .tickFormat(d3.time.format('%a %d %I:%M:%S'));

  function chart(selection) {
    selection.each(function(data) {
      debug(data);
      var margin = {top: 20, right: 20, bottom: 60, left: 60};
      var subheight = height - margin.top - margin.bottom;
      var subwidth = width - margin.left - margin.right;
      x
        .domain(d3.extent(data.localTime))
        .range([0, subwidth]);
      y
        .domain([0, data.currentMax])
        .range([subheight, 0]); // TODO: don't scale to 0, scale to smallest op #
      xAxis.tickValues(x.domain());

      var container = d3.select(this);
      var g = container.selectAll('g.chart').data([0]);
      var gEnter = g.enter()
        .append('g')
        .attr('class', 'chart')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      gEnter
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0,' + subheight + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));
      d3.selectAll('.axis-x').call(xAxis);
      gEnter
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.svg.axis().scale(y).orient('left'));
      d3.selectAll('.axis-y').call(yAxis);
      var line = d3.svg.line()
        .x(function(d, i) { return x(data.localTime[i]); })
        .y(function(d) { return y(d); });
      var ops = g.selectAll('.operation').data(data.opCounters);
      ops.enter().append('g')
        .attr('class', 'operation')
        .append('path')
        .attr('class', function(d) { return 'line line-' + d.op; })
        .attr('stroke', 'steelblue')
        .attr('fill', 'none');
      container.selectAll('path.line')
        .attr('d', function(d) { return line(d.count); });
    });
  }
  // Configuration Getters & Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };
  return chart;
};
module.exports = testfunction;