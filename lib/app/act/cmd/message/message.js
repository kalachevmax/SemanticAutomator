

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {string} cmdName
 */
app.act.cmd.message.get = function(complete, cancel, cmdName) {
  var message = '';

  switch (cmdName) {
    case 'make':
      message = 'The application has been successfully built';
      break;
  }

  complete(message);
};


/**
 * @type {fm.Action}
 */
app.act.cmd.message.show = fm.script([
  app.arg.str('cmd.name'),
  app.act.cmd.message.get,
  fm.console.log
]);
