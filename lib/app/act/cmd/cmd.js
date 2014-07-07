

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.invoke = function(complete, cancel) {
  var name = dm.get('action.name');

  cmd[name](function() {
    console.log(cmd.MESSAGES[name]);
    complete();
  }, cancel);
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.cmd.make = function(complete, cancel) {
  fm.script([
    app.act.scheme.get('modules'),

    fm.each(fm.script([
      dm.assign('module'),
      app.act.gcc.set('args'),
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
