(function() {
  var DEBUG, addDepthMarker, argv, cleanupSpaces, commandline, config, console, convert, icon2wiki, img2wiki, link2wiki, match_http, match_localfile, match_mmext, match_wikititle, parseNodeTree, parseSimpleNode, sax, strict, toList;
  var __slice = Array.prototype.slice;
  sax = require("./sax");
  strict = true;
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
  convert = function(mmfile, cb) {
    var href, level, minBoldDepth, node, parser, result, root;
    parser = sax.parser(strict);
    console.log("parsing wikifile: ", mmfile.length);
    result = "";
    root = node = {
      text: '',
      icons: "",
      nodes: [],
      parent: void 0
    };
    level = 0;
    href = void 0;
    minBoldDepth = 3;
    parser.onerror = function(err) {
      return cb(err, result);
    };
    parser.ontext = function(t) {
      var tt;
      tt = t.replace(/[\n\r\t]*/g, "");
      if (href != null) {
        node.richtext += " " + (link2wiki(href, tt.trim())) + " ";
        return href = void 0;
      } else {
        return node.richtext += tt;
      }
    };
    parser.onopentag = function(tag) {
      var n, _ref, _ref2;
      if (tag.name === "map") {
        level = 0;
      }
      if (tag.name === "node") {
        n = {
          parent: node,
          nodes: [],
          icons: ""
        };
        level++;
        n.text = parseSimpleNode(tag);
        node = n;
      }
      if (tag.name === "richcontent") {
        node.richcontent = true;
        node.richtext = '';
      }
      if (tag.name === "b" || tag.name === "strong") {
        if (!(level < minBoldDepth)) {
          node.richtext += "'''";
        }
      }
      if (tag.name === "i") {
        node.richtext += "''";
      }
      if (tag.name === "a") {
        href = tag.attributes.href;
      }
      if (tag.name === "font") {
        if ((tag.attributes.BOLD != null) && level >= minBoldDepth) {
          node.text = "'''" + node.text + "'''";
        }
      }
      if (tag.name === "br") {
        node.richtext += " ";
      }
      if (tag.name === "icon") {
        node.icons += icon2wiki(tag);
      }
      if (tag.name === "img") {
        node.text += img2wiki(tag);
      }
      if (((_ref = node.richtext) != null ? _ref.trim() : void 0) === "") {
        node.richtext = node.richtext.trim();
      }
      if (((_ref2 = node.text) != null ? _ref2.trim() : void 0) === "") {
        return node.text = node.text.trim();
      }
    };
    parser.onclosetag = function(tag) {
      var t;
      if (tag === "node") {
        t = node.text;
        if (node.richcontent) {
          t += node.richtext;
        }
        if (node.icons !== "") {
          t = node.icons + " " + t;
        }
        t = addDepthMarker(t, level);
        node.result = t;
        node.parent.nodes.push(node);
        node = node.parent;
        level--;
      }
      if (tag === "b" || tag === "strong") {
        if (!(level < minBoldDepth)) {
          node.richtext += "'''";
        }
      }
      if (tag === "i") {
        return node.richtext += "''";
      }
    };
    parser.onend = function() {
      result = parseNodeTree(root);
      return console.log(result);
    };
    parser.write(mmfile).close();
    return cb(void 0, result);
  };
  parseNodeTree = function(root) {
    var n, result, _i, _len, _ref;
    result = '';
    _ref = root.nodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      result += n.result + parseNodeTree(n);
    }
    return result;
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
  parseSimpleNode = function(node) {
    var a, t;
    a = node.attributes;
    t = '';
    if (a.TEXT != null) {
      t = a.TEXT.trim();
    }
    if (a.LINK != null) {
      t = link2wiki(a.LINK, t);
    }
    return t;
  };
  addDepthMarker = function(text, depth) {
    var end, start;
    end = "\n";
    start = "";
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
    return start + cleanupSpaces(text) + end;
  };
  cleanupSpaces = function(text) {
    return text.replace(/[ ]+/g, ' ').trim();
  };
  img2wiki = function(img) {
    var a, t;
    a = img.attributes;
    t = "";
    if (a.src != null) {
      t = "see image " + a.src + " [[File:" + a.src + "|thumb]]";
    }
    return t;
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
    var a, name, o, result;
    a = icon.attributes;
    if (a.BUILTIN == null) {
      "";
    }
    name = a.BUILTIN;
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
