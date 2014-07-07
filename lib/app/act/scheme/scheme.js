

/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 */
app.act.scheme.load = function(complete, cancel) {
  var filename = dm.get('scheme.filename');

  act.fs.readFile({encoding: 'utf-8'})(function(file) {
    var content = null;
    var error = null;

    try {
      content = JSON.parse(file);
    } catch (err) {
      error = err;
    }

    if (content !== null) {
      complete(content);
    } else {
      cancel('[app.act.scheme.load] parsing error: ' + error.toString());
    }

  }, cancel, filename);
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 * @param {app.Scheme} scheme
 */
app.act.scheme.transformModules = function(complete, cancel, scheme) {
  var result = [];
  var modules = scheme['modules'];

  for (var name in modules) {
    result.push({
      name: name,
      src: modules[name]['src']
    });
  }

  scheme['modules'] = result;
  complete(scheme);
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 * @param {app.Scheme} scheme
 */
app.act.scheme.transformDeps = function(complete, cancel, scheme) {
  var result = [];
  var deps = scheme['deps'];

  for (var name in deps) {
    var item = {
      name: name
    };

    if (deps[name] instanceof Object) {
      item = utils.obj.extend(item, deps[name]);
    } else if (typeof deps[name] === 'string') {
      item.type = 'git';
      item.repo = deps[name];
    }

    result.push(item);
  }

  scheme['deps'] = result;
  complete(scheme);
};


/**
 * @param {function(app.Scheme)} complete
 * @param {function(string, number=)} cancel
 * @param {app.Scheme} scheme
 */
app.act.scheme.transform = function(complete, cancel, scheme) {
  fm.script([
    app.act.scheme.transformModules,
    app.act.scheme.transformDeps
  ])(complete, cancel, scheme);
};
