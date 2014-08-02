

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
 * @type {fm.Action}
 */
app.act.gcc.set.args.options = fm.script([
  dm.arg.entity('scheme'),
  dm.arg.entity('module'),
  dm.arg.str('args'),

  dm.args(
    dm.use(' --js_output_file '),

    dm.args(
      dm.field('scheme.buidlDir'),
      dm.field('module.name', 'app')
    ),
    act.fs.path.join,

    dm.use('.js')
  ),
  dm.act.str.join
]);

/*
  var options = data.get('scheme.compilerOptions');
  var buildDir = data.get('scheme.buildDir');
  var moduleName = data.get('module.name');

  var args = data.get('args');

  args += ' --js_output_file ' + path.join(buildDir, moduleName || 'app') + '.js';
  args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
  args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
  args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

  if (options['formatting'] !== '') {
    args += ' --formatting=' + options['formatting'];
  }

  data.set('args', args);
  complete(data);
};
*/
