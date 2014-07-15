

/**
 * @constructor
 * @extends {dm.Entity}
 */
app.dm.Scheme = function() {
  dm.Entity.call(this, name);

  this.__name = '';

  this.__buildDir = '';

  this.__compilerOptions = {};

  this.__srcDir = '';

  this.__rottNamespace = '';

  this.__externsDir = '';

  this.__modules = {};

  this.__deps = {};
};

utils.inherit(app.dm.Scheme, dm.Entity);


/**
 * @param {!Object} data
 */
app.dm.Scheme.prototype.populate = function(data) {
  if (typeof data['name'] === 'string') {
    this.__name = data['name'];
  }
};
