

/**
 * @namespace
 */
var act = {};


/**
 * @namespace
 */
act.fs = {};


/**
 * @namespace
 */
act.fs.dir = {};


/**
 * @namespace
 */
act.fs.dir.get = {};


/**
 * @namespace
 */
act.fs.file = {};


/**
 * @namespace
 */
act.fs.tree = {};


/**
 * @namespace
 */
act.fs.node = {};


/**
 * @namespace
 */
act.fs.node.is = {};


/**
 * @namespace
 */
act.fs.stream = {};


/**
 * @namespace
 */
act.proc = {};


/**
 * @namespace
 */
act.hash = {};


/**
 * @param {string} digestType
 * @return {fm.Action|function(function(fm.Input), function(string, number=),
 * !Buffer)}
 */
act.hash.sha1 = function(digestType) {};


/**
 * @param {string} command
 * @return {fm.Action}
 */
act.proc.exec = function(command) {};


/**
 * @enum {string}
 */
act.fs.Type = {
  FILE: 'FILE',
  DIRECTORY: 'DIRECTORY'
};


/**
 * @constructor
 * @implements {dm.ILink}
 * @param {string} path
 */
act.fs.FileLink = function(path) {};


/**
 * @inheritDoc
 */
act.fs.FileLink.prototype.isValid = function(complete, cancel, input) {};


/**
 * @inheritDoc
 */
act.fs.FileLink.prototype.retrieve = function(complete, cancel, input) {};


/**
 * @constructor
 * @implements {dm.ILink}
 * @param {string} path
 */
act.fs.DirectoryLink = function(path) {};


/**
 * @inheritDoc
 */
act.fs.DirectoryLink.prototype.isValid = function(complete, cancel, input) {};


/**
 * @inheritDoc
 */
act.fs.DirectoryLink.prototype.retrieve = function(complete, cancel, input) {};


/**
 * @constructor
 * @implements {dm.ITypeProvider}
 */
act.fs.TypeProvider = function() {

};


/**
 * @inheritDoc
 */
act.fs.TypeProvider.prototype.assert = function(name, type, value) {};


/**
 * @inheritDoc
 */
act.fs.TypeProvider.prototype.createLink = function(name, type, address) {};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 * @param {string} path
 */
act.fs.dir.create = function(complete, cancel, path) {};


/**
 * @param {function()} complete
 * @param {function(string, number=)} cancel
 * @param {string} path
 */
act.fs.dir.remove = function(complete, cancel, path) {};


/**
 * @param {function(!Array.<string>)} complete
 * @param {function(string, number=)} cancel
 * @param {string} path
 */
act.fs.dir.read = function(complete, cancel, path) {};


/**
 * @type {fm.Action}
 */
act.fs.dir.get.nested = fm.script([]);


/**
 * @param {function(fs.FileContent)} complete
 * @param {function(string, number=)} cancel
 * @param {string} path
 */
act.fs.file.read = function(complete, cancel, path) {};


/**
 * @param {function(boolean)} complete
 * @param {function(string, number=)} cancel
 * @param {string} path
 */
act.fs.node.exists = function(complete, cancel, path) {};


/**
 * @param {function(boolean)} complete
 * @param {function(string, number=)} cancel
 * @param {fm.Input} path
 */
act.fs.node.is.directory = function(complete, cancel, path) {};




/**
 * @type {stream.Writable}
 */
act.fs.stream.__stream = null;


/**
 * @param {string} filename
 * @param {!Object=} opt_options
 * @return {fm.Action}
 */
act.fs.stream.create = function(filename, opt_options) {};


/**
 * @param {number} size
 * @param {fm.Action} action
 * @return {fm.Action|function(function(), function(string, number=), string)}
 */
act.fs.stream.read = function(size, action) {};


/**
 * @param {function(fs.FileContent)} complete
 * @param {function(string, number=)} cancel
 * @param {fs.FileContent} chunk
 */
act.fs.stream.write = function(complete, cancel, chunk) {};


/**
 * @param {function(fm.Input=)} complete
 * @param {function(string, number=)} cancel
 * @param {fm.Input=} opt_input
 */
act.fs.stream.close = function(complete, cancel, opt_input) {};


/**
 * @type {fm.Action}
 */
act.fs.tree.read = fm.script([]);


/**
 * @type {fm.Action}
 */
act.fs.tree.remove = fm.script([]);
