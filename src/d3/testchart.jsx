const d3 = require('d3');


const testfunction = function() {
  "use strict";
  console.log("Setting up testfunction");
  var width              = 400;
  var height             = 300;
  function chart(selection) {
    selection.each(function(data) {
      console.log("START OF CHART");
      console.log(data);

      var opCounters = data.opCounters;
      var localTime = data.localTime;

      var minOp = 0;
      var maxOp = 0;
      for (var i=0;i<opCounters.length;i++) {
        var sub = d3.values(opCounters[i]);
        sub.push(minOp);
        sub.push(maxOp);
        minOp = d3.min(sub);
        maxOp = d3.max(sub);
      } // TODO: persist state

      var margin = {top: 20, right: 20, bottom: 60, left: 60};
      var subheight = height - margin.top - margin.bottom;
      var subwidth = width - margin.left - margin.right;
  
      var component = d3.select(this);
      component
        .append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'pink');

      var g = component.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // var parseTime = d3.timeParse("%Y%m%d");

      var x = d3.time.scale().range([0, subwidth]),
        y = d3.scale.linear().range([subheight, 0]),
        // z = d3.scale.ordinal(d3.scale.category10());
        z = d3.scale.category10();

      x.domain(d3.extent(localTime));
      y.domain([minOp, maxOp]); // TODO: don't scale to 0, scale to smallest op #
      z.domain([0, 5]); // TODO: ???

      g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + subheight + ")")
        .call(d3.svg.axis().scale(x).orient('bottom'));

      g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.svg.axis().scale(y).orient('left'));

      var keys = d3.keys(opCounters[0]);
      for(var i=0;i<keys.length;i++) {
        var myLine = d3.svg.line()
          .x(function(d, i) { return x(localTime[i]); })
          .y(function(d) { return y(d[keys[i]]); }); // TODO; fix command

        g.append("svg:path")
          .attr("class", "line")
          .attr("d", myLine(opCounters))
          .attr("stroke", z(i))
          .attr('fill','none')
          .attr('stroke-width', 4);
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