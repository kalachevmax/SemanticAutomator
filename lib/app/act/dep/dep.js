

/**
 * @type {fm.Action}
 */
app.act.dep.update = fm.script([
  dm.get.entity('dep'),
  dm.entity.get('type'),
  fm.if(dm.eq('git'), app.act.git.clone)
]);
