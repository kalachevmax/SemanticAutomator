

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.invoke = fm.script([
  dm.str('cmd.name'),
  dm.do.action(app.act.cmd),
  app.act.cmd.message.show
]);


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.make = function(complete, cancel) {
  fm.script([
    dm.entity('scheme'),
    app.act.scheme.get.modules,

    fm.each(fm.script([
      dm.set.entity('module'),

      dm.provide(dm.entity('scheme'), dm.entity('module')),
      app.act.gcc.set.args,

      dm.set.atom('gcc.args'),
      app.act.gcc.invoke
    ]))
  ])(complete, cancel);
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.update = function(complete, cancel) {
  fm.script([
    fm.if(act.fs.item.exists, act.fs.dir.remove),
    act.fs.dir.create,

    app.act.scheme.get('deps'),

    fm.each(fm.script([
      dm.assign('dep'),
      app.act.dep.update
    ]))
  ])(complete, cancel, dm.get('deps.dir'));
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.publish = fm.script([

]);
