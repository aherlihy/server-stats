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
    .tickFormat(d3.time.format('%X'));
  var color = d3.scale.category10();
  var keys = ['insert', 'update', 'getmore', 'delete', 'command', 'query'];

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

      // Axes
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

      // Lines
      var line = d3.svg.line()
        .x(function(d, i) { return x(data.localTime[i]); })
        .y(function(d) { return y(d); });
      var ops = g.selectAll('.operation').data(data.operations);
      ops.enter().append('g')
        .attr('class', 'operation')
        .append('path')
        .attr('class', function(d) { return 'line line-' + d.op; })
        .attr("id", function(d) { return 'tag'+d.op; } )
        .style("opacity", 1)
        .attr('stroke', function(d, i) { return color(i); })
        .attr('fill', 'none');
      container.selectAll('path.line')
        .attr('d', function(d) { return line(d.count); });

      // Legend
      var legendWidth = subwidth / data.operations.length;
      var l = container.selectAll('g.legend').data([0]);
      var lEnter = l.enter()
        .append('g')
        .attr('class', 'legend')
        .attr('width', subwidth)
        .attr('height', margin.bottom)
        .attr('transform', 'translate(' + margin.left + ',' + (subheight + margin.top) + ')');
      var opDiv = lEnter.selectAll('.legend').data(keys).enter()
        .append('g')
        .attr("class", function(d) { return "legend legend-" + d; })
        .attr('transform', function(d, i) { return 'translate(' + i*legendWidth + ',5)'; } )
        .style("fill", function(d, i) { return color(i); } );
      opDiv
        .append("rect")
        .attr("class", "box")
        .attr("id", function(d) { return "box" + d; })
        .style("stroke", function(d, i) { return color(i); })
        .style("stroke-width", 1)
        .style("fill-opacity", 1)
        .attr('width', 10)
        .attr('height', 10)
        .on("click", function(d, i) {
          var currOp = data.operations[i];
          var active = currOp.active ? false : true,
            newOpacity = active ? 1 : 0;
          d3.select("#tag"+d)
            .transition().duration(100)
            .style("opacity", newOpacity);
          d3.select("#box"+d)
            .transition().duration(100)
            .style("fill-opacity", newOpacity);
          d3.select("#circle"+d)
            .transition().duration(100)
            .style("opacity", newOpacity);
          currOp.active = active;
        });
      opDiv
        .append("text")
        .attr("class", "text-name")
        .attr('transform', 'translate(' + 15 + ',8)')
        .attr("font-size",11)
        .text(function(d) { return d; });
      opDiv
        .append("text")
        .attr("class", function(d) { return "current text-" + d; })
        .attr('transform', 'translate(' + 15 + ',25)')
        .attr("font-size",15)
        .attr('fill', 'black');
      container.selectAll('text.current')
        .text(function(d) { return data.rawData[data.rawData.length - 1][d]; });

      // Overlays
      var bisectDate = d3.bisector(function(d) { return d; }).left;
      var focus = container.selectAll('g.focus').data([0]).enter()
        .append("g")
        .attr("class", "focus")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style("display", "none");
      focus.append("line")
        .attr("class", "line-mouse")
        .style("stroke", "black")
        .attr("x1", x(x.domain()[0])).attr("y1", y(y.domain()[0]))
        .attr("x2", x(x.domain()[0])).attr("y2", y(y.domain()[1]));
      focus.append("path")
        .attr("class", "triangle-mouse")
        .attr("d", d3.svg.symbol().type("triangle-down"));
      focus.append("text")
        .attr("class", "text-mouse")
        .attr("font-size",11)
        .style("text-anchor", "middle")
        .text("TEST");


      focus.selectAll('.focus').data(keys).enter()
        .append("circle")
        .attr("id", function(d) { return "circle" + d; })
        .attr('class', function(d) { return "focus circle-" + d; })
        .attr('fill', function(d, i) { return color(i); })
        .attr("r", 4.5);

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
        focus.selectAll('text.text-mouse')
          .attr("transform", "translate(" + leftOffset + ",-10)")
          .text(d3.time.format("%X")(data.localTime[d]));
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