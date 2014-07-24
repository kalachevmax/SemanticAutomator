

/**
 * @constructor
 * @extends {dm.Entity}
 * @param {string} name
 */
app.dm.Module = function(name) {
  dm.Entity.call(this);

  this.string('name', name);
  this.string('src');
};

utils.inherit(app.dm.Module, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Module.prototype.populate = function(data) {
  if (typeof data['src'] === 'string') {
    this.setString('src', data['src']);
  }
};
