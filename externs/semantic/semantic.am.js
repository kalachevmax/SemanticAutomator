

/**
 * @namespace
 */
var am = {};


/**
 * @namespace
 */
am.list = {};


/**
 * @namespace
 */
am.tree = {};


/**
 * @namespace
 */
am.tree.node = {};


/**
 * @namespace
 */
am.tree.node.get = {};


/**
 * @namespace
 */
am.tree.node.set = {};


/**
 * @namespace
 */
am.tree.node.has = {};


/**
 * @namespace
 */
am.tree.node.custom = {};


/**
 * @namespace
 */
am.tree.nodes = {};


/**
 * @namespace
 */
am.tree.leaf = {};


/**
 * @namespace
 */
am.tree.leaf.custom = {};




/**
 * @type {fm.Action}
 */
am.tree.traverse;


/**
 * @type {fm.Action}
 */
am.tree.leaf.save;


/**
 * @type {fm.Action}
 */
am.tree.leaf.custom.save;


/**
 * @type {fm.Action}
 */
am.tree.node.visit;


/**
 * @type {fm.Action}
 */
am.tree.node.leave;


/**
 * @type {fm.Action}
 */
am.tree.node.process;


/**
 * @type {fm.Action}
 */
am.tree.node.finalize;


/**
 * @type {fm.Action}
 */
am.tree.node.inc;


/**
 * @type {fm.Action}
 */
am.tree.node.custom.visit;


/**
 * @type {fm.Action}
 */
am.tree.node.custom.leave;


/**
 * @type {fm.Action}
 */
am.tree.node.get.current;


/**
 * @type {fm.Action}
 */
am.tree.node.get.children;


/**
 * @type {fm.Action}
 */
am.tree.node.get.path;


/**
 * @type {fm.Action}
 */
am.tree.node.has.children;


/**
 *
 * filterFn function example:
 *
 * function isPackage(currentDir, currentItem) {
 *   return currentDir === 'node_modules' && currentItem.indexOf('.bin') === -1;
 * }
 *
 *
 * @param {function(string, string):boolean} filterFn
 * @return {fm.Action}
 */
am.tree.nodes.count;
