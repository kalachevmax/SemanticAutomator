

/**
 * @param {string} key
 * @return {fm.Action}
 */
app.act.gcc.set = function(key) {
  /**
   * @param {function()} complete
   * @param {function(string, number=)} cancel
   */
  function nop(complete, cancel) {
    complete();
  }

  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   */
  function setArgs(complete, cancel) {
    fm.script([
      fm.assert('scheme', 'srcDir', 'string'),
      fm.assert('scheme', 'rootNamespace', 'string'),
      fm.assert('module', 'src', Array),
      fm.assert('externs.node.dir', 'string'),
      fm.assert('scheme', 'externsDir', 'string'),
      fm.assert('scheme', 'compilerOptions', Object),
      fm.assert('scheme', 'buildDir', 'string'),
      fm.assert('module', 'name', 'string'),

      generateSrcArgs,
      generateExternsArgs(fm.get('externs.node.dir')),
      generateDepsExternsArgs(fm.get('scheme', 'externsDir')),
      generateOptionsArgs,
    ])(function(args) {
      fm.set('gcc.args', args);
      complete(args);
    }, cancel, '');
  }

  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   * @param {string} args
   */
  function generateSrcArgs(complete, cancel, args) {
    var srcDir = fm.get('scheme', 'srcDir');
    var rootNamespace = fm.get('scheme', 'rootNamespace');
    var filenames = fm.get('module', 'src');

    var i = 0,
        l = filenames.length;

    while (i < l) {
      args += ' --js ' + path.join(srcDir, rootNamespace, filenames[i]);
      i += 1;
    }

    complete(args);
  }


  /**
   * @param {string} dir
   * @return {fm.Action}
   */
  function generateExternsArgs(dir) {
    return function(complete, cancel, args) {
      console.log('dir:', dir);
      act.fs.readFilesTree(handleReaded, cancel, dir);

      function handleReaded(filenames) {
        var i = 0,
            l = filenames.length;

        while (i < l) {
          args += ' --externs ' + filenames[i];
          i += 1;
        }

        complete(args);
      }
    }
  }


  /**
   * @param {string} externsDir
   * @return {fm.Action}
   */
  function generateDepsExternsArgs(externsDir) {
    return function(complete, cancel, args) {
      fm.define('dep.externs.dir', function(depPath) {
        return path.join(depPath, externsDir);
      });

      fm.script([
        fm.obtain('deps.dir'),
        act.fs.getSubDirs,

        fm.each(fm.script([
          fm.obtain('dep.externs.dir'),
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
  }


  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   * @param {string} args
   */
  function generateOptionsArgs(complete, cancel, args) {
    var options = fm.get('scheme', 'compilerOptions');
    var buildDir = fm.get('scheme', 'buildDir');
    var moduleName = fm.get('module', 'name');

    args += ' --js_output_file ' + path.join(buildDir, moduleName || 'app') + '.js';
    args += ' --compilation_level ' + (options['compilationLevel'] || 'WHITESPACE_ONLY');
    args += ' --warning_level=' + (options['warningLevel'] || 'VERBOSE');
    args += ' --language_in=' + (options['language'] || 'ECMASCRIPT5');

    if (options['formatting'] !== '') {
      args += ' --formatting=' + options['formatting'];
    }

    complete(args);
  }

  return key === 'args' ? setArgs : nop;
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.gcc.invoke = function(complete, cancel) {
  var command = fm.get('gcc.command');
  var args = fm.get('gcc.args');
  console.log(command + args);
  act.proc.exec(command + args)(complete, cancel, {});
};
