(function() {
  console.log("Running all self tests.");
  require("./tests/test_test");
  require("./tests/test");
  require("./tests/test_match");
  require("./tests/test_compile");
  require("./tests/test_check");
  require("./tests/test_convert");
}).call(this);
