

/**
 * @type {fm.Action}
 */
app.act.gcc.set.args = fm.script([
  dm.arg.provider('data'),

  app.act.gcc.set.args.src,
  app.act.gcc.set.args.externs,
  app.act.gcc.set.args.deps,
  app.act.gcc.set.args.options,

  dm.ret.str('gcc.args')
]);
