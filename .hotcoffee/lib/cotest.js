(function() {
  /*
  Copyright (c) 2011 Uwe Jugel
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  	Hot Coffee Brewer
  	=================
  	
  	This file is cotest.co a part of the Hot Coffee Brewer
  	
  	- is compiled via hotcoffee.js
  	- is used to test compiled javascript files
  	- runs in node.js in Linux and Windows (no dependencies)
  	
  	https://github.com/ubunatic/Hot-Coffee-Brewer
  
  */
  var extractErrorDetails, lib2src, test;
  lib2src = function(line, js2co) {
    var num, tmpline, tmplineError, tmplineLocation;
    if (js2co == null) {
      js2co = true;
    }
    try {
      if (js2co) {
        tmpline = line.replace("/lib/", "/src/").replace(/\.js:/, ".co:");
      } else {
        tmpline = line;
      }
      tmpline = tmpline.replace(/^\s* at\s*/, "").split(":").slice(0, 2).join(":") + ":";
      tmplineLocation = tmpline.match(/\/.*\:\d*\:/)[0];
      tmplineError = tmpline.replace(tmplineLocation, "");
      if (js2co) {
        num = tmplineLocation.match(/\.co:\d*\:/)[0].replace(".co:", "").replace(":", "");
        tmplineLocation = tmplineLocation.replace(/\.co:\d*\:/, ".co:" + num + ":");
      }
      return tmplineLocation + " " + tmplineError;
    } catch (error) {
      return line;
    }
  };
  extractErrorDetails = function(error) {
    var err, errorDetails, errorInfo;
    errorInfo = error.stack.split("\n");
    errorInfo = ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = errorInfo.length; _i < _len; _i++) {
        err = errorInfo[_i];
        if (err.trim() !== '' && !err.match(/^node.js:/) && !err.match(/^\s*throw/) && !err.match(/^\s*\^/)) {
          _results.push(err);
        }
      }
      return _results;
    })()).slice(0, 4);
    errorDetails = (function() {
      var _i, _len, _ref, _results;
      _ref = errorInfo.slice(1, 4);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        err = _ref[_i];
        _results.push(lib2src(err) + "\n" + lib2src(err, false));
      }
      return _results;
    })();
    return "\n" + errorInfo[0] + "\n" + errorDetails.join("\n") + "\ntest failed\n";
  };
  test = function(file) {
    var jsmodule;
    try {
      return jsmodule = require(file);
    } catch (error) {
      if (error) {
        return process.stderr.write(error.stack);
      } else {
        return process.stdout.write("test was successful\n");
      }
    }
  };
  module.exports.test = function(file, log) {
    if (log == null) {
      log = true;
    }
    if (log) {
      console.log("running " + file);
    }
    return test(file);
  };
}).call(this);
