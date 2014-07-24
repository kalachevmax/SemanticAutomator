

/**
 * @type {fm.Action}
 */
app.act.gcc.invoke = fm.script([
  dm.provide(dm.str('gcc.command'), dm.str('gcc.args')),
  dm.act.str.concat(' '),
  act.proc.exec
]);


/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!Array.<string>} filenames
 */
app.act.gcc.generateArgs = function(complete, cancel, filenames) {
  var args = '';
  var i = 0,
      l = filenames.length;

  while (i < l) {
    args += ' --externs ' + filenames[i];
    i += 1;
  }

  complete(args);
};
