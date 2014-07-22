

/**
 * @type {fm.Action}
 */
app.act.gcc.invoke = fm.script([
  dm.provide(dm.str('gcc.command'), dm.str('gcc.args')),
  dm.act.str.concat(' '),
  act.proc.exec
]);
