

/**
 * @type {fm.Action}
 */
app.act.dep.update = fm.script([
  dm.get.entity('dep'),
  dm.entity.get('type'),
  fm.if(dm.eq('git'), app.act.git.clone)
]);


/**
 * @param {string} name
 * @return {fm.Action}
 */
app.act.dep.get = function(name) {
  var entity = dm.entity('dep');

  /**
   * @param {function(dm.AtomValue)} complete
   * @param {function(string, number=)} cancel
   * @param {fm.Input} input
   */
  function get(complete, cancel, input) {
    switch (name) {
      case 'name':
        complete(entity.get('name'));
        break;

      case 'repo':
        complete(entity.get('repo'));
        break;

      default:
        complete(null);
    }
  }

  return get;
};
