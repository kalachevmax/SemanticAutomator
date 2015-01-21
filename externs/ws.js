

/**
 * @namespace
 */
var ws = {};


/**
 * @typedef {string|!Buffer}
 */
ws.Body;


/**
 * @param {!Object} options
 * @param {!Function=} connectionListener
 */
ws.createServer = function (options, connectionListener) {};


/**
 * @param {string} address
 * @param {!Function=} openListener
 */
ws.connect = function (address, openListener) {};


/**
 * @constructor
 */
ws.Client = function() {};


/**
 * @param {ws.Body} data
 */
ws.Client.prototype.send = function(data) {};


/**
 * @param {string} event
 * @param {!Function} handler
 */
ws.Client.prototype.on = function(event, handler) {};


/**
 * @constructor
 * @param {!Object} options
 */
ws.Server = function(options) {};


/**
 * @type {*}
 */
ws.Server.prototype.clients;


/**
 * @param {string} event
 * @param {!Function} handler
 */
ws.Server.prototype.on = function(event, handler) {};
