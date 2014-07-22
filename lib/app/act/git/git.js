

/**
 * @type {fm.Action}
 */
app.act.git.clone = fm.script([
  dm.provide(
      app.act.dep.get('repo'),
      app.act.scheme.get('deps.dir'),
      app.act.dep.get('name')
  ),

  app.act.git.command.clone,
  act.proc.exec
]);
