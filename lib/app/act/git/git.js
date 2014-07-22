

/**
 * @type {fm.Action}
 */
app.act.git.clone = fm.script([
  dm.provide(dm.dep.get('repo'), dm.scheme.get('deps.dir'), dm.dep.get('name')),
  app.act.git.command.clone,
  act.proc.exec
]);
