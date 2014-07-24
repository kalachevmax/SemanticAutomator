

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
  this.set('name', data['name']);
  this.set('buildDir', data['buildDir']);
  this.set('compilerOptions', data['compilerOptions']);
  this.set('srcDir', data['srcDir']);
  this.set('rootNamespace', data['rootNamespace']);
  this.set('externsDir', data['externsDir']);

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
    var module = new app.dm.Module(name, this);
    module.populate(modules[name]);
    this.addChild(name, module);
  }
};


/**
 * @param {!Object} deps
 */
app.dm.Scheme.prototype.addDeps = function(deps) {
  for (var name in deps) {
    var dep = new app.dm.Dependency(name, this);
    dep.populate(deps[name]);
    this.addChild(name, dep);
  }
};
