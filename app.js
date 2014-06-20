

var app = {};
var fs = require('fs');
var path = require('path');


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @type {string}
 */
app.SCHEME_FILE_NAME = 'scheme.json';


/**
 * @type {app.Scheme}
 */
app.__scheme = null;


function nop() {}


/**
 * @param {!Array.<!Function>} actions
 * @return {!Function}
 */
function script(actions) {
  return function(input, complete, cancel) {
    var context = this;

    function process(action, accumulator) {
      action.call(context, accumulator, handleAction, cancel);
    }

    function handleAction(result) {
      fold(result);
    }

    function fold(accumulator) {
      if (actions.length > 0) {
        process(actions.shift(), accumulator);
      } else {
        complete(accumulator);
      }
    }

    fold(input);
  }
}


/**
 * @param {!Array} list
 * @return {!Function}
 */
function each(list) {
  return function(action, complete, cancel) {
    var context = this;

    function process(item) {
      action.call(context, item, handleAction, cancel);
    }

    function handleAction(result) {
      fold(process);
    }

    function fold() {
      if (list.length > 0) {
        process(list.shift());
      } else {
        complete();
      }
    }

    fold();
  }
}


/**
 * @param {app.Scheme} scheme
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function loadFilesList(scheme, complete, cancel) {
  console.log('loadFilesList:', scheme);

  var fullPath = [];
  var files = [];

  function handleDirItem(item, complete, cancel) {
    var fullItem = path.join(fullPath.join('/'), item);
    fs.stat(fullItem, function(err, stats) {
      if (err) {
        cancel('Reading directory item [' + item + '] error:' + err.toString());
      } else {
        if (stats && stats.isDirectory()) {
          fullPath.push(item);
          readDir(item, complete, cancel);
        } else {
          files.push(fullItem);
          complete();
        }
      }
    });
  }

  function handleDirContent(items, complete, cancel) {
    each(items)(handleDirItem, function() {
      fullPath.pop();
      complete();
    }, cancel);
  }

  function readDir(dirPath, complete, cancel) {
    fs.readdir(path.join(fullPath.join('/')), function(err, items) {
      if (err) {
        cancel('Reading directory [' +  dirPath + '] content error:' + err.toString());
      } else {
        handleDirContent(items, complete, cancel);
      }
    });
  }

  if (scheme === null) {
    cancel('Scheme is not defined');
  } else {
    var libDir = scheme['srcDir'];
    fullPath.push(libDir);
    readDir(libDir, function() {
      complete(files);
    }, cancel);
  }
}


/**
 * @param {!Array.<string>} files
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function makeCompilerArgs(files, complete, cancel) {
  console.log('makeCompilerArgs:', files);
  complete('""');
}


/**
 * @param {String} args
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function invokeCompiler(args, complete, cancel) {
  console.log('invokeCompiler:', args);
  complete('OK');
}


/**
 * @param {*} result
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function handleCompilerResult(result, complete, cancel) {
  console.log('handleCompilerResult:', result);
  showSuccessfullyResult();
  complete();
}


function showSuccessfullyResult() {
  console.log('The application has been successfully built');
}


app.make = function() {
  script([
    loadFilesList,
    makeCompilerArgs,
    invokeCompiler,
    handleCompilerResult
  ])(app.__scheme, nop, console.log);
};


app.update = function() {
};


app.publish = function() {
};


app.check = function() {
};


app.compile = function() {
};


app.lint = function() {
};


function usage() {
  console.log('usage: app action');
  console.log('action = make|update|publish|check|compile|lint');
}


function loadScheme(complete, cancel) {
  fs.readFile(app.SCHEME_FILE_NAME, function(error, data) {
    if (error) {
      cancel('Scheme file reading error: ', error.toString());
    }

    try {
      var scheme = JSON.parse(data);
    } catch(error) {
      cancel('Scheme file parsing error: ' + error.toString());
    }

    complete(scheme);
  });
}


function handleInput() {
  if (process.argv.length > 2) {
    if (typeof app[process.argv[2]] === 'function') {
      app[process.argv[2]]();
    } else {
      usage();
    }
  } else {
    app.make();
  }
}


function handleSchemeLoaded(scheme) {
  app.__scheme = scheme;
  handleInput();
}


loadScheme(handleSchemeLoaded, console.log);
