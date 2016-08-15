const d3 = require('d3');


const testfunction = function() {
  "use strict";
  console.log("Setting up testfunction");
  var width              = 400;
  var height             = 300;
  var x                  = d3.time.scale();
  var y                  = d3.scale.linear();
  var z                  = d3.scale.category10();
  var yAxis              = d3.svg.axis().scale(y).orient("left");
  var xAxis              = d3.svg.axis().scale(x).orient("bottom");

  function chart(selection) {
    selection.each(function(data) {
      console.log(data);

      var margin = {top: 20, right: 20, bottom: 60, left: 60};
      var subheight = height - margin.top - margin.bottom;
      var subwidth = width - margin.left - margin.right;

      x
        .domain(d3.extent(data.localTime))
        .range([0, subwidth]);
      y
        .domain([0, data.currentMax])
        .range([subheight, 0]); // TODO: don't scale to 0, scale to smallest op #
      z.domain([0, 5]); // TODO: ???

      var container = d3.select(this);

      var g = container.selectAll('g.axes').data([0]);
      var gEnter = g.enter()
        .append("g")
        .attr("class", "axes")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      gEnter
        .append("g")
        .attr("class", "axis-x")
        .attr("transform", "translate(0," + subheight + ")")
        .call(d3.svg.axis().scale(x).orient('bottom'));
      d3.selectAll('.axis-x').call(xAxis);

      gEnter
        .append("g")
        .attr("class", "axis-y")
        .call(d3.svg.axis().scale(y).orient('left'));
      d3.selectAll('.axis-y').call(yAxis);

      var line = d3.svg.line()
        // .curve(d3.svg.curveBasis)
        .x(function(d) { return x(d); })
        .y(function(d, i) { return y(data.localTime[i]); });

      var ops = container.selectAll("g.ops").data(data.opCounters);
      var opsEnter = ops.enter()
        .append("g")
        .attr("class", "ops");

      opsEnter
        .append("path")
        .attr("class", (d) => { return "line-" + d.key; })
        .attr("d", function(d) { return line(d.value); })
        // .style("stroke", function(d) { return z(d.id); });
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