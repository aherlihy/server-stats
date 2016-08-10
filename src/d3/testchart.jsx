const testfunction = function() {
  "use strict";
  console.log("Setting up testfunction");
  var width              = 400;
  var height             = 300;
  function chart(selection) {
    console.log("running chart!");
  };
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