

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
var fm = {};


/**
 * @namespace
 */
var act = {};


/**
 * @namespace
 */
act.fs = {};


/**
 * @namespace
 */
act.gcc = {};


/**
 * @type {string}
 */
var SCHEME_FILE_NAME = 'scheme.json';


/**
 * @type {string}
 */
var DIRECTOR_NAME = 'NodeAppDirector';


/**
 * @type {string}
 */
var DIRECTOR_DIR = '/opt/' + DIRECTOR_NAME;


/**
 * @type {string}
 */
var COMPILER_PATH = '/opt/closure-compiler.jar';


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @typedef {function(*, !Function, !Function)}
 */
app.Action;


/**
 * @type {app.Scheme}
 */
app.__scheme = null;


/**
 * @type {!Object.<string, app.Action>}
 */
app.acts = {};


/**
 *
 */
function nop() {}


/**
 * @param {!Object} src
 * @param {!Object} dst
 */
function copyObj(src, dst) {
  for (var key in src) {
    dst[key] = src;
  }
}


/**
 * @param {!Array.<app.Action>} actions
 * @return {app.Action}
 */
fm.script = function(actions) {
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
};


/**
 * @param {app.Action} action
 * @return {app.Action}
 */
fm.each = function(action) {
  return function(list, complete, cancel) {
    var context = this;

    function process(item) {
      action.call(context, item, handleAction, cancel);
    }

    function handleAction(result) {
      fold();
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
};


/**
 * @param {app.Action} action
 * @param {app.Action} trueBranch
 * @param {app.Action=} opt_falseBranch
 * @return {app.Action}
 */
fm.if = function(action, trueBranch, opt_falseBranch) {
  return function(atom, complete, cancel) {
    var context = this;

    action(atom, function(result) {
      if (result) {
        trueBranch.call(context, atom, complete, cancel);
      } else {
        if (typeof opt_falseBranch === 'function') {
          opt_falseBranch.call(context, atom, complete, cancel);
        } else {
          complete(atom);
        }
      }
    }, cancel);
  }
};


/**
 * @param {!Object=} opt_options
 * @return {fm.Action}
 */
act.fs.readFile = function(opt_options) {
  return function(filename, complete, cancel) {
    fs.readFile(filename, opt_options, function(err, data) {
      if (err === null) {
        complete(data);
      } else {
        cancel('[act.fs.readFile]: ' + err.toString());
      }
    });
  }
};


/**
 * @param {string} itemPath
 * @param {function(boolean)} complete
 * @param {function(string, number=)} cancel
 */
act.fs.isDirectory = function(itemPath, complete, cancel) {
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
act.fs.readDir = function(dirPath, complete, cancel) {
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
 * @param {function(!Array.<string>)} complete
 * @param {function(string, number=)} cancel
 */
act.fs.readFilesTree = function(dirPath, complete, cancel) {
  var fullPath = [];
  var files = [];

  function enterDir(dirPath, complete, cancel) {
    fullPath.push(dirPath);
    act.fs.readDir(dirPath, complete, cancel);
  }

  function leaveDir() {
    fullPath.pop();
  }

  function addFile(file, complete, cacnel) {
    files.push(fileName);
    complete();
  }

  function handleDirItem(item, complete, cancel) {
    var fullItemPath = path.join(fullPath.join('/'), item);

    fm.script([
      fm.if(act.fs.isDirectory, enterDir, addFile)
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


/**
 * @param {!Array.<string>} fileNames
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.makeArgs = function(fileNames, complete, cancel) {
  console.log('act.gcc.makeArgs:', fileNames);
  var scheme = this;

  var args = '';

  var i = 0,
      l = fileNames.length;

  while (i < l) {
    args += ' --js ' + fileNames[i];
    i += 1;
  }

  var options = scheme['compilerOptions'];

  args += ' --js_output_file ' + path.join(scheme['buildDir'], scheme['buildFileName']);
  args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
  args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
  args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

  if (options['formatting'] !== '') {
    args += ' --formatting=' + options['formatting'];
  }

  complete(args);
};


/**
 * @param {string} args
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.invoke = function(args, complete, cancel) {
  console.log('act.gcc.invoke:', args);

  function handleCompleted(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (err === null) {
      complete();
    } else {
      cancel('[act.gcc.invoke]: ' + err.toString());
    }
  }

  childProcess.exec('java -jar ' + COMPILER_PATH + args, handleCompleted);
};


/**
 *
 */
function usage() {
  console.log('usage: app action');
  console.log('action = make|update|publish');
}


/**
 * @param {string} name
 * @return {app.Action}
 */
function handleActionCompleted(name) {
  return function() {
    console.log(act.MESSAGES[name]);
  }
}


/**
 *
 */
function handleInput() {
  if (process.argv.length === 2 || typeof act[process.argv[2]] === 'function') {
    var name = process.argv[2] || 'make';
    act[name].call(app.__scheme, app.__scheme['srcDir'],
        handleActionCompleted(name), console.log);
  } else {
    usage();
  }
}


/**
 * @param {string} filename
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
function loadProjectScheme(filename, complete, cancel) {
  act.fs.readFile({encoding: 'utf-8'})(filename, function(file) {
    try {
      app.__scheme = JSON.parse(file);
      complete();
    } catch(error) {
      cancel('Scheme file parsing error: ' + error.toString());
    }
  }, cancel);
}


/**
 * @param {string} dir
 * @returns {app.Action}
 */
function loadActs(dir) {
  return function(_, complete, cancel) {
    try {
      var loadedActs = require(dir + '/acts.js');
      copyObj(loadedActs, act);
      complete();
    } catch(error) {
      cancel('[loadActs]: ' + error.toString());
    }
  }
}


/**
 * @type {app.Action}
 */
var main = fm.script([
  loadProjectScheme,
  loadActs(DIRECTOR_DIR),
  handleInput
]);


main(SCHEME_FILE_NAME, nop, console.log);
