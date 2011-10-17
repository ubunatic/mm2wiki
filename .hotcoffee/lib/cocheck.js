(function() {
  var CoCheck, buildmatch, testmatch;
  buildmatch = /^\.\/\.hotcoffee\/src\/.*/;
  testmatch = /^\.\/\.hotcoffee\/src\/tests\/.*/;
  CoCheck = {
    isBuildFile: function(file) {
      return buildmatch.test(file) || testmatch.test(file);
    }
  };
  ({
    buildmatch: buildmatch,
    testmatch: testmatch
  });
  module.exports.CoCheck = CoCheck;
}).call(this);
