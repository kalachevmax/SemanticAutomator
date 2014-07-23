

/**
 * @constructor
 * @extends {dm.Entity}
 */
app.dm.Dependency = function() {
  dm.Entity.call(this);

  this.string('name');
  this.string('version');
  this.string('type');
  this.string('repo');
};

utils.inherit(app.dm.Module, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Scheme.prototype.populate = function(data) {
  if (typeof data['name'] === 'string') {
    this.setString('name', data['name']);
  }

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
