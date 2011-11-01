(function() {
  var DEBUG, argv, commandline, config, console, convert, icon2wiki, js2wiki, link2wiki, match_http, match_localfile, match_mmext, match_wikititle, rich2wiki, toList, xml2js;
  var __slice = Array.prototype.slice;
  xml2js = require("./xml2js");
  DEBUG = false;
  config = {
    linebreak: false
  };
  console = {
    log: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (DEBUG) {
        return (_ref = global.console).log.apply(_ref, args);
      }
    },
    error: function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (DEBUG) {
        return (_ref = global.console).error.apply(_ref, args);
      }
    }
  };
  convert = function(wikifile, cb) {
    var parser;
    parser = new xml2js.Parser();
    return parser.parseString(wikifile, function(err, result) {
      return cb(err, js2wiki(result));
    });
  };
  toList = function(object) {
    if (object != null) {
      if (object.length > 1) {
        return object;
      } else {
        return [object];
      }
    } else {
      return [];
    }
  };
  js2wiki = function(node, depth) {
    var attr, bold, end, final, icon, linebreak, minBoldDepth, minBreakDepth, n, nodes, result, simpleText, start, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4, _ref5;
    if (depth == null) {
      depth = 0;
    }
    result = "";
    nodes = [];
    start = "";
    end = "\n";
    attr = {};
    final = "";
    bold = false;
    minBoldDepth = 3;
    simpleText = "";
    minBreakDepth = 3;
    linebreak = depth >= minBreakDepth && config.linebreak;
    switch (depth) {
      case 1:
        start = "=";
        end = "=\n";
        break;
      case 2:
        start = "==";
        end = "==\n";
        break;
      case 3:
        start = "* ";
        break;
      case 4:
        start = "** ";
        break;
      case 5:
        start = "*** ";
        break;
      case 6:
        start = "**** ";
    }
    if (!((_ref = node["@"]) != null ? _ref["version"] : void 0)) {
      result = start;
    }
    if (((_ref2 = node["font"]) != null ? (_ref3 = _ref2["@"]) != null ? _ref3["BOLD"] : void 0 : void 0) === "true") {
      bold = true;
    }
    if (node["icon"]) {
      if (node["icon"].length != null) {
        _ref4 = node["icon"];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          icon = _ref4[_i];
          result += "" + (icon2wiki(icon)) + " ";
        }
      } else {
        result += "" + (icon2wiki(node["icon"])) + " ";
      }
    }
    if (attr = node["@"]) {
      if (attr.TEXT) {
        if (bold && depth >= minBoldDepth) {
          result += "'''";
          end = "'''" + end;
        }
        if (attr.LINK) {
          result += link2wiki(attr.LINK, attr.TEXT) + end;
        } else {
          result += attr.TEXT + end;
        }
      } else {
        if (attr.LINK) {
          result += link2wiki(attr.LINK) + " ";
        }
        final = end;
      }
    }
    if (node["richcontent"] != null) {
      result += rich2wiki(node["richcontent"], linebreak).trim() + final;
    }
    _ref5 = toList(node["node"]);
    for (_j = 0, _len2 = _ref5.length; _j < _len2; _j++) {
      n = _ref5[_j];
      result += js2wiki(n, depth + 1);
    }
    return result;
  };
  rich2wiki = function(node, linebreak) {
    var e, o, result, splitter, _ref, _ref2;
    if (linebreak == null) {
      linebreak = false;
    }
    result = "";
    splitter = linebreak ? " <br>" : " ";
    o = function(testObj, start, func, end) {
      if (end == null) {
        end = "";
      }
      if ((testObj != null) && (func != null)) {
        result += start + func(testObj) + end;
      }
      if (typeof testObj === 'string' && !(func != null)) {
        return result += testObj + (start != null ? start : "") + end;
      }
    };
    if (typeof node === 'string') {
      result = node;
    } else if (typeof node === 'object' && !(node.length != null)) {
      console.log("found: object");
      if (node.html != null) {
        result += rich2wiki(node.html.body, linebreak);
      }
      if (node.p != null) {
        result += rich2wiki(node.p, linebreak);
      }
      if (((_ref = node["@"]) != null ? _ref["href"] : void 0) != null) {
        result += link2wiki(node["@"]["href"], node["#"]);
      } else {
        o(node["#"], " ");
      }
      if (((_ref2 = node["@"]) != null ? _ref2["src"] : void 0) != null) {
        result += "see image " + node["@"]["src"] + " ";
        result += "[[File:" + node["@"]["src"] + "|thumb]]";
      }
      o(node.a, "", rich2wiki);
      o(node.img, "", rich2wiki);
      o(node.small, "", rich2wiki);
      o(node.span, "", rich2wiki);
      o(node.strong, "", rich2wiki);
      o(node.b, "'''", rich2wiki, "'''");
      o(node.i, "''", rich2wiki, "''");
      o(node.br, " <br>");
    } else if (node.length > 0) {
      console.log("found: array(" + node.length + "), linebreak=" + linebreak);
      result += ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = node.length; _i < _len; _i++) {
          e = node[_i];
          _results.push(rich2wiki(e));
        }
        return _results;
      })()).join(splitter);
    } else {
      console.log("found nothing!");
    }
    console.log(node);
    return result;
  };
  match_http = /^\s*[hf][t]?tp[s]?/;
  match_localfile = /^\s*\.\/|^\s*\.\\|^\s*[\\\/\s\w-_0-9]*\.[\.\s\w-_0-9]*/;
  match_wikititle = /^\s*[\\\/\s\w-_0-9]*[\s\w-_0-9]*/;
  match_mmext = /\.mm\s*$/;
  link2wiki = function(link, text) {
    var result;
    result = "";
    if (text != null) {
      if (link.match(match_http)) {
        result = "[" + link + " " + text + "]";
      } else if (link.match(match_localfile)) {
        result = "" + text + " [[File:" + link + "]]";
        if (link.match(match_mmext)) {
          result = "mindmap: " + result;
        }
      } else if (link.match(match_wikititle)) {
        result = "" + text + " [" + link + "]";
      } else {
        result = "" + text + ": " + link;
      }
    } else {
      if (link.match(match_http)) {
        result = "[" + link + "]";
      } else if (link.match(match_localfile)) {
        result = "[[File:" + link + "]]";
      } else if (link.match(match_wikititle)) {
        result = "[" + link + "]";
      } else {
        result = "" + link;
      }
    }
    return result;
  };
  icon2wiki = function(icon) {
    var name, o, result, _ref;
    if (((_ref = icon["@"]) != null ? _ref["BUILTIN"] : void 0) == null) {
      "";
    }
    name = icon["@"]["BUILTIN"];
    result = "";
    o = function(utftext, regex) {
      if (name.match(regex)) {
        return result = utftext;
      }
    };
    o("<big><big>⚠</big></big>", /warning/);
    o("εїз", /freemind/);
    o("<big>ⓘ</big>", /idea/);
    o("[<u>…</u>]", /folder/);
    o("<big>⁝</big>☰", /list/);
    o("|<big>✎</big>|", /edit/);
    o("<big><big>☆</big></big>", /bookmark/);
    o("[<small>linux</small>]", /penguin/);
    o("<big><big>⌚</big></big>", /clock/);
    return result;
  };
  commandline = function(filename) {
    var file, fs;
    fs = require("fs");
    file = fs.readFileSync(filename, "UTF-8");
    convert(file, function(err, result) {
      if (err) {
        global.console.error(err);
      } else {
        global.console.log(result);
      }
    });
  };
  module.exports.convert = convert;
  module.exports.cli = commandline;
  argv = process.argv;
  if (argv.length > 2 && argv[2] === "mm2wiki" && (argv[3] != null)) {
    commandline(argv[3]);
  }
  /* ASCII art
  # http://utf8-characters.com/geometric-shapes/
  # idea: [<u>Ω</u>]
  # table: �
  # warn: ⚠
  # musical: �
  # trigram: ☰�
  # tetragrams: �
  # digrams: �
  # █▬█ █ ▀█▀
  # █!█
  # <!>
  # <mm>
  # &lt;&#F723&gt;
  */
  /*
  # LIST OF FREEMIND BUILTIN ICONS:
  # -------------------------------
  # attach
  # back
  # bell
  # bookmark
  # clanbomber
  # desktopnew
  # flag
  # forward
  # gohome
  # help
  # idea
  # kaddressbook
  # knotify
  # korn
  # licq
  # mail
  # password
  # pencil
  # penguin
  # priority-1
  # priority-2
  # priority-3
  # priority-4
  # priority-5
  # priority-6
  # priority-7
  # stop
  # warning
  # wizard
  # xmag
  */
}).call(this);
