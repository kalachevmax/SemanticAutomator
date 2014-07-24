

/**
 * @constructor
 * @extends {dm.Entity}
 * @param {string} name
 * @param {app.dm.Scheme} scheme
 */
app.dm.Dependency = function(name, scheme) {
  dm.Entity.call(this, dm.EntityType.DEPENDENCY, scheme);

  this.string('name', name);
  this.string('version');
  this.string('type');
  this.string('repo');
};

utils.inherit(app.dm.Module, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Dependency.prototype.populate = function(data) {
  if (typeof data['version'] === 'string') {
    this.setString('version', data['version']);
  }

  if (typeof data['type'] === 'string') {
    this.setString('type', data['type']);
  }

  if (typeof data['repo'] === 'string') {
    this.setString('repo', data['repo']);
  }
};
