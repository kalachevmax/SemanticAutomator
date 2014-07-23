

/**
 * @constructor
 * @extends {dm.Entity}
 */
app.dm.Module = function() {
  dm.Entity.call(this);

  this.string('name');
  this.string('src');
};

utils.inherit(app.dm.Module, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Scheme.prototype.populate = function(data) {
  if (typeof data['name'] === 'string') {
    this.setString('name', data['name']);
  }

  if (typeof data['src'] === 'string') {
    this.setString('src', data['src']);
  }
};
