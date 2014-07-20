

/**
 * @type {fm.Action}
 */
app.act.cmd.invoke = fm.script([
  dm.str('cmd.name'),
  dm.do.action(app.act.cmd),
  app.act.cmd.message.show
]);


/**
 * @type {fm.Action}
 */
app.act.cmd.make = fm.script([
  dm.entity('scheme'),
  app.act.scheme.get.modules,

  fm.each(fm.script([
    dm.set.entity('module'),

    dm.provide(dm.entity('scheme'), dm.entity('module')),
    app.act.gcc.set.args,

    dm.set.str('gcc.args'),
    app.act.gcc.invoke
  ]))
]);


/**
 * @type {fm.Action}
 */
app.act.cmd.update = fm.script([
  fm.arg.str('deps.dir'),

  fm.if(act.fs.node.exists, act.fs.dir.remove),
  act.fs.dir.create,

  app.act.scheme.get('deps'),

  fm.each(fm.script([
    dm.set.entity('dep'),
    app.act.dep.update
  ]))
]);


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.publish = fm.script([

]);
