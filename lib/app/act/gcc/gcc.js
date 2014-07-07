

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
      dm.assert.string('scheme.srcDir'),
      dm.assert.string('scheme.rootNamespace'),
      dm.assert.array('module.src'),
      dm.assert.string('externs.node.dir'),
      dm.assert.string('scheme.externsDir'),
      dm.assert.object('scheme.compilerOptions'),
      dm.assert.string('scheme.buildDir'),
      dm.assert.string('module.name'),

      generateSrcArgs,
      generateExternsArgs(dm.get('externs.node.dir')),
      generateDepsExternsArgs(dm.get('scheme.externsDir')),
      generateOptionsArgs,
    ])(function(args) {
      dm.set('gcc.args', args);
      complete(args);
    }, cancel, '');
  }

  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   * @param {string} args
   */
  function generateSrcArgs(complete, cancel, args) {
    var srcDir = dm.get('scheme.srcDir');
    var rootNamespace = dm.get('scheme.rootNamespace');
    var filenames = dm.get('module.src');

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
  }


  /**
   * @param {function(string)} complete
   * @param {function(string, number=)} cancel
   * @param {string} args
   */
  function generateOptionsArgs(complete, cancel, args) {
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
  }

  return key === 'args' ? setArgs : nop;
};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 */
app.act.gcc.invoke = function(complete, cancel) {
  var command = dm.get('gcc.command');
  var args = dm.get('gcc.args');
  console.log(command + args);
  act.proc.exec(command + args)(complete, cancel, {});
};
