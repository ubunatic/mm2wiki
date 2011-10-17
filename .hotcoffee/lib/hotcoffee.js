(function() {
  /*
  
  Copyright (c) 2011 Uwe Jugel
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  
  
  	Hot Coffee Brewer
  	=================
  	
  	this file is hotcoffee.js a part of the Hot Coffee Brewer
  	
  	- starts the "Hot Coffee Brewer"
  	- is a bootstrapper CoffeeScript.compile
  	- compiles and runs the actual Hot Coffee Brewer script (compile.co)
  	- runs in node.js and has no other dependencies
  	- does not require npm or coffee commandline tools, and therefore
  	- runs on Linux AND Windows
  	
  	Usage: call buildAll() or test(<file>) in your build script
  
  	https://github.com/ubunatic/Hot-Coffee-Brewer
  
  
  	Attention: 'require' works differently than 'readFileSync' etc.
  	           take care for correct path names if you modify anything
  */
  var buildSelf, coffee, compile, cwd, fs, hcbDir, testSelf;
  coffee = require("./coffee").CoffeeScript;
  fs = require("fs");
  cwd = process.cwd();
  hcbDir = ".hotcoffee";
  compile = null;
  buildSelf = function() {
    var allfiles, buildDirFound, cofile, cofiles, cotests, file, filemap, hcbDirFound, jsfile, testFilemap, _i, _len;
    console.log("Rebuilding HotCoffeeBrewer");
    buildDirFound = false;
    try {
      hcbDirFound = fs.statSync("" + cwd + "/" + hcbDir).isDirectory();
    } catch (error) {
      console.log("ERROR: In hotcoffee.js: '.hotcoffee' dir not found! Start Hot Coffee Brewer\nfrom your project's root dir, which should look like this:\n  ./build.js                  # starts the build (usage: 'node build.js')\n  ./" + hcbDir + "                      # hidden dir for the build tools\n  ./" + hcbDir + "/lib/hotcoffee.js     # Hot Coffee bootstrapper\n  ./" + hcbDir + "/lib/coffee.js        # CoffeeScript module\n  ./" + hcbDir + "/src/compile.co       # Hot Coffee build functions\n  ./" + hcbDir + "/src/cotest.co        # Hot Coffee test functions\n  ./src                       # source dir for your .co sources\n  ./lib                       # target dir for compiled .js files");
    }
    if (hcbDirFound) {
      cofiles = ["compile", "cotest", "comatch", "cocheck", "convert", "errorformat", "tastecoffee"];
      cotests = ["test_match", "test_check", "test_test", "test_compile", "test_convert", "test"];
      filemap = cofiles.map(function(file) {
        return {
          src: "" + cwd + "/" + hcbDir + "/src/" + file + ".co",
          trg: "" + cwd + "/" + hcbDir + "/lib/" + file + ".js"
        };
      });
      testFilemap = cotests.map(function(file) {
        return {
          src: "" + cwd + "/" + hcbDir + "/src/tests/" + file + ".co",
          trg: "" + cwd + "/" + hcbDir + "/lib/tests/" + file + ".js"
        };
      });
      try {
        fs.mkdirSync("" + cwd + "/" + hcbDir + "/lib/tests", 0777);
      } catch (_e) {}
      allfiles = filemap.concat(testFilemap);
      for (_i = 0, _len = allfiles.length; _i < _len; _i++) {
        file = allfiles[_i];
        cofile = fs.readFileSync(file.src, "UTF8");
        jsfile = coffee.compile(cofile, {
          filename: file.trg
        });
        fs.writeFileSync(file.trg, jsfile);
      }
    }
    return compile = require("./compile");
  };
  testSelf = function() {
    var tastecoffee;
    return tastecoffee = require("./tastecoffee");
  };
  try {
    compile = require("./compile");
  } catch (error) {
    console.log("Error: could not load HotCoffeeBrewer compile module.");
    console.log("I will try to compile it no.");
    buildSelf();
    console.log("HotCoffeeBrewer was rebuilt and loaded.");
  }
  module.exports.HotCoffeeBrewer = {
    testSelf: function() {
      return testSelf();
    },
    buildSelf: function() {
      buildSelf();
      return testSelf();
    },
    buildAll: function() {
      return compile.buildAll();
    },
    test: function(file) {
      return compile.test(file);
    }
  };
}).call(this);
