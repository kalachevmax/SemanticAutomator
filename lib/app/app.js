

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
app.dm = {};


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
app.act.git.make = {};


/**
 * @namespace
 */
app.act.git.make.command = {};


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
app.act.cmd.message = {};


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
 * @type {!Function}
 */
app.usage = function() {
  console.log('usage: app action');
  console.log('action = make|update|publish');
};


/**
 * @type {fm.Action}
 */
app.main = fm.script([
  dm.def.link('scheme.json', act.fs.Type.JSON, SCHEME_FILE_NAME),
  dm.def.link('externs.node.dir', act.fs.Type.DIRECTORY, NODE_EXTERNS_DIR),
  dm.def.entity('scheme', app.dm.Scheme),

  dm.link('scheme.json'),
  dm.populate.entity('scheme'),

  dm.entity('scheme'),
  app.act.scheme.transform,
  dm.set.entity('scheme'),

  dm.provide(process.argv),
  app.act.cli.read,
  dm.def.str('cmd.name'),

  app.act.cmd.invoke
]);


dm.registerTypeProvider(new act.fs.TypeProvider());


app.main(utils.nop, console.log);
