

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
 * @namespace
 */
act.scheme = {};


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
var NODE_EXTERNS_DIR = DIRECTOR_DIR + '/externs';


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

    function handleAction() {
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

  function enterDir(dirPath) {
    return function (fullDirPath, complete, cancel) {
      fullPath.push(dirPath);
      complete(fullDirPath);
    }
  }

  function leaveDir(_, complete, cancel) {
    fullPath.pop();
    complete();
  }

  function addFile(file, complete, cancel) {
    files.push(file);
    complete();
  }

  function processDir(dirPath, complete, cancel) {
    fm.script([
      act.fs.readDir,
      fm.each(processItem),
      leaveDir
    ])(dirPath, complete, cancel);
  }

  function processItem(item, complete, cancel) {
    var fullItemPath = path.join(fullPath.join('/'), item);

    fm.script([
      fm.if(act.fs.isDirectory, fm.script([
        enterDir(item),
        processDir
      ]), addFile)
    ])(fullItemPath, complete, cancel);
  }

  fm.script([
    enterDir(dirPath),
    processDir
  ])(dirPath, function() {
    complete(files);
  }, cancel);
};


/**
 * @this {app.Scheme}
 * @param {string} args
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.makeSrcArgs = function(args, complete, cancel) {
  var srcDir = this['srcDir'];
  var rootNamespace = this['rootNamespace'];
  var filenames = this['src'];

  console.log('act.gcc.makeSrcArgs:', filenames);

  if (typeof srcDir === 'string' &&
      typeof rootNamespace === 'string' &&
      filenames instanceof Array) {

    var i = 0,
        l = filenames.length;

    while (i < l) {
      args += ' --js ' + path.join(srcDir, rootNamespace, filenames[i]);
      i += 1;
    }

    complete(args);
  } else {
    cancel('[scheme]: missing one of ("srcDir", "rootNamespace", "src")');
  }
};


/**
 * @param {string} externsDir
 * @return {app.Action}
 */
act.gcc.makeExternsArgs = function(externsDir) {
  return function(args, complete, cancel) {
    if (externsDir !== '') {
      act.fs.readFilesTree(externsDir, handleReaded, cancel);
    } else {
      cancel('[scheme]: missing "externs"');
    }

    function handleReaded(filenames) {
      var i = 0,
          l = filenames.length;

      while (i < l) {
        args += ' --externs ' + filenames[i];
        i += 1;
      }

      complete(args)
    }
  }
};


/**
 * @this {app.Scheme}
 * @param {string} args
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.makeOptionsArgs = function(args, complete, cancel) {
  var options = this['compilerOptions'];

  args += ' --js_output_file ' + path.join(this['buildDir'], this['buildFileName']);
  args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
  args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
  args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

  if (options['formatting'] !== '') {
    args += ' --formatting=' + options['formatting'];
  }

  complete(args);
};


/**
 * @param {app.Scheme} scheme
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.makeArgs = function(scheme, complete, cancel) {
  fm.script([
    act.gcc.makeSrcArgs,
    act.gcc.makeExternsArgs(NODE_EXTERNS_DIR),
    act.gcc.makeExternsArgs(scheme['externs'] || ''),
    act.gcc.makeOptionsArgs
  ]).call(this, '', complete, cancel);
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
 * @param {app.Scheme} scheme
 * @param {function(!Array.<!Object>)} complete
 * @param {function(string, number=)} cancel
 */
act.scheme.getModules = function(scheme, complete, cancel) {
  if (scheme['modules'] instanceof Array) {
    complete(scheme['modules']);
  } else {
    cancel('[act.scheme.getModules] missing modules section');
  }
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
  console.log('handleInput: ', process.argv);
  if (process.argv.length === 2 || typeof act[process.argv[2]] === 'function') {
    var name = process.argv[2] || 'make';
    act[name].call(app.__scheme, app.__scheme,
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
  console.log('loadProjectScheme:', filename);
  act.fs.readFile({encoding: 'utf-8'})(filename, function(file) {
    try {
      app.__scheme = JSON.parse(file);
      complete();
    } catch(error) {
      cancel('Scheme file parsing error: ' + error.toString());
    }
  }, cancel);
}


act.MESSAGES = {
  make: 'The application has been successfully built'
};


act.make = fm.script([
  act.scheme.getModules(),
  fm.each(fm.script([
    act.gcc.makeArgs,
    act.gcc.invoke
  ]))
]);


act.update = fm.script([
]);


act.publish = fm.script([

]);



/**
 * @type {app.Action}
 */
var main = fm.script([
  loadProjectScheme,
  handleInput
]);


main(SCHEME_FILE_NAME, nop, console.log);
