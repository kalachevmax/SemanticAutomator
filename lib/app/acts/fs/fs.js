

/**
 * @param {string} itemPath
 * @param {function(boolean)} complete
 * @param {function(string, number=)} cancel
 */
app.acts.fs.isDirectory = function(itemPath, complete, cancel) {
  fs.stat(itemPath, function(err, stats) {
    if (err) {
      cancel('Error reading directory item:' + err.toString());
    } else {
      complete(stats && stats.isDirectory());
    }
  });
};


/**
 * @param {string} dirPath
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
app.acts.fs.readDir = function(dirPath, complete, cancel) {
  fs.readdir(dirPath, function(err, items) {
    if (err) {
      cancel('Error reading directory :' + err.toString());
    } else {
      complete(items);
    }
  });
};


/**
 * @param {string} dirPath
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
app.acts.fs.readNestedFileNames = function(dirPath, complete, cancel) {
  var fullPath = [];
  var files = [];

  function enterDir(dirPath, complete, cancel) {
    fullPath.push(dirPath);
    app.acts.fs.readDir(dirPath, complete, cancel);
  }

  function leaveDir() {
    fullPath.pop();
  }

  function addFileName(fileName, complete, cacnel) {
    files.push(fileName);
    complete();
  }

  function handleDirItem(item, complete, cancel) {
    var fullItemPath = path.join(fullPath.join('/'), item);

    fm.script([
      fm.if(app.acts.fs.isDirectory, enterDir, addFileName)
    ])(fullItemPath, complete, cancel);
  }

  fm.script([
    enterDir,
    fm.each(handleDirItem),
    leaveDir
  ])(dirPath, function() {
    complete(files);
  }, cancel);
};
