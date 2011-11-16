(function() {
  /*
  Copyright (c) 2011 Uwe Jugel
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  	Hot Coffee Brewer
  	=================
  	
  	This file is compile.co a part of the Hot Coffee Brewer
  	
  	- is compiled via hotcoffee.js
  	- is used to compile *.co files in src to *.js files in lib
  	- runs in node.js in Linux and Windows (no dependencies)
  	
  	https://github.com/ubunatic/Hot-Coffee-Brewer
  
  */
  var build, buildAll, test;
  var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  build = function() {
    var CHK, REX, baditem, coffee, cofiles, compileFile, config, cotest, excludemap, file, filemap, filemap_all, files, findCoffeeFiles, findSrcDir, fs, item, mkdir, padString, path2edit, runTest, setEditor, src2lib, task, taskfiles, updir_count, _i, _len, _ref, _ref2, _results;
    task = arguments[0], taskfiles = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    coffee = require("./coffee").CoffeeScript;
    REX = require("./comatch").CoRegexFn;
    CHK = require("./cocheck").CoCheck;
    _ref = require("./convert"), src2lib = _ref.src2lib, padString = _ref.padString;
    _ref2 = require("./errorformat"), path2edit = _ref2.path2edit, setEditor = _ref2.setEditor;
    cotest = require("./cotest");
    config = {
      editor: "Vim",
      logWrites: false,
      formatErrors: false
    };
    setEditor(config.editor);
    fs = require("fs");
    findCoffeeFiles = function(dirname, files) {
      var dir, file, _i, _len, _results;
      dir = fs.readdirSync(dirname);
      _results = [];
      for (_i = 0, _len = dir.length; _i < _len; _i++) {
        file = dir[_i];
        _results.push((function() {
          var statFile, stats;
          statFile = file;
          stats = fs.statSync(dirname + "/" + statFile);
          if (stats.isDirectory()) {
            return findCoffeeFiles(dirname + "/" + statFile, files);
          } else if (stats.isFile() && statFile.match(/\.co$/)) {
            return files.push(dirname + "/" + statFile);
          }
        })());
      }
      return _results;
    };
    updir_count = 0;
    findSrcDir = function(dirname) {
      var dir;
      try {
        dir = fs.readdirSync(dirname + "/src");
        return dirname;
      } catch (error) {
        if (updir_count > 100) {
          console.log("'src' dir not found");
          return process.exit();
        } else {
          updir_count++;
          return findSrcDir(dirname + "/..");
        }
      }
    };
    mkdir = function(path) {
      var mkdir_p;
      mkdir_p = function(parts, idx) {
        var dirExists, subpath;
        if (parts.length > idx) {
          try {
            subpath = parts.slice(0, (idx + 1) || 9e9).join("/");
            dirExists = false;
            try {
              dirExists = fs.statSync(subpath).isDirectory();
            } catch (_e) {}
            if (!dirExists) {
              fs.mkdirSync(subpath, 0777);
            }
            return mkdir_p(parts, idx + 1);
          } catch (error) {
            return console.log(error.message);
          }
        }
      };
      return mkdir_p(path.split("/"), 0);
    };
    compileFile = function(file) {
      var cofile, jsfile, pad;
      pad = padString(file.trgFile, 30);
      try {
        cofile = fs.readFileSync(file.srcFile, "UTF8");
        jsfile = coffee.compile(cofile, {
          filename: file.srcFile
        });
        mkdir(file.trgDir);
        fs.writeFileSync(file.trgFile, jsfile);
        file.error = false;
        if (config.logWrites) {
          return console.log("" + (path2edit(file.trgFile)) + ":" + pad + " written.");
        }
      } catch (error) {
        file.error = true;
        return console.error(error.stack);
      }
    };
    runTest = function(file) {
      var allowRecompile, cocode, coext, cofile, isFile, jsfile, tmpCompile;
      cofile = file;
      allowRecompile = false;
      if (REX.match_srcpath(file)) {
        if (coext = REX.match_coext(file)) {
          jsfile = src2lib(file, true);
          allowRecompile = true;
        } else {
          jsfile = src2lib(file, true) + ".js";
        }
      } else if (REX.match_libpath(file)) {
        if (REX.match_jsext(file)) {
          jsfile = file;
        } else {
          jsfile = file + ".js";
        }
      } else {
        console.log("Error: In ./build.js, referenced file " + file + " is not an js/co file, unknown line 1");
        return 0;
      }
      tmpCompile = "";
      cocode = "";
      isFile = false;
      if (allowRecompile) {
        try {
          cocode = fs.readFileSync(cofile, "UTF8");
        } catch (error) {
          console.log("Error: In " + cofile + ", " + error.message);
          return 0;
        }
        tmpCompile = coffee.compile(cocode, {
          filename: cofile
        });
      }
      try {
        isFile = fs.statSync(jsfile).isFile();
      } catch (error) {

      }
      if (!isFile) {
        return console.error("Error: compile.runTest: " + jsfile + " not found. Test stopped.");
      } else {
        if (REX.match_relative(jsfile)) {
          return cotest.test(process.cwd() + "/" + jsfile.replace(REX.match_relative, ""));
        } else {
          return cotest.test(jsfile);
        }
      }
    };
    cofiles = [];
    findCoffeeFiles(findSrcDir("."), cofiles);
    files = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cofiles.length; _i < _len; _i++) {
        file = cofiles[_i];
        if (!CHK.isBuildFile(file)) {
          _results.push(file);
        }
      }
      return _results;
    })();
    filemap_all = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push({
          srcFile: file,
          trgDir: src2lib(file),
          trgFile: src2lib(file, true)
        });
      }
      return _results;
    })();
    excludemap = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = filemap_all.length; _i < _len; _i++) {
        baditem = filemap_all[_i];
        if (baditem.trgFile === baditem.srcFile) {
          _results.push(baditem);
        }
      }
      return _results;
    })();
    if (excludemap.length > 0) {
      filemap = (function() {
        var _i, _len, _ref3, _results;
        _results = [];
        for (_i = 0, _len = filemap_all.length; _i < _len; _i++) {
          item = filemap_all[_i];
          if (_ref3 = !item, __indexOf.call(excludemap, _ref3) >= 0) {
            _results.push(item);
          }
        }
        return _results;
      })();
      console.log("Removed " + (filemap.length - excludemap.length) + " items from file list to prevent overwrites.");
    } else {
      filemap = filemap_all;
    }
    switch (task) {
      case "all":
        _results = [];
        for (_i = 0, _len = filemap.length; _i < _len; _i++) {
          file = filemap[_i];
          _results.push(compileFile(file));
        }
        return _results;
        break;
      case "test":
        return runTest(taskfiles[0]);
    }
  };
  test = function(cofile) {
    return build("test", cofile);
  };
  buildAll = function() {
    return build("all");
  };
  module.exports.buildAll = buildAll;
  module.exports.test = test;
}).call(this);
