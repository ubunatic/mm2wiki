#!/bin/sh

file=$1

node lib/mm2wiki.js mm2wiki $file

# node -e "require('./lib/mm2wiki.js').convert('$1', function(err, result) { console.log(result); });"

