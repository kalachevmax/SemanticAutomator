

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
act.cli = {};


/**
 * @namespace
 */
act.fs = {};


/**
 * @namespace
 */
act.proc = {};


/**
 * @namespace
 */
act.gcc = {};


/**
 * @namespace
 */
act.git = {};


/**
 * @namespace
 */
act.scheme = {};


/**
 * @namespace
 */
act.dep = {};


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
 * @type {string}
 */
var DEPS_DIR = 'deps';


/**
 * @type {string}
 */
var GCC = 'java -jar ' + COMPILER_PATH;


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @typedef {function(*, !Function, !Function)}
 */
app.Action;


/**
 * @typedef {!Object}
 */
app.Module;


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
 * @param {!Object} base
 * @param {!Object} obj
 * @return {!Object}
 */
function extend(base, obj) {
  for (var key in obj) {
    base[key] = obj[key];
  }

  return base;
}


/**
 * @param {!Array.<app.Action>} actions
 * @return {app.Action}
 */
fm.script = function(actions) {
  return function(input, complete, cancel) {
    var context = this;
    var localActions = actions.slice(0);

    function process(action, accumulator) {
      action.call(context, accumulator, handleAction, cancel);
    }

    function handleAction(result) {
      fold(result);
    }

    function fold(accumulator) {
      if (localActions.length > 0) {
        process(localActions.shift(), accumulator);
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
      action.call(context, item, fold, cancel);
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
 * @param {string} command
 * @return {app.Action}
 */
act.proc.exec = function(command) {
  return function(opt_options, complete, cancel) {
    childProcess.exec(command, opt_options, function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);

      if (error === null) {
        complete();
      } else {
        cancel('[act.proc.exec]: ' + error.toString());
      }
    });
  }
};


/**
 * @param {app.Module} module
 * @return {app.Action}
 */
act.gcc.makeSrcArgs = function(module) {
  /**
   * @this {app.Scheme}
   * @param {string} args
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  return function (args, complete, cancel) {
    var scheme = this;
    var srcDir = scheme['srcDir'];
    var rootNamespace = scheme['rootNamespace'];
    var filenames = module['src'];

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
      cancel('[act.gcc.makeSrcArgs] missing section: srcDir|rootNamespace|module.src');
    }
  }
};


/**
 * @param {string} externsDir
 * @return {app.Action}
 */
act.gcc.makeExternsArgs = function(externsDir) {
  /**
   * @param {string} args
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  return function(args, complete, cancel) {
    if (externsDir !== '') {
      act.fs.readFilesTree(externsDir, handleReaded, cancel);
    } else {
      cancel('[act.gcc.makeExternsArgs] missing externs section');
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
 * @param {app.Module} module
 * @return {app.Action}
 */
act.gcc.makeOptionsArgs = function(module) {
  /**
   * @this {app.Scheme}
   * @param {string} args
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  return function(args, complete, cancel) {
    var scheme = this;
    var options = scheme['compilerOptions'];

    args += ' --js_output_file ' + path.join(scheme['buildDir'], module['name']) + '.js';
    args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
    args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
    args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

    if (options['formatting'] !== '') {
      args += ' --formatting=' + options['formatting'];
    }

    complete(args);
  }
};


/**
 * @param {string} args
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.invoke = function(args, complete, cancel) {
  act.proc.exec(GCC + args)({}, complete, cancel);
};


/**
 * @this {app.Scheme}
 * @param {app.Module} module
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
act.gcc.makeArgs = function(module, complete, cancel) {
  fm.script([
    act.gcc.makeSrcArgs(module),
    act.gcc.makeExternsArgs(NODE_EXTERNS_DIR),
    act.gcc.makeExternsArgs(this['externs'] || ''),
    act.gcc.makeOptionsArgs(module)
  ]).call(this, '', complete, cancel);
};


/**
 * @param {string} filename
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 */
act.scheme.load = function(filename, complete, cancel) {
  act.fs.readFile({encoding: 'utf-8'})(filename, function(file) {
    try {
      complete(JSON.parse(file));
    } catch(error) {
      cancel('[act.scheme.load] parsing error: ' + error.toString());
    }
  }, cancel);
};


/**
 * @param {app.Scheme} scheme
 * @param {function(!Array.<app.Module>)} complete
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
 * @param {!Object.<string, !Object>} obj
 * @return {!Array.<!Object>}
 */
act.scheme.__depsToArray = function(obj) {
  var result = [];

  for (var name in obj) {
    var item = {
      name: name
    };

    if (obj[name] instanceof Object) {
      item = extend(item, obj[name]);
    } else if (typeof obj[name] === 'string') {
      item.type = 'git';
      item.repo = obj[name];
    }

    result.push(item);
  }

  return result;
};


/**
 * @param {app.Scheme} scheme
 * @param {function(!Array.<!Object>)} complete
 * @param {function(string, number=)} cancel
 */
act.scheme.getDeps = function(scheme, complete, cancel) {
  if (scheme['deps'] instanceof Object) {
    complete(act.scheme.__depsToArray(scheme['deps']));
  } else {
    cancel('[act.scheme.getDeps] missing deps section');
  }
};


/**
 * @param {!Object} dep
 * @param {function(!Object)} complete
 * @param {function(string, number=)} cancel
 */
act.dep.update = function(dep, complete, cancel) {
  if (dep['name'] === 'git') {
    act.git.clone.call(this, dep['repo'], complete, cancel)
  }
};


/**
 * @param {string} repo
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
act.git.clone = function(repo, complete, cancel) {
  act.proc.exec('git clone ' + repo + DEPS_DIR)({}, complete, cancel);
};


/**
 *
 */
function usage() {
  console.log('usage: app action');
  console.log('action = make|update|publish');
}


/**
 * @param {app.Scheme} scheme
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
act.cli.read = function(scheme, complete, cancel) {
  if (process.argv.length === 2 || typeof act[process.argv[2]] === 'function') {
    complete(process.argv[2] || 'make');
  } else {
    usage();
    cancel('');
  }
};


/**
 * @param {string} name
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
act.invoke = function(name, complete, cancel) {
  act[name].call(app.__scheme, app.__scheme, function() {
    console.log(act.MESSAGES[name]);
    complete();
  }, cancel);
};


act.MESSAGES = {
  make: 'The application has been successfully built'
};


act.make = fm.script([
  act.scheme.getModules,

  fm.each(fm.script([
    act.gcc.makeArgs,
    act.gcc.invoke
  ]))
]);


act.update = fm.script([
  act.scheme.getDeps,
  fm.each(act.dep.update)
]);


act.publish = fm.script([

]);



/**
 * @type {app.Action}
 */
var main = fm.script([
  act.scheme.load,
  act.cli.read,
  act.invoke
]);


main(SCHEME_FILE_NAME, nop, console.log);
