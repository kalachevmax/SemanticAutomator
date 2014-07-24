

/**
 * @type {fm.Action}
 */
app.act.dep.update = fm.script([
  fm.if(dm.eq('dep.type', 'git'), app.act.git.clone)
]);
