

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
app.act.gcc.set.args.deps = function() {
  return function(complete, cancel, data) {
    var externsDir = data.get('scheme.externsDir');
    var args = data.get('args');

    dm.func('getDepExternsDir', function(depPath) {
      return path.join(depPath, externsDir);
    });

    fm.script([
      dm.use(data.get('scheme.depsDir')),
      act.fs.getSubDirs,

      fm.each(fm.script([
        dm.invoke.func('getDepExternsDir'),
        act.fs.readFilesTree
      ]))
    ])(function(filenames) {
      data.set('args', generateArgsBy(filenames));
      complete(data);
    }, cancel);


    /**
     * @param {!Array.<string>} filenames
     * @return {string}
     */
    function generateArgsBy(filenames) {
      var i = 0,
          l = filenames.length;

      while (i < l) {
        args += ' --externs ' + filenames[i];
        i += 1;
      }

      return args;
    }
  }
};


/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.gcc.set.args.options = function(complete, cancel, data) {
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
