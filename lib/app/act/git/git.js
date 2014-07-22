

/**
 * @type {fm.Action}
 */
app.act.git.clone = fm.script([
  dm.provide(
    dm.field('dep.name'),
    dm.field('dep.repo'),
    dm.field('entity.depsDir')
  ),

  app.act.git.make.command.clone,
  act.proc.exec
]);
