(function() {
  var currentEditor, path2edit, setEditor;
  currentEditor = "vim";
  path2edit = function(path) {
    return path.replace("./", "");
  };
  setEditor = function(editor) {
    return currentEditor = editor;
  };
  module.exports = {
    path2edit: path2edit,
    setEditor: setEditor
  };
}).call(this);
