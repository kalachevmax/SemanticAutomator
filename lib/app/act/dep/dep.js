

/**
 * @type {fm.Action}
 */
app.act.dep.update = fm.script([
  dm.entity('dep'),
  dm.act.entity.get('type'),
  dm.if(dm.eq('git'), app.act.git.clone)
]);
