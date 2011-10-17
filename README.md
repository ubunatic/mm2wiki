Copyright (c) 2011 Uwe Jugel

Licensed under the MIT license (see LICENSE file)


mm2wiki Converter - Convert Freemind Mindmaps to Mediawiki Syntax
=================================================================

mm2wiki can convert freemind mindmaps to mediawiki syntax. It is completely written in CoffeeScript http://jashkenas.github.com/coffee-script/ and can be built on Linux AND Windows using my Hot Coffee Brewer https://github.com/ubunatic/Hot-Coffee-Brewer without the coffee command line tool.

mm2wiki requires node-xml2js https://github.com/Leonidas-from-XIV/node-xml2js
node-xml2js requires sax-js https://github.com/isaacs/sax-js

Project Contents
----------------

		.hotcoffee/hcb.js:                # my personal coffee to js builder
		.hotcoffee/lib/coffee.js          # a copy of the full coffee-script module
		build.js:                         # buildfile that starts the builder

		src/mm2wiki.co                    # mm2wiki source
		src/test.co                       # a short test case

		lib/*.js                          # compiled js + dependencies
		lib/xml2js.js                     # dep: creates nice js objs from xml
		lib/sax.js                        # dep: xml parser

		test.mm                           # freemind mindmap using many features
		test.wiki                         # expected converter output

		res/mindmap-testthumb.png         # image linked from the mindmap

mm2wiki Usage
-------------

1.	Test if the sample files compile and the test runs through:

		node build.js

2.  TODO: add usage section when command line tool version is ready. Currently only the test case is supported.

mm2wiki Installation
-----------------------

    git clone https://github.com/ubunatic/mm2wiki.git mm2wiki
    cd mm2wiki
    node build.js

If everythings runs fine, you can remove the files from `./src` and start to use `mm2wiki.js` directly.

*Windows*: Make sure to add the `node.exe` to your system `PATH`.

mm2wiki Issues
-----------------
* Issue 1: There are too many linebreaks generated from richcontent nodes
* Issue 2: Some Unicode icons are not visible on some wikis/systems/fonts



