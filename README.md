Copyright (c) 2011 Uwe Jugel

Licensed under the MIT license (see LICENSE file)


Hot Coffee Brewer
=================

Hot Coffee Brewer can compile your CoffeeScript files using node.js. It uses only
node.js and coffee.js has no other dependencies. This is achieved by doing all
compiling with CoffeeScript.compile provided by coffee.js

Hot Coffee Brewer runs on Linux AND Windows!
Fork me on GitHub: https://github.com/ubunatic/Hot-Coffee-Brewer


Project Contents
----------------

Hot Coffee Brewer comprises the following parts:

		.hotcoffee/hcb.js:                # compiles 'hotcoffee.co'
		.hotcoffee/src/hotcoffee.co       # compiles all build scripts
		.hotcoffee/src/tastecoffe.co:     # runs self tests
		.hotcoffee/src/**                 # more hcb component files
		.hotcoffee/lib/coffee.js          # a copy of the full coffee-script module

		build.js:                         # sample buildfile calls hotcoffee.js
		src/world.co                      # sample CoffeeScript class 'World'
		src/test.co                       # sample CoffeeScript file to test 'World'


Hot Coffee Usage
----------------

1.	Test if the sample files compile and the test runs through:

		node build.js

2.	Create your own build.js, create ./src and ./lib, copy hotcoffee, and run:

		mkdir ~/yourproject/src
		mkdir ~/yourproject/lib
		cp .hotcoffee ~/yourproject
		cd ~/yourproject
		node build.js

This will compile all .co files in your ./src dir to .js files in ./lib
and run all test files as specified in your build.js.

Hot Coffee Installation
-----------------------

    git clone https://github.com/ubunatic/Hot-Coffee-Brewer.git new-project
    cd new-project
    node build.js
    
If everythings runs fine, you can remove the files from `./src` and create your own `*.co` files.
You might also want to remove the `./.git` dir to allow your own git versioning (If I have time, I will make the `./.hotcoffee` a submodule rather than a template project).

*Windows*: Make sure to add the `node.exe` to your system `PATH`.

Hot Coffee Issues
-----------------
Many things are hard coded. You may want to change some of the files.

* Issue 1: compiles only .co files (no .coffee files yet)
* Issue 2: filters error output and reformats is to better serve Gedit (Linux)
* Issue 3: no error grepping for other editors/IDEs



