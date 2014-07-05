

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.git.clone = function(complete, cancel) {
  var depsDir = fm.get('deps.dir');
  var repo = fm.get('dep', 'repo');
  var name = fm.get('dep', 'name');

  act.proc.exec('git clone ' + repo + ' ' + depsDir + '/' + name)(complete, cancel, {});
};
