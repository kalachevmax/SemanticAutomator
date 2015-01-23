/**
 * @namespace
 */
var wss = {};


/**
 * @typedef {string|!Buffer}
 */
wss.Message;


/**
 * @param {!Object} options
 * @param {!Function=} connectionListener
 */
wss.createServer = function (options, connectionListener) {};


/**
 * @param {string} address
 * @param {!Function=} openListener
 */
wss.connect = function (address, openListener) {};


/**
 * @constructor
 */
wss.Client = function() {};


/**
 * @param {wss.Message} data
 */
wss.Client.prototype.send = function(data) {};


/**
 * @param {string} event
 * @param {!Function} handler
 */
wss.Client.prototype.on = function(event, handler) {};


/**
 * @constructor
 * @param {!Object} options
 */
wss.Server = function(options) {};


/**
 * @type {*}
 */
wss.Server.prototype.clients;


/**
 * @param {string} event
 * @param {!Function} handler
 */
wss.Server.prototype.on = function(event, handler) {};
