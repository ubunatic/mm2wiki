
hcb = require("./.hotcoffee/hcb.js");  // load Hot Coffee Brewer (autobuilds itself if hcb not found)
hcb.buildAll();                        // build all coffee files, looks for *.coffee and *.co files
                                       // in ./src, compiles them and writes *.js files to ./lib

hcb.test("./src/test")                 // run project tests

