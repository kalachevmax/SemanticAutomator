

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
app.act = {};


/**
 * @namespace
 */
app.act.cli = {};


/**
 * @namespace
 */
app.act.gcc = {};


/**
 * @namespace
 */
app.act.git = {};


/**
 * @namespace
 */
app.act.scheme = {};


/**
 * @namespace
 */
app.act.dep = {};


/**
 * @namespace
 */
app.act.cmd = {};


/**
 * @namespace
 */
var cmd = {};


/**
 * @namespace
 */
var fm = {};


/**
 * @namespace
 */
var dm = {};


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
act.proc = {};


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
var GCC_COMMAND = 'java -jar ' + COMPILER_PATH;


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @typedef {function(*, !Function, !Function)}
 */
fm.Action;


/**
 * @typedef {*}
 */
fm.Input;


/**
 * @typedef {!Object}
 */
app.Module;


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
 * @type {!Object.<string, fm.Input>}
 */
dm.__db = {};


/**
 * @param {string} key
 * @param {fm.Input} value
 */
dm.const = function(key, value) {
  dm.__db[key] = value;
};


/**
 * @param {string} key
 * @return {fm.Input}
 */
dm.get = function(key) {
  return dm.__db[key] || null;
};


/**
 * @param {string} key
 * @return {fm.Action}
 */
dm.set = function(key) {
  /**
   * @param {fm.Input} input
   * @param {function(fm.Input)} complete
   * @param {function(string, number=)} cancel
   */
  return function(value, complete, cancel) {
    dm.__db[key] = value;
    complete(value);
  }
};


/**
 * @param {!Array.<fm.Action>} actions
 * @return {fm.Action}
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
 * @param {fm.Action} action
 * @return {fm.Action}
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
 * @param {fm.Action} action
 * @param {fm.Action} trueBranch
 * @param {fm.Action=} opt_falseBranch
 * @return {fm.Action}
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
 * @return {fm.Action}
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
 * @param {string} schemeKey
 * @param {string} moduleKey
 * @return {fm.Action}
 */
app.act.gcc.makeSrcArgs = function(schemeKey, moduleKey) {
  var scheme = dm.get(schemeKey) || {};
  var module = dm.get(moduleKey) || {};

  /**
   * @param {string} args
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  return function(args, complete, cancel) {
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
 * @param {string} externsDirKey
 * @return {fm.Action}
 */
app.act.gcc.makeExternsArgs = function(externsDirKey) {
  var externsDir = dm.get(externsDirKey) || '';

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
 * @param {string} schemeKey
 * @param {string} moduleKey
 * @return {fm.Action}
 */
app.act.gcc.makeOptionsArgs = function(schemeKey, moduleKey) {
  var scheme = dm.get(schemeKey) || {};
  var module = dm.get(moduleKey) || {};

  /**
   * @param {string} args
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  return function(args, complete, cancel) {
    var options = scheme['compilerOptions'];

    args += ' --js_output_file ' + path.join(scheme['buildDir'], module['name'] || 'app') + '.js';
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
app.act.gcc.invoke = function(args, complete, cancel) {
  act.proc.exec(GCC + args)({}, complete, cancel);
};


/**
 * @param {*} _
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
app.act.gcc.makeArgs = function(_, complete, cancel) {
  fm.script([
    act.gcc.makeSrcArgs('scheme', 'currentModule'),
    act.gcc.makeExternsArgs('nodeExternsDir'),
    act.gcc.makeExternsArgs('externsDir'),
    act.gcc.makeOptionsArgs('scheme', 'currentModule')
  ])('', complete, cancel);
};


/**
 * @param {string} key
 * @return {fm.Action}
 */
app.act.scheme.load = function(key) {
  var filename = dm.get(key) || '';

  /**
   * @param {string} filename
   * @param {function(app.Scheme)} complete
   * @param {function(string, number=)} cancel
   */
  return function(_, complete, cancel) {
    act.fs.readFile({encoding: 'utf-8'})(filename, function (file) {
      try {
        complete(JSON.parse(file));
      } catch (error) {
        cancel('[app.act.scheme.load] parsing error: ' + error.toString());
      }
    }, cancel);
  }
};


/**
 * @param {string} key
 * @return {fm.Action}
 */
app.act.scheme.getModules = function(key) {
  var scheme = dm.get(key);

  /**
   * @param {*} _
   * @param {function(!Array.<app.Module>)} complete
   * @param {function(string, number=)} cancel
   */
  return function(_, complete, cancel) {
    if (scheme['modules'] instanceof Array) {
      complete(scheme['modules']);
    } else {
      cancel('[act.scheme.getModules] missing modules section');
    }
  }
};


/**
 * @param {!Object.<string, !Object>} obj
 * @return {!Array.<!Object>}
 */
app.act.scheme.__depsToArray = function(obj) {
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
app.act.scheme.getDeps = function(scheme, complete, cancel) {
  if (scheme['deps'] instanceof Object) {
    complete(app.act.scheme.__depsToArray(scheme['deps']));
  } else {
    cancel('[act.scheme.getDeps] missing deps section');
  }
};


/**
 * @param {!Object} dep
 * @param {function(!Object)} complete
 * @param {function(string, number=)} cancel
 */
app.act.dep.update = function(dep, complete, cancel) {
  if (dep['name'] === 'git') {
    app.act.git.clone(dep['repo'], complete, cancel)
  }
};


/**
 * @param {string} repo
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.git.clone = function(repo, complete, cancel) {
  act.proc.exec('git clone ' + repo + DEPS_DIR)({}, complete, cancel);
};


/**
 *
 */
app.usage = function() {
  console.log('usage: app action');
  console.log('action = make|update|publish');
};


/**
 * @param {app.Scheme} scheme
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
app.act.cli.read = function(scheme, complete, cancel) {
  if (process.argv.length === 2 || typeof act[process.argv[2]] === 'function') {
    complete(process.argv[2] || 'make');
  } else {
    app.usage();
    cancel('');
  }
};


/**
 * @param {string} name
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.invoke = function(name, complete, cancel) {
  cmd[name](null, function() {
    console.log(cmd.MESSAGES[name]);
    complete();
  }, cancel);
};


cmd.MESSAGES = {
  make: 'The application has been successfully built'
};


cmd.make = fm.script([
  app.act.get('node.externs.dir'),
  dm.set('node.externs.dir'),

  app.act.scheme.get('externs'),
  dm.set('externs.dir'),

  app.act.scheme.getModules('scheme'),

  fm.each(fm.script([
    dm.set('module.current'),
    app.act.gcc.makeArgs,
    app.act.gcc.invoke
  ]))
]);


cmd.update = fm.script([
  app.act.scheme.getDeps,
  fm.each(fm.script([
    dm.set('dep.current'),
    app.act.dep.update
  ]))
]);


cmd.act.publish = fm.script([

]);


/**
 * @type {fm.Action}
 */
app.setup = fm.script([
  dm.const('scheme.filename', SCHEME_FILE_NAME),
  dm.const('node.externs.dir', NODE_EXTERNS_DIR),
  dm.const('gcc.command', GCC_COMMAND),
  dm.const('deps.dir', DEPS_DIR)
]);


/**
 * @type {fm.Action}
 */
app.main = fm.script([
  app.setup,

  app.act.scheme.load('scheme.filename'),
  dm.set('scheme'),

  app.act.cli.read,
  dm.set('action.name'),

  app.act.cmd.invoke
]);


app.main('', nop, console.log);
