

/**
 * @namespace
 */
var ds = {};


/**
 * @typedef {*}
 */
ds.ListData;


/**
 * @typedef {*}
 */
ds.QueueData;


/**
 * @constructor
 * @param {ds.ListData} data
 * @param {ds.ListItem} prev
 * @param {ds.ListItem} next
 */
ds.ListItem = function(data, prev, next) {};


/**
 * @return {ds.ListData}
 */
ds.ListItem.prototype.getData = function() {};


/**
 * @return {ds.ListItem}
 */
ds.ListItem.prototype.getNext = function() {};


/**
 * @param {ds.ListItem} item
 */
ds.ListItem.prototype.setNext = function(item) {};


/**
 * @return {ds.ListItem}
 */
ds.ListItem.prototype.getPrev = function() {};


/**
 * @param {ds.ListItem} item
 */
ds.ListItem.prototype.setPrev = function(item) {};


/**
 * @interface
 */
ds.IIterable = function() {};


/**
 * @return {ds.ListItem}
 */
ds.IIterable.prototype.getFirst = function() {};


/**
 * @param {ds.ListItem} item
 * @return {ds.ListItem}
 */
ds.IIterable.prototype.getNext = function(item) {};


/**
 * @constructor
 * @implements {ds.IIterable}
 */
ds.List = function() {};


/**
 * @inheritDoc
 */
ds.List.prototype.getFirst = function() {};


/**
 * @return {ds.ListItem}
 */
ds.List.prototype.getLast = function() {};


/**
 * @return {ds.ListItem}
 */
ds.List.prototype.getPrev = function(item) {};


/**
 * @inheritDoc
 */
ds.List.prototype.getNext = function(item) {};


/**
 * @return {boolean}
 */
ds.List.prototype.isEmpty = function() {};


/**
 * @param {number} itemNo
 * @return {ds.ListItem}
 */
ds.List.prototype.locate = function(itemNo) {};


/**
 * @param {ds.ListData} data
 * @return {ds.ListItem}
 */
ds.List.prototype.find = function(data) {};


/**
 * @param {ds.ListData} data
 */
ds.List.prototype.addFirst = function(data) {};


/**
 * @param {ds.ListData} data
 */
ds.List.prototype.addLast = function(data) {};


/**
 * @param {!ds.ListData} data
 * @param {number} itemNo
 */
ds.List.prototype.add = function(data, itemNo) {};


/**
 *
 */
ds.List.prototype.removeFirst = function() {};


/**
 *
 */
ds.List.prototype.removeLast = function() {};


/**
 * @param {number} itemNo
 */
ds.List.prototype.remove = function(itemNo) {};


/**
 * @return {number}
 */
ds.List.prototype.getSize = function() {};


/**
 * @constructor
 * @implements {ds.IIterator}
 * @param {ds.IIterable} source
 */
ds.Iterator = function(source) {};


/**
 * @inheritDoc
 */
ds.Iterator.prototype.hasNext = function() {};


/**
 * @inheritDoc
 */
ds.Iterator.prototype.next = function() {};


/**
 *
 */
ds.Iterator.prototype.destroy = function() {};


/**
 * @constructor
 * @implements {ds.IIterable}
 */
ds.Queue = function() {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.getFirst = function() {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.getNext = function(item) {};


/**
 * @param {ds.QueueData} data
 */
ds.Queue.prototype.enqueue = function(data) {};


/**
 * @return {ds.QueueData}
 */
ds.Queue.prototype.dequeue = function() {};
