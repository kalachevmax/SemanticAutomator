

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.git.make.command.clone = function(complete, cancel, data) {
  complete('git clone ' + data.get('dep.repo') + ' ' +
      data.get('entity.depsDir') + '/' + data.get('dep.name'));
};
