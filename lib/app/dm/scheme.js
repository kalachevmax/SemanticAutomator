

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
  this.object('modules');
  this.object('deps');
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
};
