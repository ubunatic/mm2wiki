(function() {
  var CoRegex;
  CoRegex = {
    match_srcpath: /^[\.\/]*\/src\//,
    match_libpath: /^[\.\/]*\/lib\//,
    match_cofile: /\/[^\/]*\.co$/,
    match_jsfile: /\/[^\/]*\.js$/,
    match_coext: /\.co$/,
    match_jsext: /\.js$/,
    match_relative: /^\.\//
  };
  module.exports.CoRegex = CoRegex;
}).call(this);
