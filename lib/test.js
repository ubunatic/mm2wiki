(function() {
  var Test, assert, say, wikifile, xmlfile;
  say = function() {
    return console.log.apply(console, arguments);
  };
  wikifile = "";
  xmlfile = "";
  assert = function(expression, name, text) {
    if (!expression) {
      console.error(text);
    }
    console.log("Test passed: " + name);
  };
  Test = (function() {
    var addTest, getTest, runAll, runTest, testFn, tests;
    tests = [];
    testFn = function(name, fn) {
      if (name != null) {
        if (fn != null) {
          return addTest(name, fn);
        } else {
          return runTest(getTest(name));
        }
      } else {
        return runAll();
      }
    };
    addTest = function(name, fn) {
      return tests.push({
        name: name,
        run: function() {
          return fn();
        }
      });
    };
    runTest = function(test) {
      say("starting test '" + test.name + "'");
      return test.run();
    };
    getTest = function(name) {
      var t, _i, _len;
      say("get");
      for (_i = 0, _len = tests.length; _i < _len; _i++) {
        t = tests[_i];
        if (t.name === name) {
          return t;
        }
      }
    };
    runAll = function() {
      var t, _i, _len, _results;
      say("all");
      _results = [];
      for (_i = 0, _len = tests.length; _i < _len; _i++) {
        t = tests[_i];
        _results.push(runTest(t));
      }
      return _results;
    };
    return testFn;
  })();
  Test("convert test file", function() {
    var callback, convert, fs;
    say('---------------------------------------------------\ntest.co: "Add your tests to src/test.co!"\n---------------------------------------------------\nStarting test...');
    convert = require("./mm2wiki").convert;
    fs = require("fs");
    xmlfile = fs.readFileSync("./test.mm", "UTF-8");
    wikifile = fs.readFileSync("./test.wiki", "UTF-8");
    assert(xmlfile.length > 0, "file test", "FileError: xmlfile has zero length");
    assert(wikifile.length > 0, "file test", "FileError: wikifile has zero length");
    callback = function(err, result) {
      assert(result === wikifile, "simple conversion", "ConverterError: unsupported input: " + result);
      if (err) {
        return console.error(result, "\n!=\n", wikifile);
      } else {
        return console.log(result);
      }
    };
    return convert(xmlfile, callback);
  });
  Test("convert via command line", function() {
    var cli;
    say("starting command line test via mm2wiki.cli");
    cli = require("./mm2wiki").cli;
    cli("./test.mm", "UTF-8", function(err, result) {
      if (err) {
        return console.error(err);
      } else {
        return console.log(result);
      }
    });
  });
  Test();
}).call(this);
