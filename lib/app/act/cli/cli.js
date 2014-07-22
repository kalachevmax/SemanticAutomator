

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!Array.<string>} args
 */
app.act.cli.read = function(complete, cancel, args) {
  if (args.length === 2 || typeof app.act.cmd[args[2]] === 'function') {
    complete(args[2] || 'make');
  } else {
    app.usage();
    cancel('');
  }
};
