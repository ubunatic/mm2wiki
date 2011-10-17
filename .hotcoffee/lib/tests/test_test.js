(function() {
  var assert;
  assert = require("./test").Test.assert;
  console.log("Testing test.co");
  if (assert) {
    console.log("Test module loaded");
  } else {
    console.log("Error: loading test unit.");
  }
}).call(this);
