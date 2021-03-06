Copyright (c) 2011 Uwe Jugel

Licensed under the MIT license (see LICENSE file)


mm2wiki Converter - Convert Freemind Mindmaps to Mediawiki Syntax
=================================================================

mm2wiki can convert freemind mindmaps to mediawiki syntax.
It is completely written in CoffeeScript and can be built on
Linux AND Windows using my [Hot Coffee Brewer](https://github.com/ubunatic/Hot-Coffee-Brewer) without the
coffee command line tool.

- running mm2wiki requires:
  - [sax-js](https://github.com/isaacs/sax-js)
- building mm2wiki requires:
  - [CoffeeScript](http://jashkenas.github.com/coffee-script)
  - [Hot Coffee Brewer](https://github.com/ubunatic/Hot-Coffee-Brewer)

Project Contents
----------------

		.hotcoffee/hcb.js:                # my personal coffee to js builder
		.hotcoffee/lib/coffee.js          # a copy of the full coffee-script module
		build.js:                         # buildfile that starts the builder

		src/mm2wiki.co                    # mm2wiki source
		src/test.co                       # a short test case

		lib/*.js                          # compiled js + dependencies
		lib/sax.js                        # dep: xml parser

		test.mm                           # freemind mindmap using many features
		test.wiki                         # expected converter output

		res/mindmap-testthumb.png         # image linked from the mindmap

Usage
-----

Run mm2wiki.js via node commandline JavaScript execution and copy/paste the result to your Mediawiki

	node <MM2WIKI>/lib/mm2wiki.js mm2wiki <FILE>

The commandline argument `mm2wiki` is required for `mm2wiki.js` to run as commandline tool,
directly executing the `convert` function on the second argument, which should be a file
relative to the current working directory.

*Example Usage*, converting the test.mm mindmap via node and save the result as new file:

	node ./lib/mm2wiki.js mm2wiki test.mm > wikitext.txt


Installation
------------

    git clone https://github.com/ubunatic/mm2wiki.git mm2wiki
    cd mm2wiki
    
    # Test if sample files compile and test conversions runs through:
    node build.js

If everything runs fine, you can remove the files from `./src` and start to use `mm2wiki.js` directly.

*Windows*: Make sure to add the `node.exe` to your system `PATH`.

Issues
------
* Issue 1: Some Unicode icons are not visible on some wikis/systems/fonts
* Issue 2: Commandline tool is still too technical

Roadmap
-------
* Issue 3: sax.js looks like a heavy dependency -> maybe use own custom Freemind parser (xml is not overly complex)
* Issue 4: more command line args required for better control of conversion (usage of == vs ** depending on node depth)

History
-------
v0.1: inital commit
v0.2: removed xml2js dependency

