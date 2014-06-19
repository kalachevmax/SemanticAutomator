

app = {};


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


app.usage = function() {
  console.log('usage: app action');
  console.log('action = make|update|publish|check|compile|lint');
};


app.handleInput = function() {
  if (process.argv.length > 2) {
    if (typeof app[process.argv[2]] === 'function') {
      app[process.argv[2]]();
    } else {
      app.usage();
    }
  } else {
    app.make();
  }
};


app.handleInput();
