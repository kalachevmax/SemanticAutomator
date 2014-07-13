

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.gcc.invoke = function(complete, cancel) {
  var command = dm.get('gcc.command');
  var args = dm.get('gcc.args');
  console.log(command + args);
  act.proc.exec(command + args)(complete, cancel, {});
};
