(function() {
  var assert, src2lib;
  assert = require("./test").Test.assert;
  console.log("Testing convert.co");
  assert("src2lib", src2lib = require("../convert").src2lib);
  assert("src2lib_nofile_0", "./lib" === src2lib("./src/file.co"));
  assert("src2lib_keepfile_0", "./lib/file.js" === src2lib("./src/file.co", true));
  assert("src2lib_nofile_1", "./lib/sub1/test-dir/subsub" === src2lib("./src/sub1/test-dir/subsub/file.co"));
  assert("src2lib_keepfile_1", "./lib/sub1/test-dir/subsub/file.js" === src2lib("./src/sub1/test-dir/subsub/file.co", true));
}).call(this);
