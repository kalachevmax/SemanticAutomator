

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.gcc.set.args.src = function(complete, cancel, data) {
  var srcDir = data.get('scheme.srcDir');
  var rootNamespace = data.get('scheme.rootNamespace');
  var filenames = data.get('module.src');

  var args = '';

  var i = 0,
      l = filenames.length;

  while (i < l) {
    args += ' --js ' + path.join(srcDir, rootNamespace, filenames[i]);
    i += 1;
  }

  data.set('args', args);
  complete(data);
};


/**
 * @return {fm.Action}
 */
app.act.gcc.set.args.deps = fm.script([
  dm.arg.provider('data'),

  dm.provider.get('scheme.depsDir'),
  act.fs.dir.get.nested,

  fm.each(fm.script([
    app.act.dep.getExternsDir,
    act.fs.tree.read
  ])),

  app.act.gcc.generateArgs,
  dm.provider.add('data', 'args')
]);


/**
 * @param {function(!dm.DataProvider)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.gcc.set.args.options = function(complete, cancel, data) {
  var scheme = data.get('scheme');
  var module = data.get('module');

  var options = scheme.get('compilerOptions');
  var buildDir = scheme.get('buildDir');
  var moduleName = module.get('name');

  var args = data.get('args');

  args += ' --js_output_file ' +
      path.join(buildDir, moduleName || 'app') + '.js';

  args += ' --compilation_level ' +
      (options['compilationLevel'] || 'WHITESPACE_ONLY');

  args += ' --warning_level=' +
      (options['warningLevel'] || 'VERBOSE');

  args += ' --language_in=' +
      (options['language'] || 'ECMASCRIPT5');

  if (options['formatting'] !== '') {
    args += ' --formatting=' + options['formatting'];
  }

  data.set('args', args);
  complete(data);
};
