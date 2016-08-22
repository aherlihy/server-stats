const d3 = require('d3');
const debug = require('debug')('server-stats:testchart');
const  _ = require('lodash');

const testfunction = function() {
  'use strict';
  debug('Setting up testfunction');
  var width = 450;
  var height = 300;
  var x = d3.time.scale();
  var y = d3.scale.linear();
  var yAxis = d3.svg.axis().scale(y).orient('left');
  var xAxis = d3.svg.axis()
    .scale(x).orient('bottom')
    .tickFormat(d3.time.format('%a %d %I:%M:%S'));

  function chart(selection) {
    selection.each(function(data) {
      // console.log(data);
      var margin = {top: 20, right: 20, bottom: 60, left: 60};
      var subheight = height - margin.top - margin.bottom;
      var subwidth = width - margin.left - margin.right;
      var minTime = data.localTime[data.localTime.length - 1];
      minTime = new Date(minTime.getTime() - 100000);
      x
        .domain(d3.extent([minTime].concat(data.localTime)))
        .range([0, subwidth]);
      y
        .domain(data.yDomain) // keep graph to at least +-10
        .range([subheight, 0]);
      xAxis.tickValues(x.domain());
      yAxis.tickValues(y.domain());

      var container = d3.select(this);
      var g = container.selectAll('g.chart').data([0]);
      var gEnter = g.enter()
        .append('g')
        .attr('class', 'chart')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      gEnter
        .append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0,' + subheight/2 + ')')
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
      var ops = g.selectAll('.operation').data(data.operations);
      ops.enter().append('g')
        .attr('class', 'operation')
        .append('path')
        .attr('class', function(d) { return 'line line-' + d.op; })
        .attr('stroke', 'steelblue')
        .attr('fill', 'none');
      container.selectAll('path.line')
        .attr('d', function(d) { return line(d.count); });

      // Overlays
      var bisectDate = d3.bisector(function(d) { return d; }).left;
      var focus = container.selectAll('g.focus').data([0]).enter()
        .append("g")
        .attr("class", "focus")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style("display", "none");

      focus.append("text")
        .attr("class", "text-mouse")
        .attr("dy", ".35em")
        .attr("x", 9);

      for (var k=0; k < data.operations.length; k++) {
        var key = data.operations[k];
        focus
          .append("circle")
          .attr('class', "circle-" + key.op)
          .attr("r", 4.5);
      }
      focus.append("line")
        .attr("class", "line-mouse")
        .style("stroke", "black")
        .attr("x1", x(x.domain()[0])).attr("y1", y(y.domain()[0]))
        .attr("x2", x(x.domain()[0])).attr("y2", y(y.domain()[1]));
      focus.append("path")
        .attr("class", "triangle-mouse")
        .attr("d", d3.svg.symbol().type("triangle-down"));

      var overlay = container.selectAll('rect.overlay').data([0]).enter()
        .append("rect")
        .attr("class", "overlay")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("width", subwidth)
        .attr("height", subheight)
        .attr("opacity", 0)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]), // get actual x value from mouse location
          i = bisectDate(data.localTime, x0, 1), // get index of actual x value in data
          // d0 = data.localTime[i - 1],
          // d1 = data.localTime[i],
          // d = x0 - d0 > d1 - x0 ? i-1 : i;
          d = i;

        if (d >= data.localTime.length) {
          return;
        }

        var leftOffset = x(data.localTime[d]);
        focus.selectAll('line.line-mouse')
          .attr("transform", "translate(" + leftOffset + ",0)");
        focus.selectAll('path.triangle-mouse')
          .attr("transform", "translate(" + leftOffset + ",0)");
        // focus.selectAll('text.text-mouse')
        //   .attr("text", "HERE")//data.localTime[d])
        //   .style("font-size","100px")
        //   .attr("transform", "translate(" + leftOffset + "," + y(data.currentMax-5) + ")");
        for (var k=0; k < data.operations.length; k++) {
          var key = data.operations[k];
          var rightOffset = y(key.count[d]);
          focus.selectAll('circle.circle-' + key.op)
                .attr("transform", "translate(" + leftOffset + "," + rightOffset + ")");
        }
      }
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