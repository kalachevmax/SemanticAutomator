

/**
 * @namespace
 */
var dm = {};


/**
 * @namespace
 */
dm.symbol = {};


/**
 * @namespace
 */
dm.def = {};


/**
 * @namespace
 */
dm.get = {};


/**
 * @namespace
 */
dm.set = {};


/**
 * @namespace
 */
dm.arg = {};


/**
 * @namespace
 */
dm.ret = {};


/**
 * @namespace
 */
dm.inc = {};


/**
 * @namespace
 */
dm.dec = {};


/**
 * @namespace
 */
dm.assert = {};


/**
 * @namespace
 */
dm.populate = {};


/**
 * @namespace
 */
dm.invoke = {};


/**
 * @namespace
 */
dm.do = {};


/**
 * @namespace
 */
dm.provider = {};


/**
 * @namespace
 */
dm.create = {};


/**
 * @namespace
 */
dm.act = {};


/**
 * @namespace
 */
dm.act.str = {};


/**
 * @namespace
 */
dm.act.array = {};


/**
 * @typedef {number|string|boolean|Array|Object|Date|RegExp|null|dm.Entity}
 */
dm.AtomValue;


/**
 * @typedef {dm.AtomValue|!Function|fm.Action|dm.symbol.Link}
 */
dm.Value;


/**
 * @typedef {*}
 */
dm.ValueType;


/**
 * @typedef {*}
 */
dm.UserType;


/**
 * @typedef {string}
 */
dm.LinkAddress;


/**
 * @typedef {*}
 */
dm.EntityType;


/**
 * @typedef {function(string):fm.Action}
 */
dm.StringActor;


/**
 * @typedef {function(string, dm.Type):fm.Action}
 */
dm.AtomActor;


/**
 * @type {string}
 */
dm.FIELD_SEPARATOR = '.';


/**
 * @type {!Object.<string, !dm.Symbol>}
 */
dm.__symbols = {};


/**
 * @type {!Object.<dm.UserType, dm.ITypeProvider>}
 */
dm.__typeProviders = {};


/**
 *
 */
dm.nop = function() {};


/**
 * @param {dm.UserType} type
 * @param {dm.ITypeProvider} provider
 */
dm.registerTypeProvider = function(type, provider) {};


/**
 * @param {string} name
 * @return {boolean}
 */
dm.defined = function(name) {};


/**
 * @param {dm.ValueType} type
 * @return {dm.Value}
 */
dm.getDefaultValue = function(type) {};


/**
 * @type {dm.AtomActor}
 */
dm.atom;


/**
 * @type {dm.StringActor}
 */
dm.num;


/**
 * @type {dm.StringActor}
 */
dm.number = dm.num;


/**
 * @type {dm.StringActor}
 */
dm.str;


/**
 * @type {dm.StringActor}
 */
dm.string;


/**
 * @type {dm.StringActor}
 */
dm.bool;


/**
 * @type {dm.StringActor}
 */
dm.boolean;


/**
 * @type {dm.StringActor}
 */
dm.ar;


/**
 * @type {dm.StringActor}
 */
dm.array;


/**
 * @type {dm.StringActor}
 */
dm.obj;


/**
 * @type {dm.StringActor}
 */
dm.object;


/**
 * @type {dm.StringActor}
 */
dm.date;


/**
 * @type {dm.StringActor}
 */
dm.regexp;


/**
 * @type {dm.StringActor}
 */
dm.link;


/**
 * @type {dm.StringActor}
 */
dm.entity;


/**
 * @param {...string} var_args
 */
dm.provide = function(var_args) {};


/**
 * @param {dm.Value} value
 * @param {dm.ValueType} type
 * @return {boolean}
 */
dm.typeof = function(value, type) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isAtom = function(symbol) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isNum = function(symbol) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isArray = function(symbol) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isLink = function(symbol) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isEntity = function(symbol) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isProvider = function(symbol) {};


/**
 * @param {!dm.Symbol} symbol
 * @return {boolean}
 */
dm.isFunc = function(symbol) {};


/**
 * @param {dm.AtomValue} value
 * @return {fm.Action|function(function(boolean), function(string, number=),
 * fm.Action)}
 */
dm.eq = function(value) {};


/**
 * @param {dm.AtomValue} value
 * @return {fm.Action|function(function(boolean), function(string, number=),
 * fm.Action)}
 */
dm.noteq = function(value) {};


/**
 * @param {string} path
 * @return {fm.Action|function(function(dm.AtomValue), function(string, number=),
 * fm.Input)}
 */
dm.field = function(path) {};


/**
 * @param {dm.Value} value
 * @return {fm.Action|function(function(dm.Value), function(string, number=),
 * fm.Input)}
 */
dm.use = function(value) {};


/**
 * @param {string} symbolName
 * @return {fm.Action|function(function(!Array), function(string, number=),
 * !Array)}
 */
dm.act.array.push = function(symbolName) {};


/**
 * @return {fm.Action|function(function(!Array), function(string, number=),
 * dm.Value)}
 */
dm.act.array.pop = function() {};


/**
 * @param {string} symbolName
 * @return {fm.Action|function(function(dm.Value), function(string, number=),
 * fm.Input)}
 */
dm.act.array.last = function(symbolName) {};


/**
 * @param {string} separator
 * @return {fm.Action|function(function(string), function(string, number=),
 * !Array.<string>)}
 */
dm.act.array.join = function(separator) {};


/**
 * @type {dm.StringActor}
 */
dm.arg.num = dm.set.num;


/**
 * @type {dm.StringActor}
 */
dm.arg.number = dm.arg.num;


/**
 * @type {dm.StringActor}
 */
dm.arg.str = dm.set.str;


/**
 * @type {dm.StringActor}
 */
dm.arg.string = dm.arg.str;


/**
 * @type {dm.StringActor}
 */
dm.arg.bool = dm.set.bool;


/**
 * @type {dm.StringActor}
 */
dm.arg.boolean = dm.arg.bool;


/**
 * @type {dm.StringActor}
 */
dm.arg.arr = dm.set.array;


/**
 * @type {dm.StringActor}
 */
dm.arg.array = dm.arg.arr;


/**
 * @type {dm.StringActor}
 */
dm.arg.obj = dm.set.object;


/**
 * @type {dm.StringActor}
 */
dm.arg.object = dm.arg.obj;


/**
 * @type {dm.StringActor}
 */
dm.arg.date = dm.set.date;


/**
 * @type {dm.StringActor}
 */
dm.arg.regexp = dm.set.regexp;


/**
 * @type {dm.StringActor}
 */
dm.arg.link = dm.set.link;


/**
 * @type {dm.StringActor}
 */
dm.arg.entity = dm.set.entity;


/**
 * @type {dm.StringActor}
 */
dm.arg.provider = dm.set.provider;


/**
 * @param {string} name
 * @param {*} type
 * @return {fm.Action|function(function(fm.Input), function(string, number=),
 * fm.Input)}
 */
dm.assert.type = function(name, type) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.num = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.str = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.bool = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.array = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.object = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.date = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.regexp = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.assert.null = function(name) {};


/**
 * @param {...string} var_args
 */
dm.create.array = function(var_args) {};


/**
 * @param {string} name
 * @return {fm.Action|function(function(fm.Input), function(string, number=),
 * fm.Input)}
 */
dm.dec.num = function(name) {};


/**
 * @param {string} name
 * @param {dm.Type} type
 * @param {dm.Value=} opt_value
 * @return {fm.Action|function(function(fm.Input), function(string, number=),
 * fm.Input)}
 */
dm.def.atom = function(name, type, opt_value) {};


/**
 * @param {string} name
 * @param {dm.EntityType} type
 * @param {!Function} clsName
 */
dm.def.entity = function(name, type, clsName) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.num = function(name, opt_value) {};


/**
 * @type {dm.StringActor}
 */
dm.def.number = dm.def.num;


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.str = function(name, opt_value) {};


/**
 * @type {dm.StringActor}
 */
dm.def.string = dm.def.str;


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.bool = function(name, opt_value) {};


/**
 * @type {dm.StringActor}
 */
dm.def.boolean = dm.def.bool;


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.arr = function(name, opt_value) {};


/**
 * @type {dm.StringActor}
 */
dm.def.array = dm.def.arr;


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.obj = function(name, opt_value) {};


/**
 * @type {dm.StringActor}
 */
dm.def.object = dm.def.obj;


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.date = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 * @return {fm.Action}
 */
dm.def.regexp = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.ValueType} valueType
 * @param {dm.LinkAddress} address
 */
dm.def.link = function(name, valueType, address) {};


/**
 * @param {string} name
 * @param {!Function} fn
 */
dm.def.func = function(name, fn) {};


/**
 * @param {!Object} namespace
 * @return {fm.Action|function(function(string), function(string, number=),
 * string)}
 */
dm.do.action = function(namespace) {};


/**
 * @param {string} name
 * @return {fm.Action|function(function(!dm.Symbol), function(string, number=),
 * fm.Input)}
 */
dm.get.provider = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action|function(function(fm.Input), function(string, number=),
 * fm.Input)}
 */
dm.inc.num = function(name) {};


/**
 * @param {string} name
 * @param {fm.Action} action
 */
dm.invoke.filter = function(name, action) {};


/**
 * @param {string} name
 */
dm.populate.entity = function(name) {};


/**
 * @param {string} path
 * @return {fm.Action|function(function(dm.Value), function(string, number=),
 * !dm.DataProvider)}
 */
dm.provider.get = function(path) {};


/**
 * @param {!dm.DataProvider} provider
 * @param {string} path
 * @return {fm.Action|function(function(!dm.DataProvider),
 * function(string, number=), !dm.DataProvider)}
 */
dm.provider.add = function(provider, path) {};


/**
 * @type {dm.StringActor}
 */
dm.ret.num = dm.get.num;


/**
 * @type {dm.StringActor}
 */
dm.ret.number = dm.ret.num;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.ret.str = dm.get.str;


/**
 * @type {dm.StringActor}
 */
dm.ret.string = dm.ret.str;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.ret.bool = dm.get.bool;


/**
 * @type {dm.StringActor}
 */
dm.ret.boolean = dm.ret.bool;


/**
 * @type {dm.StringActor}
 */
dm.ret.arr = dm.get.arr;


/**
 * @type {dm.StringActor}
 */
dm.ret.array = dm.ret.arr;


/**
 * @type {dm.StringActor}
 */
dm.ret.obj = dm.get.obj;


/**
 * @type {dm.StringActor}
 */
dm.ret.object = dm.ret.obj;


/**
 * @type {dm.StringActor}
 */
dm.ret.date = dm.get.date;


/**
 * @type {dm.StringActor}
 */
dm.ret.regexp = dm.get.regexp;


/**
 * @type {dm.StringActor}
 */
dm.ret.entity = dm.get.entity;


/**
 * @type {dm.StringActor}
 */
dm.ret.link = dm.get.link;


/**
 * @type {dm.StringActor}
 */
dm.ret.provider = dm.get.provider;


/**
 * @param {string} name
 * @param {dm.Type} type
 * @return {fm.Action|function(function(!dm.Symbol), function(string, number=),
 * dm.Value)}
 */
dm.set.atom = function(name, type) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.num = function(name) {};


/**
 * @type {dm.StringActor}
 */
dm.set.number = dm.set.num;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.str = function(name) {};


/**
 * @type {dm.StringActor}
 */
dm.set.string = dm.set.str;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.bool = function(name) {};


/**
 * @type {dm.StringActor}
 */
dm.set.boolean = dm.set.bool;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.arr = function(name) {};


/**
 * @type {dm.StringActor}
 */
dm.set.array = dm.set.arr;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.obj = function(name) {};


/**
 * @type {dm.StringActor}
 */
dm.set.object = dm.set.obj;


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.date = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.regexp = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action}
 */
dm.set.entity = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action|function(function(!dm.Symbol), function(string, number=),
 * !dm.Symbol)}
 */
dm.set.link = function(name) {};


/**
 * @param {string} name
 * @return {fm.Action|function(function(!dm.Symbol), function(string, number=),
 * !dm.DataProvider)}
 */
dm.set.provider = function(name) {};


/**
 * @param {fm.Action} action1
 * @param {fm.Action} action2
 * @return {fm.Action}
 */
dm.set.action = function(action1, action2) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.Array = function(name, opt_value) {};


/**
 * @param {dm.Value} data
 */
dm.symbol.Array.prototype.push = function(data) {};


/**
 * @return {dm.Value}
 */
dm.symbol.Array.prototype.pop = function() {};


/**
 * @constructor
 * @extends {dm.Symbol}
 */
dm.symbol.Atom = function(name, valueType, opt_value) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.Boolean = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.Symbol}
 */
dm.symbol.DataProvider = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.Date = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.Entity = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.Symbol}
 */
dm.symbol.Function = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.Number = function(name, opt_value) {};


/**
 *
 */
dm.symbol.Number.prototype.inc = function() {};


/**
 *
 */
dm.symbol.Number.prototype.dec = function() {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.Object = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.RegExp = function(name, opt_value) {};


/**
 * @constructor
 * @extends {dm.symbol.Atom}
 */
dm.symbol.String = function(name, opt_value) {};


/**
 * @constructor
 * @implements {dm.ILink}
 * @extends {dm.Symbol}
 */
dm.symbol.Link = function() {};


/**
 * @param {function(fm.Input)} complete
 * @param {function(string, number=)} cancel
 * @param {fm.Input} input
 */
dm.symbol.Link.prototype.isValid = function(complete, cancel, input) {};


/**
 * @param {function(dm.Value)} complete
 * @param {function(string, number=)} cancel
 * @param {fm.Input} input
 */
dm.symbol.Link.prototype.retrieve = function(complete, cancel, input) {};


/**
 * @param {string} name
 * @param {dm.ValueType} valueType
 * @param {dm.Value=} opt_value
 */
dm.symbol.createAtom = function(name, valueType, opt_value) {};


/**
 * @constructor
 * @implements {dm.IDataProvider}
 */
dm.DataProvider = function() {};


/**
 * @inheritDoc
 */
dm.DataProvider.prototype.get = function(key) {};


/**
 * @inheritDoc
 */
dm.DataProvider.prototype.set = function(key, value) {};


/**
 * @constructor
 * @implements {dm.IEntity}
 * @param {dm.EntityType} type
 * @param {!dm.IEntity=} opt_parent
 */
dm.Entity = function(type, opt_parent) {};


/**
 * @inheritDoc
 */
dm.Entity.prototype.getType = function() {};


/**
 * @inheritDoc
 */
dm.Entity.prototype.getField = function(name) {};


/**
 * @inheritDoc
 */
dm.Entity.prototype.setField = function(name, value) {};


/**
 * @inheritDoc
 */
dm.Entity.prototype.addChild = function(name, entity) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.string = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.number = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.boolean = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.array = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.object = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.date = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.Entity.prototype.regexp = function(name, opt_value) {};


/**
 * @inheritDoc
 */
dm.Entity.prototype.set = function(name, value) {};


/**
 * @inheritDoc
 */
dm.Entity.prototype.childs = function(type) {};


/**
 * @interface
 */
dm.IDataProvider = function() {};


/**
 * @param {string} key
 * @return {dm.Value}
 */
dm.IDataProvider.prototype.get = function(key) {};


/**
 * @param {string} key
 * @param {dm.Value} value
 */
dm.IDataProvider.prototype.set = function(key, value) {};




/**
 * @interface
 */
dm.IEntity = function() {};


/**
 * @return {dm.EntityType}
 */
dm.IEntity.prototype.getType = function() {};


/**
 * @param {string} name
 * @return {!dm.ISymbol}
 */
dm.IEntity.prototype.getField = function(name) {};


/**
 * @param {string} name
 * @param {!dm.ISymbol} value
 */
dm.IEntity.prototype.setField = function(name, value) {};


/**
 * @param {string} name
 * @param {!dm.IEntity} entity
 */
dm.IEntity.prototype.addChild = function(name, entity) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.string = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.number = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.boolean = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.array = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.object = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.date = function(name, opt_value) {};


/**
 * @param {string} name
 * @param {dm.Value=} opt_value
 */
dm.IEntity.prototype.regexp = function(name, opt_value) {};



/**
 * @param {string} name
 * @param {dm.Value} value
 */
dm.IEntity.prototype.set = function(name, value) {};


/**
 * @param {dm.EntityType} type
 */
dm.IEntity.prototype.childs = function(type) {};


/**
 * @interface
 */
dm.ILink = function() {};


/**
 * @param {function(fm.Input)} complete
 * @param {function(string, number=)} cancel
 * @param {fm.Input} input
 */
dm.ILink.prototype.isValid = function(complete, cancel, input) {};


/**
 * @param {function(dm.Value)} complete
 * @param {function(string, number=)} cancel
 * @param {fm.Input} input
 */
dm.ILink.prototype.retrieve = function(complete, cancel, input) {};


/**
 * @interface
 */
dm.ISymbol = function() {};


/**
 * @return {string}
 */
dm.ISymbol.prototype.getName = function() {};


/**
 * @return {dm.SymbolType}
 */
dm.ISymbol.prototype.getType = function() {};


/**
 * @return {dm.Value}
 */
dm.ISymbol.prototype.getValue = function() {};


/**
 * @param {dm.Value} value
 */
dm.ISymbol.prototype.setValue = function(value) {};


/**
 * @return {dm.ValueType}
 */
dm.ISymbol.prototype.getValueType = function() {};


/**
 * @interface
 */
dm.ITypeProvider = function() {};


/**
 * @param {string} name
 * @param {dm.UserType} type
 * @param {dm.Value} value
 * @return {fm.Action}
 */
dm.ITypeProvider.prototype.assert = function(name, type, value) {};


/**
 * @param {string} name
 * @param {dm.ValueType} type
 * @param {dm.LinkAddress} address
 * @return {dm.ILink}
 */
dm.ITypeProvider.prototype.createLink = function(name, type, address) {};


/**
 * @constructor
 * @implements {dm.ISymbol}
 * @param {string} name
 * @param {dm.SymbolType} type
 * @param {dm.ValueType} valueType
 * @param {dm.Value=} opt_value
 */
dm.Symbol = function(name, type, valueType, opt_value) {};


/**
 * @inheritDoc
 */
dm.Symbol.prototype.getName = function() {};


/**
 * @inheritDoc
 */
dm.Symbol.prototype.getType = function() {};


/**
 * @inheritDoc
 */
dm.Symbol.prototype.getValue = function() {};


/**
 * @inheritDoc
 */
dm.Symbol.prototype.setValue = function(value) {};


/**
 * @inheritDoc
 */
dm.Symbol.prototype.getValueType = function() {};


/**
 * @enum {string}
 */
dm.SymbolType = {
  ATOM: 'Atom',
  LINK: 'Link',
  FUNCTION: 'Function',
  DATA_PROVIDER: 'DataProvider'
};


/**
 * @enum {string}
 */
dm.Type = {
  NUMBER: 'Number',
  STRING: 'String',
  BOOLEAN: 'Boolean',
  ARRAY: 'Array',
  OBJECT: 'Object',
  DATE: 'Date',
  REGEXP: 'RegExp',
  NULL: 'Null',
  ENTITY: 'Entity',
  FUNCTION: 'Function',
  ACTION: 'Action',
  LINK: 'Link',
  DATA_PROVIDER: 'DataProvider'
};


/**
 * @param {dm.Value=} opt_value
 * @return {!dm.Symbol}
 */
dm.symbol.createAnonymousArray = function(opt_value) {};
