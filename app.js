

var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');


/**
 * @namespace
 */
var app = {};


/**
 * @namespace
 */
app.actions = {};


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @typedef {function(*, !Function, !Function)}
 */
app.Action;


/**
 * @type {string}
 */
app.SCHEME_FILE_NAME = 'scheme.json';


/**
 * @type {app.Scheme}
 */
app.__scheme = null;


/**
 * @enum {string}
 */
app.__MESSAGES = {
  make: 'The application has been successfully built'
};


/**
 * @param {!Array.<app.Action>} actions
 * @return {app.Action}
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
 * @return {app.Action}
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
 * @this {app.Scheme}
 * @param {*} _
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function loadFilesList(_, complete, cancel) {
  var scheme = this;
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
  var scheme = this;

  var args = '';

  var i = 0,
      l = files.length;

  while (i < l) {
    args += ' --js ' + files[i];
    i += 1;
  }

  args += ' --js_output_file ' + path.join(scheme['buildDir'], scheme['buildFileName']);

  complete(args);
}


/**
 * @param {String} args
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function invokeCompiler(args, complete, cancel) {
  console.log('invokeCompiler:', args);

  function handleCompleted(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (err === null) {
      complete();
    } else {
      cancel('exec command [' + command + '] error:' + err.toString());
    }
  }

  childProcess.exec('java -jar tools/compiler.jar ' + args, handleCompleted);
}


/**
 * @type {app.Action}
 */
app.make = script([
  loadFilesList,
  makeCompilerArgs,
  invokeCompiler
]);


/**
 * @type {app.Action}
 */
app.check = function() {
};


/**
 * @type {app.Action}
 */
app.compile = function() {
};


/**
 * @type {app.Action}
 */
app.lint = function() {
};


/**
 * @type {app.Action}
 */
app.update = function() {
};


/**
 * @type {app.Action}
 */
app.publish = function() {
};


/**
 *
 */
function usage() {
  console.log('usage: app action');
  console.log('action = make|update|publish|check|compile|lint');
}


/**
 * @param {!Function} complete
 * @param {!Function} cancel
 */
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


/**
 * @param {string} name
 * @return {app.Action}
 */
function handleActionCompleted(name) {
  return function() {
    console.log(app.__MESSAGES[name]);
  }
}


/**
 *
 */
function handleInput() {
  if (process.argv.length === 2 || typeof app[process.argv[2]] === 'function') {
    var name = process.argv[2] || 'make';
    app[name].call(app.__scheme, null, handleActionCompleted(name), console.log);
  } else {
    usage();
  }
}


/**
 * @param {app.Scheme} scheme
 */
function handleSchemeLoaded(scheme) {
  app.__scheme = scheme;
  handleInput();
}


loadScheme(handleSchemeLoaded, console.log);
