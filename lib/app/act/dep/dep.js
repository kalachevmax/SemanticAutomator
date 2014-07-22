

/**
 * @type {fm.Action}
 */
app.act.dep.update = fm.script([
  dm.field('dep.type'),
  fm.if(dm.eq('git'), app.act.git.clone)
]);
