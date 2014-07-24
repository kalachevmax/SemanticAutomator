

/**
 * @type {fm.Action}
 */
app.act.dep.update = fm.script([
  fm.if(dm.eq('dep.type', 'git'), app.act.git.clone)
]);


/**
 * @type {fm.Action}
 */
app.act.dep.getExternsDir = fm.script([
  dm.provide(dm.arg.str('depPath'), dm.field('scheme.externsDir')),
  act.path.join
]);
