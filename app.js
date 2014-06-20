

var app = {};
var fs = require('fs');


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @typedef {function(*, !Function, !Function)}
 */
Action;


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
 * @param {!Array.<Action>} actions
 * @return {Action}
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
 * @param {app.Scheme} scheme
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function loadFilesList(scheme, complete, cancel) {

}


/**
 * @param {!Array.<string>} files
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function makeCompilerArgs(files, complete, cancel) {

}


/**
 * @param {String} args
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function invokeCompiler(args, complete, cancel) {

}


/**
 * @param {*} result
 * @param {!Function} complete
 * @param {!Function} cancel
 */
function handleCompilerResult(result, complete, cancel) {

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
