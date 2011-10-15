(function() {
  var assert, say, test1, test2, wikifile, xmlfile;
  var __slice = Array.prototype.slice;
  say = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };
  wikifile = "";
  xmlfile = "";
  assert = function(expression, name, text) {
    if (!expression) {
      console.error(text);
    }
    console.log("Test passed: " + name);
  };
  test1 = function() {
    var convert, fs;
    say('---------------------------------------------------\ntest.co: "Add your tests to src/test.co!"\n---------------------------------------------------');
    say("Starting tests...\n");
    convert = require("./mm2wiki").convert;
    fs = require("fs");
    xmlfile = fs.readFileSync("./test.mm", "UTF-8");
    wikifile = fs.readFileSync("./test.wiki", "UTF-8");
    return convert(xmlfile, test2);
  };
  test2 = function(err, result) {
    assert(result.length > 0 && wikifile.length > 0, "file test", "FileError: file has zero length");
    assert(result === wikifile, "simple conversion", "ConverterError: unsupported input: " + result);
    console.error(result);
    console.error(wikifile);
  };
  test1();
}).call(this);
