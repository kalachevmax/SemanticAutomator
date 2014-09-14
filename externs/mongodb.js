

/**
 * @namespace
 */
var mongodb = {};


/**
 * @constructor
 */
mongodb.MongoClient = function() {};


/**
 * @param {string} url
 * @param {!Object|!Function} options
 * @param {!Function=} opt_callback
 */
mongodb.MongoClient.connect = function(url, options, opt_callback) {};


/**
 * @constructor
 */
mongodb.Cursor = function() {};


/**
 * @param {!Function} callback
 */
mongodb.Cursor.prototype.toArray = function(callback) {};


/**
 * @constructor
 */
mongodb.Collection = function() {};


/**
 * @param {!Object} doc
 * @param {!Object} options
 * @param {!Function} callback
 */
mongodb.Collection.prototype.insert = function(doc, options, callback) {};


/**
 * @param {!Object} doc
 * @return {!mongodb.Cursor}
 */
mongodb.Collection.prototype.find = function(doc) {};


/**
 * @constructor
 */
mongodb.DataBase = function() {};


/**
 * @param {string} name
 * @return {!mongodb.Collection}
 */
mongodb.DataBase.prototype.collection = function(name) {};
