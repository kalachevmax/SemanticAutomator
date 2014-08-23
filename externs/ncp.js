

/**
 * @namespace
 */
var ncp = {};


/**
 * @namespace
 */
ncp.net = {};


/**
 * @namespace
 */
ncp.net.udp = {};


/**
 * @namespace
 */
ncp.net.ws = {};


/**
 * @namespace
 */
ncp.net.http = {};


/**
 * @namespace
 */
ncp.act = {};


/**
 * @namespace
 */
ncp.act.ws = {};


/**
 * @return {*}
 */
ncp.net.udp.createSocket = function() {};


/**
 * @enum {string}
 */
ncp.net.udp.MulticastMessage = {};


/**
 * @constructor
 * @param {string} host
 * @param {number} port
 * @param {string} message
 * @param {number} ttl
 */
ncp.net.udp.MulticastAgent = function(host, port, message, ttl) {};


/**
 *
 */
ncp.net.udp.MulticastAgent.prototype.__startListening = function() {};


/**
 * @param {*} socket
 */
ncp.net.udp.MulticastAgent.prototype.__listen = function(socket) {};


/**
 * @param {*} socket
 * @param {number} port
 * @param {string} host
 * @param {string} message
 * @param {number} ttl
 */
ncp.net.udp.MulticastAgent.prototype.__startMulticasting =
    function(socket, port, host, message, ttl) {};


/**
 *
 */
ncp.net.udp.MulticastAgent.prototype.stopMulticasting = function(socket) {};


/**
 * @interface
 */
ncp.net.ws.IClient = function() {};


/**
 * @param {string} host
 * @param {number} port
 */
ncp.net.ws.IClient.prototype.connect = function(host, port) {};


/**
 * @param {!ncp.net.ws.Request} request
 */
ncp.net.ws.IClient.prototype.send = function(request) {};


/**
 * @constructor
 * @implements {ncp.net.ws.IClient}
 * @param {string} serverHost
 * @param {number} serverPort
 */
ncp.net.ws.Client = function(serverHost, serverPort) {};


/**
 * @inheritDoc
 */
ncp.net.ws.Client.prototype.connect = function(host, port) {};


/**
 * @inheritDoc
 */
ncp.net.ws.Client.prototype.send = function(request) {};


/**
 * @interface
 */
ncp.net.ws.IServer = function() {};


/**
 * @param {number} port
 */
ncp.net.ws.IServer.prototype.listen = function(port) {};


/**
 * @constructor
 * @implements {ncp.net.ws.IServer}
 * @param {number} listenPort
 */
ncp.net.ws.Server = function(listenPort) {};


/**
 * @inheritDoc
 */
ncp.net.ws.Server.prototype.listen = function(port) {};


/**
 * @constructor
 * @extends {dm.Entity}
 */
ncp.net.ws.Request = function() {};


/**
 * @constructor
 * @param {!ncp.net.udp.MulticastAgent} udpAgent
 * @param {!ncp.net.ws.Server} wsServer
 * @param {!ncp.net.ws.Client} wsClient
 */
ncp.Agent = function(udpAgent, wsServer, wsClient) {};
