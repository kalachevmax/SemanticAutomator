

/**
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.gcc.set.args.src = function(complete, cancel, data) {
  var scheme = data.get('scheme');
  var module = data.get('module');

  var srcDir = scheme.getSrcDir();
  var rootNamespace = scheme.getRootNamespace;
  var filenames = module.getSrc();

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
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel
 * @param {!dm.DataProvider} data
 */
app.act.gcc.set.args.externs = function(complete, cancel, data) {
  var args = '';

  var i = 0,
      l = filenames.length;

  while (i < l) {
    args += ' --externs ' + filenames[i];
    i += 1;
  }

  complete(args);
};


/**
 * @param {string} externsDir
 * @return {fm.Action}
 */
app.act.gcc.set.args.deps = function(externsDir) {
  return function(complete, cancel, args) {
    dm.func('dep.externs.dir', function(depPath) {
      return path.join(depPath, externsDir);
    });

    fm.script([
      dm.obtain('deps.dir'),
      act.fs.getSubDirs,

      fm.each(fm.script([
        dm.obtain('dep.externs.dir'),
        act.fs.readFilesTree
      ]))
    ])(function(filenames) {
      complete(generateArgsBy(filenames));
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
 * @param {string} args
 */
app.act.gcc.set.args.options = function(complete, cancel, args) {
  var options = dm.get('scheme.compilerOptions');
  var buildDir = dm.get('scheme.buildDir');
  var moduleName = dm.get('module.name');

  args += ' --js_output_file ' + path.join(buildDir, moduleName || 'app') + '.js';
  args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
  args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
  args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

  if (options['formatting'] !== '') {
    args += ' --formatting=' + options['formatting'];
  }

  complete(args);
};