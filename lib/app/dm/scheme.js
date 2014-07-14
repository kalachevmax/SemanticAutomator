

/**
 * @constructor
 * @extends {dm.Entity}
 */
app.dm.Scheme = function() {
  dm.Entity.call(this, name);
};

utils.inherit(app.dm.Scheme, dm.Entity);
