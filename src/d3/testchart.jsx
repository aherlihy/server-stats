const d3 = require('d3');
const debug = require('debug')('server-stats:testchart');
const  _ = require('lodash');

const testfunction = function() {
  'use strict';
  debug('Setting up testfunction');
  var width = 600;
  var height = 300;
  var x = d3.time.scale();
  var y = d3.scale.linear();
  var yAxis = d3.svg.axis().scale(y).orient('left');
  var xAxis = d3.svg.axis()
    .scale(x).orient('bottom')
    .tickFormat(d3.time.format('%X'));
  var color = d3.scale.category10();
  var keys = ['insert', 'update', 'getmore', 'delete', 'command', 'query'];
  var onOverlay = false;
  var mouseLocation = null;

  function chart(selection) {
    selection.each(function(data) {
      var margin = {top: 30, right: 30, bottom: 50, left: 40};
      var subheight = height - margin.top - margin.bottom;
      var subwidth = width - margin.left - margin.right;
      var minTime = data.localTime[data.localTime.length - 1];
      var subMargin = {left: 20, top: 10};
      minTime = new Date(minTime.getTime() - 100000);
      var xDomain = d3.extent([minTime].concat(data.localTime));

      x
        .domain(xDomain)
        .range([0, subwidth]);
      y
        .domain(data.yDomain)
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
        .attr('transform', 'translate(0,' + subheight + ')')
        .call(d3.svg.axis().scale(x).orient('bottom'));
      d3.selectAll('.axis-x').call(xAxis);
      gEnter
        .append('g')
        .attr('class', 'axis-y')
        .call(d3.svg.axis().scale(y).orient('left'));
      d3.selectAll('.axis-y').call(yAxis);

      // Axis labels
      [
        {"name" : "y-label text-ops", "x": 5, "y": 15, "default": "OPS/S", "anchor": "end"},
        {"name" : "y-label text-count", "x": 5, "y": 5, "default": "", "anchor": "end"},
        {"name" : "x-label min", "x": (x.range()[0] + subMargin.left), "y": (-subMargin.top-5), "default": "", "anchor":"middle"},
        {"name" : "x-label max", "x": x.range()[1], "y": (-subMargin.top-5), "default": "", "anchor":"middle"}
      ].map(function(c) {
        gEnter
          .append("text")
          .attr("class", c["name"])
          .attr("font-size",11)
          .style("text-anchor", c["anchor"])
          .attr('transform', 'translate(' + c["x"] + ',' + c["y"]+ ')')
          .text(c["default"]);
      });
      container.selectAll('text.text-count')
        .text(d3.format("s")(data.yDomain[1]));
      container.selectAll('text.max')
        .text(d3.time.format("%X")(xDomain[1]));
      container.selectAll('text.min')
        .text(d3.time.format("%X")(xDomain[0]));

      // Border Lines
      gEnter
        .append('g')
        .attr('class', 'background-lines');
      [
        { 'x1': x.range()[0]+subMargin.left, "y1": y.range()[0],
          "x2": x.range()[0]+subMargin.left, "y2": y.range()[1]-subMargin.top,
        "class": "left"},
        { 'x1': x.range()[1], "y1": y.range()[0],
          "x2": x.range()[1], "y2": y.range()[1]-subMargin.top,
        "class": "right"},
        { 'x1': x.range()[0]+subMargin.left, "y1": y.range()[0],
          "x2": x.range()[1], "y2": y.range()[0],
        "class": "bottom"},
        { 'x1': x.range()[0]+subMargin.top, "y1": y.range()[1],
          "x2": x.range()[1], "y2": y.range()[1],
        "class": "top"},
        { "x1": x.range()[0]+subMargin.left, "y1": (y.range()[0] / 2),
          "x2": x.range()[1], "y2": (y.range()[0] / 2),
          "class": "middle"}
      ].map(function(c) {
        gEnter
          .append("line")
          .attr("class", "line-" + c['class'])
          .style('stroke', 'black')
          .attr('x1', c['x1']).attr('y1', c['y1'])
          .attr('x2', c['x2']).attr('y2', c['y2']);
      });
  
      // Chart Lines
      var line = d3.svg.line()
        .interpolate("monotone")
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
      var legendWidth = (subwidth - subMargin.top) / data.operations.length;
      var l = container.selectAll('g.legend').data([0]);
      var lEnter = l.enter()
        .append('g')
        .attr('class', 'legend')
        .attr('width', subwidth)
        .attr('height', margin.bottom)
        .attr('transform', 'translate(' + (margin.left + subMargin.left) + ',' + (subheight + margin.top + subMargin.top) + ')');
      var opDiv = lEnter.selectAll('.legend').data(keys).enter()
        .append('g')
        .attr("class", function(d) { return "legend legend-" + d; })
        .attr('transform', function(d, i) { return 'translate(' + i*legendWidth + ',5)'; } );
      opDiv
        .append("rect")
        .attr("class", "box")
        .attr("id", function(d) { return "box" + d; })
        .style("stroke", function(d, i) { return color(i); })
        .style("fill", function(d, i) { return color(i); } )
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
        .attr('transform', 'translate(' + 13 + ',9)')
        .attr("font-size",11)
        .text(function(d) {
          if (d == 'query') {
            d = 'querie';
          }
          return (d+'s').toUpperCase();
        });
      opDiv
        .append("text")
        .attr("class", function(d) { return "current text-" + d; })
        .attr('transform', 'translate(' + 15 + ',25)')
        .attr("font-size", 15)
        .attr('fill', 'black');

      if (onOverlay) {
        updateOverlay();
      } else {
        container.selectAll('text.current')
          .text(function (d) {
            return data.rawData[data.rawData.length - 1][d];
          });
      }

      // Overlays
      var focus = container.selectAll('g.focus').data([0]).enter()
        .append("g")
        .attr("class", "focus")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .style("display", "none");
      focus.append("line")
        .attr("class", "line-mouse")
        .style("stroke", "black")
        .attr("transform", "translate(" + subMargin.left + ",0)")
        .attr('x1', x.range()[0]).attr("y1", y.range()[0])
        .attr("x2", x.range()[0]).attr("y2", y.range()[1]);
      focus.append("path")
        .attr("class", "triangle-mouse")
        .attr("transform", "translate(" + subMargin.left + ",0)")
        .attr("d", d3.svg.symbol().type("triangle-down"));
      focus.append("text")
        .attr("class", "text-mouse")
        .attr("transform", "translate(" + subMargin.left + ",0)")
        .attr("font-size",11)
        .style("text-anchor", "middle");


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
        .on("mouseover", function() { 
          onOverlay = true;
          focus.style("display", null);
        })
        .on("mouseout", function() {
          onOverlay = false;
          focus.style("display", "none");
        })
        .on("mousemove", mousemove);

      function updateOverlay() {
        var bisectDate = d3.bisector(function(d) { return d; }).left;
        var index = bisectDate(data.localTime, x.invert(mouseLocation), 1);
        if (index >= data.localTime.length) {
          return;
        }
        var leftOffset = x(data.localTime[index]);
        var focus = container.selectAll('g.focus');
        focus.selectAll('line.line-mouse')
          .attr("transform", "translate(" + leftOffset + ",0)");
        focus.selectAll('path.triangle-mouse')
          .attr("transform", "translate(" + leftOffset + ",-5)");
        focus.selectAll('text.text-mouse')
          .attr("transform", "translate(" + leftOffset + ",-15)")
          .text(d3.time.format("%X")(data.localTime[index]));
        for (var k = 0; k < data.operations.length; k++) {
          var key = data.operations[k];
          var rightOffset = y(key.count[index]);
          focus.selectAll('circle.circle-' + key.op)
            .attr("transform", "translate(" + leftOffset + "," + rightOffset + ")");
          var currentText = container.selectAll('text.current.text-' + key.op);
          currentText.text(data.rawData[index][key.op]);
        }
      }

      function mousemove() {
        mouseLocation = d3.mouse(this)[0];
        updateOverlay();
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