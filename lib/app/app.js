

var fs = require('fs');
var path = require('path');
var fm = require('deps/justFM/bin/index.js');
var dm = require('deps/justDM/bin/index.js');
var utils = require('deps/justUtils/bin/index.js');
var act = require('deps/NodeActsLibrary/bin/index.js');


/**
 * @namespace
 */
var app = {};


/**
 * @namespace
 */
app.act = {};


/**
 * @namespace
 */
app.act.cli = {};


/**
 * @namespace
 */
app.act.gcc = {};


/**
 * @namespace
 */
app.act.git = {};


/**
 * @namespace
 */
app.act.scheme = {};


/**
 * @namespace
 */
app.act.dep = {};


/**
 * @namespace
 */
app.act.module = {};


/**
 * @namespace
 */
app.act.cmd = {};


/**
 * @namespace
 */
var cmd = {};


/**
 * @type {string}
 */
var SCHEME_FILE_NAME = 'scheme.json';


/**
 * @type {string}
 */
var DIRECTOR_NAME = 'NodeAppDirector';


/**
 * @type {string}
 */
var DIRECTOR_DIR = '/opt/' + DIRECTOR_NAME;


/**
 * @type {string}
 */
var NODE_EXTERNS_DIR = DIRECTOR_DIR + '/externs';


/**
 * @type {string}
 */
var COMPILER_PATH = '/opt/closure-compiler.jar';


/**
 * @type {string}
 */
var DEPS_DIR = 'deps';


/**
 * @type {string}
 */
var GCC_COMMAND = 'java -jar ' + COMPILER_PATH;


/**
 * @typedef {Object}
 */
app.Scheme;


/**
 * @typedef {!Object}
 */
app.Module;


/**
 * @type {!Function}
 */
app.usage = function() {
  console.log('usage: app action');
  console.log('action = make|update|publish');
};


/**
 */
app.setup = fm.script([
  dm.assign('scheme.filename', SCHEME_FILE_NAME),
  dm.assign('externs.node.dir', NODE_EXTERNS_DIR),
  dm.assign('gcc.command', GCC_COMMAND),
  dm.assign('deps.dir', DEPS_DIR)
]);


/**
 * @type {fm.Action}
 */
app.main = fm.script([
  app.setup,

  app.act.scheme.load,
  dm.assign('scheme'),

  dm.assert.object('scheme.modules'),
  dm.assert.object('scheme.deps'),
  dm.assert.type('externs.node.dir', act.dm.Type.DIRECTORY),

  app.act.scheme.transform,
  dm.assign('scheme'),

  app.act.cli.read,
  dm.assign('action.name'),

  app.act.cmd.invoke
]);


app.main(utils.nop, console.log);
