

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.Entity} gcc
 */
app.act.gcc.invoke = function(complete, cancel, gcc) {
  var command = gcc.get('command');
  var args = gcc.get('args');
  console.log(command + args);
  act.proc.exec(command + args)(complete, cancel, {});
};
