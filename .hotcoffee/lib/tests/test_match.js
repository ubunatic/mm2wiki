(function() {
  var REX, assert;
  assert = require("./test").Test.assert;
  console.log("Testing comatch.co");
  assert("comatch", REX = require("../comatch").CoRegex);
  assert("srcpath", REX.match_srcpath.test("./src/"));
  assert("cofile", REX.match_cofile.test("./bla/supertest-file.co"));
  assert("coext", REX.match_coext.test("./bla/supertest-file.co"));
  assert("srcpath", !REX.match_srcpath.test("./lib/"));
  assert("cofile", !REX.match_cofile.test("./bla/supertest-file.js"));
  assert("coext", !REX.match_coext.test("./bla/supertest-file.js"));
}).call(this);
