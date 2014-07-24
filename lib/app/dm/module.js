

/**
 * @constructor
 * @extends {dm.Entity}
 * @param {string} name
 * @param {app.dm.Scheme} scheme
 */
app.dm.Module = function(name, scheme) {
  dm.Entity.call(this, dm.EntityType.MODULE, scheme);

  this.string('name', name);
  this.string('src');
};

utils.inherit(app.dm.Module, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Module.prototype.populate = function(data) {
  this.set('src', data['src']);
};
