(function() {
  var assert, buildAll;
  assert = require("./test").Test.assert;
  console.log("Testing compile.co");
  assert("compile", buildAll = require("../compile").buildAll);
}).call(this);
