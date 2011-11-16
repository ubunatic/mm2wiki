(function() {
  var CoRegex, CoRegexFn, addMatcher, match, name;
  CoRegex = {
    match_srcpath: /^[\.\/]*\/src\//,
    match_libpath: /^[\.\/]*\/lib\//,
    match_cofile: /\/[^\/]*\.co$/,
    match_jsfile: /\/[^\/]*\.js$/,
    match_coext: /\.co$/,
    match_jsext: /\.js$/,
    match_relative: /^\.\//
  };
  CoRegexFn = {};
  addMatcher = function(name, match) {
    CoRegexFn[name] = function(text) {
      return match.exec(text);
    };
    return CoRegexFn[name].match = match;
  };
  for (name in CoRegex) {
    match = CoRegex[name];
    addMatcher(name, match);
  }
  module.exports.CoRegexFn = CoRegexFn;
  module.exports.CoRegex = CoRegex;
}).call(this);
