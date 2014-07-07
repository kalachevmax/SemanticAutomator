

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.dep.update = function(complete, cancel) {
  var dep = dm.get('dep');

  if (dep['type'] === 'git') {
    app.act.git.clone(complete, cancel)
  } else {
    complete();
  }
};
