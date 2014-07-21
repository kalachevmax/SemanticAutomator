

/**
 * @type {fm.Action}
 */
app.act.gcc.invoke = fm.script([
  dm.provide(dm.str('gcc.args'), dm.str('gcc.command')),
  dm.act.str.concat,
  act.proc.exec
]);
