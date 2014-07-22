

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.git.command.clone = function(complete, cancel, data) {
  complete('git clone ' + data.get('repo') + ' ' +
      data.get('depsDir') + '/' + data.get('name'));
};
