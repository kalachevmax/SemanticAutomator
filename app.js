

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
app.act.module = {};


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
var utils = {};


/**
 * @namespace
 */
utils.obj = {};


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
 * @typedef {*}
 */
fm.Input;


/**
 * @typedef {function(!Function, !Function, fm.Input=)}
 */
fm.Action;


/**
 * @typedef {!Object}
 */
app.Module;


/**
 * @type {!Function}
 */
utils.nop = function() {};


/**
 * @param {!Object} base
 * @param {!Object} obj
 * @return {!Object}
 */
utils.obj.extend = function(base, obj) {
  for (var key in obj) {
    base[key] = obj[key];
  }

  return base;
};


/**
 * @type {!Object.<string, fm.Input>}
 */
fm.__dm = {};


/**
 * @param {string} key
 * @param {fm.Input} value
 */
fm.set = function(key, value) {
  fm.__dm[key] = value;
};


/**
 * @param {string} key
 * @param {string} opt_subkey
 * @return {fm.Input}
 */
fm.get = function(key, opt_subkey) {
  if (fm.__dm[key] instanceof Object) {
    return fm.__dm[key][opt_subkey] || null;
  } else {
    return fm.__dm[key] || null;
  }
};


/**
 * @param {string} key
 * @param {fm.Input=} opt_value
 * @return {fm.Action}
 */
fm.assign = function(key, opt_value) {
  /**
   * @param {fm.Input} input
   * @param {function(fm.Input)} complete
   * @param {function(string, number=)} cancel
   */
  return function(input, complete, cancel) {
    fm.__dm[key] = opt_value || input;
    complete(input);
  }
};


/**
 * @param {string} key
 * @param {string} subkeyOrType
 * @param {string|!Function} type
 */
fm.assert = function(key, subkeyOrType, type) {
  var argsCount = arguments.length;

  return function(complete, cancel) {
    function check(isPrimitive, key, type, opt_subkey) {
      var obj = fm.__dm;

      if (opt_subkey) {
        obj = fm.__dm[key];
        key = opt_subkey;
      }

      if (isPrimitive) {
        return typeof obj[key] === type;
      } else {
        return obj[key] instanceof type;
      }
    }

    function getTypeMessage(type) {
      if (typeof type === 'string') {
        return type;
      }

      if (type instanceof Array) {
        return 'Array';
      }

      if (type instanceof Object) {
        return 'Object';
      }

      if (type instanceof RegExp) {
        return 'RegExp';
      }

      if (type instanceof Date) {
        return 'Date';
      }

      return type;
    }

    if (argsCount === 2) {
      if (check(typeof subkeyOrType === 'string', key, subkeyOrType)) {
        complete();
      } else {
        cancel('[fm.assert] parameter ' + key + ' must be of type ' +
            getTypeMessage(subkeyOrType));
      }
    } else {
      if (check(false, key, Object)) {
        if (check(typeof type === 'string', key, type, subkeyOrType)) {
          complete();
        } else {
          cancel('[fm.assert] parameter ' + key + '[' + subkeyOrType + ']' +
              ' must be of type ' + getTypeMessage(type));
        }
      } else {
        cancel('[fm.assert] parameter ' + key + ' must be of type ' +
            getTypeMessage(Object));
      }
    }
  }
};


/**
 * @param {!Array.<fm.Action>} actions
 * @return {fm.Action}
 */
fm.script = function(actions) {
  return function(complete, cancel, opt_input) {
    var localActions = actions.slice(0);

    function process(action, accumulator) {
      action(handleAction, cancel, accumulator);
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

    fold(opt_input);
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
 * @param {string} key
 * @return {fm.Action}
 */
app.act.scheme.get = function(key) {
  var scheme = fm.get('scheme');

  /**
   * @param {function()} complete
   * @param {function(string, number=)} cancel
   */
  function get(complete, cancel) {
    if (scheme[key] instanceof Object) {
      complete();
    } else {
      cancel('[app.act.scheme.get] missing ' + key + ' section');
    }
  }

  return get;
};


/**
 * @param {string} key
 * @return {fm.Action}
 */
app.act.scheme.load = function(key) {
  var filename = fm.get(key) || '';

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
      item = utils.obj.extend(item, obj[name]);
    } else if (typeof obj[name] === 'string') {
      item.type = 'git';
      item.repo = obj[name];
    }

    result.push(item);
  }

  return result;
};


/**
 * @param {string} key
 * @return {fm.Action}
 */
app.act.gcc.set = function(key) {
  /**
   * @param {function()} complete
   * @param {function(string, number=)} cancel
   */
  function nop(complete, cancel) {
    complete();
  }

  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  function setArgs(complete, cancel) {
    fm.script([
      fm.assert('scheme', 'srcDir', 'string'),
      fm.assert('scheme', 'rootNamespace', 'string'),
      fm.assert('module', 'src', Array),
      fm.assert('externs.node.dir', 'string'),
      fm.assert('externs.dir', 'string'),
      fm.assert('scheme', 'compilerOptions', 'string'),
      fm.assert('scheme', 'buildDir', 'string'),
      fm.assert('module', 'name', 'string'),

      generateSrcArgs,
      generateExternsArgs(externsNodeDir),
      generateExternsArgs(externsAppDir),
      generateOptionsArgs,
    ])(function(args) {
      fm.set('gcc.args', args);
      complete(args);
    }, cancel, '');
  }

  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   * @param {string} args
   */
  function generateSrcArgs(complete, cancel, args) {
    var srcDir = fm.get('scheme', 'srcDir');
    var rootNamespace = fm.get('scheme', 'rootNamespace');
    var filesnames = fm.get('module', 'src');

    var i = 0,
        l = filenames.length;

    while (i < l) {
      args += ' --js ' + path.join(srcDir, rootNamespace, filenames[i]);
      i += 1;
    }

    complete(args);
  }


  /**
   * @param {string} dir
   * @return {fm.Action}
   */
  function generateExternsArgs(dir) {
    return function(complete, cancel, args) {
      act.fs.readFilesTree(dir, handleReaded, cancel);

      function handleReaded(filenames) {
        var i = 0,
            l = filenames.length;

        while (i < l) {
          args += ' --externs ' + filenames[i];
          i += 1;
        }

        complete(args);
      }
    }
  }


  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   * @param {string} args
   */
  function generateOptionsArgs(complete, cancel, args) {
    args += ' --js_output_file ' + path.join(buildDir, moduleName || 'app') + '.js';
    args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
    args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
    args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

    if (options['formatting'] !== '') {
      args += ' --formatting=' + options['formatting'];
    }

    complete(args);
  }

  return key === 'args' ? setArgs : nop;
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.gcc.invoke = function(complete, cancel) {
  var command = fm.get('gcc.command');
  var args = fm.get('gcc.args');
  act.proc.exec(command + args)({}, complete, cancel);
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
 * @type {!Function}
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
  cmd[name](function() {
    console.log(cmd.MESSAGES[name]);
    complete();
  }, cancel);
};


cmd.MESSAGES = {
  make: 'The application has been successfully built'
};


cmd.make = fm.script([
  app.act.scheme.get('externs'),
  fm.assign('externs.dir'),

  app.act.scheme.get('modules'),

  fm.each(fm.script([
    fm.assign('module'),
    app.act.module.set('args')('scheme'),
    app.act.module.make
  ]))
]);


cmd.update = fm.script([
  app.act.scheme.get('deps'),
  fm.each(fm.script([
    fm.assign('dep'),
    app.act.dep.update
  ]))
]);


cmd.act.publish = fm.script([

]);


/**
 * @type {fm.Action}
 */
app.setup = fm.script([
  fm.assign('scheme.filename', SCHEME_FILE_NAME),
  fm.assign('node.externs.dir', NODE_EXTERNS_DIR),
  fm.assign('gcc.command', GCC_COMMAND),
  fm.assign('deps.dir', DEPS_DIR)
]);


/**
 * @type {fm.Action}
 */
app.main = fm.script([
  app.setup,

  app.act.scheme.load('scheme.filename'),
  fm.assign('scheme'),

  app.act.cli.read,
  fm.assign('action.name'),

  app.act.cmd.invoke
]);


app.main(utils.nop, console.log);
