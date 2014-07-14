

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {dm.DataProvider} data
 */
app.act.gcc.set.args = function(complete, cancel, data) {
  fm.script([
    app.act.gcc.set.args.src,
    app.act.gcc.set.args.externs,
    app.act.gcc.set.args.deps,
    app.act.gcc.set.args.options
  ])(function (args) {
    data.set('args', args);
    complete(data);
  }, cancel);
};
