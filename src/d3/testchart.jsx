const d3 = require('d3');


const testfunction = function() {
  "use strict";
  console.log("Setting up testfunction");
  var width              = 400;
  var height             = 300;
  function chart(selection) {
    selection.each(function(data) {

      var values = d3.values(data);
      var keys = d3.keys(data);
      var margin = {top: 20, right: 20, bottom: 60, left: 60};
      var subheight = height - margin.top - margin.bottom;
      var subwidth = width - margin.left - margin.right;

      var x = d3.scale.linear()
        .domain([0, keys.length])// + 1])
        .range([0, subwidth]);

      var y = d3.scale.linear()
        .domain([0, d3.max(values)])
        .range([subheight, 0]);

      var component = d3.select(this);
      component
        .append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'pink');

      component
        .append('svg:svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'chart')
        .attr('fill', 'yellow');

      var main = component
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', subwidth)
        .attr('height', subheight)
        .attr('class', 'main');

      // draw the x axis
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .tickFormat(function(d) {
          // if(d==0) {
          //   return "";
          // } else {
            return keys[d];
          // }
        })
        ;

      main.append('g')
        .attr('transform', 'translate(0,' + subheight + ')')
        .attr('class', 'main axis date')
        .call(xAxis);

      // draw the y axis
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis date')
        .call(yAxis);

      var g = main.append("svg:g");

      g.selectAll("scatter-dots")
        .data(keys)
        .enter().append("svg:circle")
        .attr("cx", function (d, i) {
          return x(i);
        })
        .attr("cy", function (d) {
          console.log("in cy d=" + d + " values=" + values);
          return y(data[d]);
        })
        .attr("r", 8);
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