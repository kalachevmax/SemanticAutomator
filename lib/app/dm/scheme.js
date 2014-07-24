

/**
 * @constructor
 * @extends {dm.Entity}
 */
app.dm.Scheme = function() {
  dm.Entity.call(this);

  this.string('name');
  this.string('buildDir');
  this.object('compilerOptions');
  this.string('srcDir');
  this.string('rootNamespace');
  this.string('externsDir');

  this.childs(app.dm.EntityType.MODULE);
  this.childs(app.dm.EntityType.DEPENDENCY);
};

utils.inherit(app.dm.Scheme, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Scheme.prototype.populate = function(data) {
  if (typeof data['name'] === 'string') {
    this.setString('name', data['name']);
  }

  if (typeof data['buildDir'] === 'string') {
    this.setString('buildDir', data['buildDir']);
  }

  if (data['compilerOptions'] instanceof Object) {
    this.setObject('compilerOptions', data['compilerOptions']);
  }

  if (typeof data['srcDir'] === 'string') {
    this.setString('srcDir', data['srcDir']);
  }

  if (typeof data['rootNamespace'] === 'string') {
    this.setString('rootNamespace', data['rootNamespace']);
  }

  if (typeof data['externsDir'] === 'string') {
    this.setString('externsDir', data['externsDir']);
  }

  if (data['modules'] instanceof Object) {
    this.addModules(data['modules']);
  }

  if (data['deps'] instanceof Object) {
    this.addDeps(data['deps']);
  }
};


/**
 * @param {!Object} modules
 */
app.dm.Scheme.prototype.addModules = function(modules) {
  for (var name in modules) {
    var module = new app.dm.Module(name);
    module.populate(modules[name]);
    this.addChild(app.dm.EntityType.MODULE, module, this);
  }
};


/**
 * @param {!Object} deps
 */
app.dm.Scheme.prototype.addDeps = function(deps) {
  for (var name in deps) {
    var dep = new app.dm.Dependency(name);
    dep.populate(deps[name]);
    this.addChild(app.dm.EntityType.DEPENDENCY, dep, this);
  }
};
