

var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var acts = require('acts.js')
var fm = {};


/**
 * @namespace
 */
var app = {};


/**
 * @namespace
 */
app.acts = {};


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
 * @type {string}
 */
app.COMPILER_PATH = '/opt/closure-compiler.jar';


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

  var options = scheme['compilerOptions'];

  args += ' --js_output_file ' + path.join(scheme['buildDir'], scheme['buildFileName']);
  args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
  args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
  args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

  if (options['formatting'] !== '') {
    args += ' --formatting=' + options['formatting'];
  }

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
      cancel();
    }
  }

  childProcess.exec('java -jar ' + app.COMPILER_PATH + args, handleCompleted);
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
  console.log('action = make|update|publish');
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
