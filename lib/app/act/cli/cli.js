

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
