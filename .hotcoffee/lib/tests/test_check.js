(function() {
  var CHK, assert;
  assert = require("./test").Test.assert;
  console.log("Testing cocheck.co");
  assert("cocheck", CHK = require("../cocheck").CoCheck);
  assert("buildfile", CHK.isBuildFile("./.hotcoffee/src/tests/test.co"));
  assert("noBuildfile", !CHK.isBuildFile("./src/main.co"));
}).call(this);
