

/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.dep.update = function(complete, cancel) {
  var dep = fm.get('dep');

  if (dep['type'] === 'git') {
    app.act.git.clone(complete, cancel)
  } else {
    complete();
  }
};
