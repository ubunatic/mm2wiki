(function() {
  var convert, icon2wiki, js2wiki, rich2wiki, xml2js;
  xml2js = require("./xml2js");
  convert = function(wikifile, cb) {
    var parser;
    parser = new xml2js.Parser();
    return parser.parseString(wikifile, function(err, result) {
      return cb(err, js2wiki(result));
    });
  };
  js2wiki = function(node, depth) {
    var end, link, n, nodes, result, start, _i, _len, _ref, _ref2, _ref3, _ref4;
    if (depth == null) {
      depth = 0;
    }
    result = "";
    link = "";
    nodes = [];
    start = "";
    end = "\n";
    switch (depth) {
      case 1:
        start = "==";
        end = "==\n";
        break;
      case 2:
        start = "===";
        end = "===\n";
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
    if (node["icon"] != null) {
      result += icon2wiki(node["icon"]) + " ";
    }
    if ((_ref2 = node["@"]) != null ? _ref2["LINK"] : void 0) {
      link = " [" + ((_ref3 = node["@"]) != null ? _ref3["LINK"] : void 0) + "]";
    }
    if ((_ref4 = node["@"]) != null ? _ref4["TEXT"] : void 0) {
      result += node["@"]["TEXT"] + link + end;
    }
    nodes = node["node"] != null ? node["node"].length > 1 ? node["node"] : [node["node"]] : [];
    console.log("node:", node["@"]["TEXT"]);
    if (node["richcontent"] != null) {
      result += rich2wiki(node["richcontent"], depth > 2).trim() + end;
    }
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      n = nodes[_i];
      result += js2wiki(n, depth + 1);
    }
    return result;
  };
  rich2wiki = function(node, linebreak) {
    var e, o, result, splitter, _ref;
    if (linebreak == null) {
      linebreak = false;
    }
    result = "";
    splitter = " ";
    if (linebreak) {
      splitter = " <br>";
    }
    o = function(testObj, start, func, end) {
      if (end == null) {
        end = "";
      }
      if ((testObj != null) && (func != null)) {
        result += start + func(testObj) + end;
      }
      if (typeof testObj === 'string' && !(func != null)) {
        result += testObj;
        result += start != null ? start : "";
        return result += end;
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
        result += "[" + node["@"]["href"] + " " + node["#"] + "]";
      } else {
        o(node["#"], " ");
      }
      o(node.a, "", rich2wiki);
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
  icon2wiki = function(icon) {
    var name, o, result;
    if (icon["@"]["BUILTIN"] == null) {
      "";
    }
    name = icon["@"]["BUILTIN"];
    result = "";
    o = function(ascii, regex) {
      if (name.match(regex)) {
        return result = ascii;
      }
    };
    o("/'''!'''\\", /warning/);
    o("('''!?''')", /idea/);
    return result;
  };
  module.exports.convert = convert;
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
