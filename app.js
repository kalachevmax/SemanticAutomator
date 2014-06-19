

var app = {};
var fs = require('fs');


/**
 * @type {string}
 */
app.SCHEME_FILE_NAME = 'scheme.json';


/**
 * @type {Object}
 */
app.__scheme = null;


app.make = function() {
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
