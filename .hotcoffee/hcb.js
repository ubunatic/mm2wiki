(function(){
	var fs = require("fs"),
		hcbDir = ".hotcoffee",
		cwd = process.cwd() + "/",
		selfbuild = false,
		hcb = null;

	// compile the bootstrapper which then compiles all other files
	function bootstrap() {
		var coffee, file, code;
		coffee = require("./lib/coffee").CoffeeScript;

		file = fs.readFileSync( cwd + hcbDir + "/src/hotcoffee.co", "UTF8" );
		code = coffee.compile( file, { filename: cwd + hcbDir + "/src/hotcoffee.co" } );
		fs.writeFileSync( cwd + hcbDir + "/lib/hotcoffee.js", code );

		hcb = require("./lib/hotcoffee").HotCoffeeBrewer;
		hcb.buildSelf();
	}

	// start building self if hotcoffee.js is not found
	if( selfbuild || !fs.statSync( cwd + hcbDir + "/lib/hotcoffee.js" ).isFile() ) {
		bootstrap();
	}else{
		hcb = require("./lib/hotcoffee").HotCoffeeBrewer;
	}

	module.exports = hcb;

}).call(this)
