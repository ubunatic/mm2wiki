(function() {
  var assert;
  assert = function(name, expr) {
    if (expr) {
      return true;
    } else {
      console.log("Error: test " + name + " failed with " + expr);
      return false;
    }
  };
  module.exports.Test = {
    assert: assert
  };
}).call(this);
