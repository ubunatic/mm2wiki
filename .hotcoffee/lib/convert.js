(function() {
  var REX, padString, src2lib;
  REX = require("./comatch").CoRegex;
  src2lib = function(file, keepFileName) {
    var prefix;
    if (keepFileName == null) {
      keepFileName = false;
    }
    prefix = file.match(REX.match_srcpath);
    if (!prefix) {
      prefix = "";
    } else {
      prefix = prefix[0];
    }
    file = prefix.replace("src", "lib") + file.replace(REX.match_srcpath, "");
    if (keepFileName) {
      file = file.replace(REX.match_coext, ".js");
    } else {
      file = file.replace(REX.match_cofile, "");
    }
    return file;
  };
  padString = function(string, maxLength, padChar) {
    var char;
    if (padChar == null) {
      padChar = " ";
    }
    return ((function() {
      var _ref, _results;
      _results = [];
      for (char = 1, _ref = Math.max(maxLength - string.length, 0); 1 <= _ref ? char <= _ref : char >= _ref; 1 <= _ref ? char++ : char--) {
        _results.push(padChar);
      }
      return _results;
    })()).join("");
  };
  module.exports = {
    src2lib: src2lib,
    padString: padString
  };
}).call(this);
