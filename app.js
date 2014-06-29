

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


app.log = function(message) {
  return function(complete, cancel, input) {
    console.log(message);
    complete(input);
  }
};


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
 * @param {string=} opt_subkey
 * @return {fm.Input}
 */
fm.get = function(key, opt_subkey) {
  if (opt_subkey) {
    if (fm.__dm[key] instanceof Object) {
      return fm.__dm[key][opt_subkey] || null;
    }
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
   * @param {function(fm.Input)} complete
   * @param {function(string, number=)} cancel
   * @param {fm.Input=} opt_input
   */
  return function(complete, cancel, opt_input) {
    fm.__dm[key] = opt_value || opt_input;
    complete(opt_input);
  }
};


/**
 * @param {string} key
 * @param {string} subkeyOrType
 * @param {*} type
 */
fm.assert = function(key, subkeyOrType, type) {
  var argsCount = arguments.length;

  return function(complete, cancel, opt_input) {
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
        complete(opt_input);
      } else {
        cancel('[fm.assert] parameter ' + key + ' must be of type ' +
            getTypeMessage(subkeyOrType));
      }
    } else {
      if (check(false, key, Object)) {
        if (check(typeof type === 'string', key, type, subkeyOrType)) {
          complete(opt_input);
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
  return function(complete, cancel, list) {
    var localList = list.slice(0);

    function process(item) {
      action(fold, cancel, item);
    }

    function fold() {
      if (localList.length > 0) {
        process(localList.shift());
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
  return function(complete, cancel, atom) {
    action(function(result) {
      if (result) {
        trueBranch(complete, cancel, atom);
      } else {
        if (typeof opt_falseBranch === 'function') {
          opt_falseBranch(complete, cancel, atom);
        } else {
          complete(atom);
        }
      }
    }, cancel, atom);
  }
};


/**
 * @param {!Object=} opt_options
 * @return {fm.Action}
 */
act.fs.readFile = function(opt_options) {
  return function(complete, cancel, filename) {
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
 * @param {function(boolean)} complete
 * @param {function(string, number=)} cancel
 * @param {string} itemPath
 */
act.fs.isDirectory = function(complete, cancel, itemPath) {
  fs.stat(itemPath, function(err, stats) {
    if (err) {
      cancel('Error reading directory item:' + err.toString());
    } else {
      complete(stats && stats.isDirectory());
    }
  });
};


/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {string} dirPath
 */
act.fs.readDir = function(complete, cancel, dirPath) {
  fs.readdir(dirPath, function(err, items) {
    if (err) {
      cancel('Error reading directory :' + err.toString());
    } else {
      complete(items);
    }
  });
};


/**
 * @param {function(!Array.<string>)} complete
 * @param {function(string, number=)} cancel
 * @param {string} dirPath
 */
act.fs.readFilesTree = function(complete, cancel, dirPath) {
  var fullPath = [];
  var files = [];

  function enterDir(dirPath) {
    return function (complete, cancel, fullDirPath) {
      fullPath.push(dirPath);
      complete(fullDirPath);
    }
  }

  function leaveDir(complete, cancel) {
    fullPath.pop();
    complete();
  }

  function addFile(complete, cancel, file) {
    files.push(file);
    complete();
  }

  function processDir(complete, cancel, dirPath) {
    fm.script([
      act.fs.readDir,
      fm.each(processItem),
      leaveDir
    ])(complete, cancel, dirPath);
  }

  function processItem(complete, cancel, item) {
    var fullItemPath = path.join(fullPath.join('/'), item);

    fm.script([
      fm.if(act.fs.isDirectory, fm.script([
        enterDir(item),
        processDir
      ]), addFile)
    ])(complete, cancel, fullItemPath);
  }

  fm.script([
    enterDir(dirPath),
    processDir
  ])(function() {
    complete(files);
  }, cancel, dirPath);
};


/**
 * @param {string} command
 * @return {fm.Action}
 */
act.proc.exec = function(command) {
  return function(complete, cancel, opt_options) {
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
   * @param {function(fm.Input)} complete
   * @param {function(string, number=)} cancel
   */
  function get(complete, cancel) {
    if (typeof scheme[key] !== 'undefined') {
      complete(scheme[key]);
    } else {
      cancel('[app.act.scheme.get] missing ' + key + ' section');
    }
  }

  return get;
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 */
app.act.scheme.load = function(complete, cancel) {
  var filename = fm.get('scheme.filename');

  act.fs.readFile({encoding: 'utf-8'})(function(file) {
    var content = null;

    try {
      content = JSON.parse(file);
    } catch (error) {
    }

    if (content !== null) {
      complete(content);
    } else {
      cancel('[app.act.scheme.load] parsing error: ' + error.toString());
    }

  }, cancel, filename);
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 * @param {app.Scheme} scheme
 */
app.act.scheme.transformModules = function(complete, cancel, scheme) {
  var result = [];
  var modules = scheme['modules'];

  for (var name in modules) {
    result.push({
      name: name,
      src: modules[name]['src']
    });
  }

  scheme['modules'] = result;
  complete(scheme);
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 * @param {app.Scheme} scheme
 */
app.act.scheme.transformDeps = function(complete, cancel, scheme) {
  var result = [];
  var deps = scheme['deps'];

  for (var name in deps) {
    var item = {
      name: name
    };

    if (deps[name] instanceof Object) {
      item = utils.obj.extend(item, deps[name]);
    } else if (typeof deps[name] === 'string') {
      item.type = 'git';
      item.repo = deps[name];
    }

    result.push(item);
  }

  scheme['deps'] = result;
  complete(scheme);
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 * @param {app.Scheme} scheme
 */
app.act.scheme.transform = function(complete, cancel, scheme) {
  fm.script([
    app.act.scheme.transformModules,
    app.act.scheme.transformDeps
  ])(complete, cancel, scheme);
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
      fm.assert('scheme', 'externs', 'string'),
      fm.assert('scheme', 'compilerOptions', Object),
      fm.assert('scheme', 'buildDir', 'string'),
      fm.assert('module', 'name', 'string'),

      generateSrcArgs,
      generateExternsArgs(fm.get('externs.node.dir')),
      generateExternsArgs(fm.get('scheme', 'externs')),
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
    var filenames = fm.get('module', 'src');

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
      act.fs.readFilesTree(handleReaded, cancel, dir);

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
    var options = fm.get('scheme', 'compilerOptions');
    var buildDir = fm.get('scheme', 'buildDir');
    var moduleName = fm.get('module', 'name');

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
  console.log(command + args);
  act.proc.exec(command + args)(complete, cancel, {});
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.dep.update = function(complete, cancel) {
  var dep = fm.get('dep');

  if (dep['type'] === 'git') {
    app.act.git.clone(complete, cancel)
  } else {
    complete();
  }
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.git.clone = function(complete, cancel) {
  var depsDir = fm.get('deps.dir');
  var repo = fm.get('dep', 'repo');
  var name = fm.get('dep', 'name');

  act.proc.exec('git clone ' + repo + ' ' + depsDir + '/' + name)(complete, cancel, {});
};


/**
 * @type {!Function}
 */
app.usage = function() {
  console.log('usage: app action');
  console.log('action = make|update|publish');
};


/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 */
app.act.cli.read = function(complete, cancel) {
  if (process.argv.length === 2 || typeof cmd[process.argv[2]] === 'function') {
    complete(process.argv[2] || 'make');
  } else {
    app.usage();
    cancel('');
  }
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.invoke = function(complete, cancel) {
  var name = fm.get('action.name');

  cmd[name](function() {
    console.log(cmd.MESSAGES[name]);
    complete();
  }, cancel);
};


cmd.MESSAGES = {
  make: 'The application has been successfully built'
};


cmd.make = function(complete, cancel) {
  fm.script([
    app.act.scheme.get('modules'),

    fm.each(fm.script([
      fm.assign('module'),
      app.act.gcc.set('args'),
      app.act.gcc.invoke
    ]))
  ])(complete, cancel);
};


cmd.update = function(complete, cancel) {
  fm.script([
    app.act.scheme.get('deps'),

    fm.each(fm.script([
      fm.assign('dep'),
      app.act.dep.update
    ]))
  ])(complete, cancel);
};


cmd.publish = fm.script([

]);


/**
 */
app.setup = fm.script([
  fm.assign('scheme.filename', SCHEME_FILE_NAME),
  fm.assign('externs.node.dir', NODE_EXTERNS_DIR),
  fm.assign('gcc.command', GCC_COMMAND),
  fm.assign('deps.dir', DEPS_DIR)
]);


/**
 * @type {fm.Action}
 */
app.main = fm.script([
  app.setup,

  app.act.scheme.load,
  fm.assign('scheme'),

  fm.assert('scheme', 'modules', Object),
  fm.assert('scheme', 'deps', Object),

  app.act.scheme.transform,
  fm.assign('scheme'),

  app.act.cli.read,
  fm.assign('action.name'),

  app.act.cmd.invoke
]);


app.main(utils.nop, console.log);
