

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.git.clone = function(complete, cancel) {
  var depsDir = dm.get('deps.dir');
  var repo = dm.get('dep.repo');
  var name = dm.get('dep.name');

  act.proc.exec('git clone ' + repo + ' ' + depsDir + '/' + name)(complete, cancel, {});
};
