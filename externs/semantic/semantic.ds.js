

/**
 * @namespace
 */
var ds = {};


/**
 * @interface
 */
ds.IDataItem = function() {};


/**
 * @return {*}
 */
ds.IDataItem.prototype.get = function() {};


/**
 * @interface
 */
ds.IDataSet = function() {};


/**
 * @return {!ds.IDataItem}
 */
ds.IDataSet.prototype.getFirst = function() {};


/**
 * @param {*} data
 */
ds.IDataSet.prototype.add = function(data) {};


/**
 * @param {*=} opt_data
 * @return {*}
 */
ds.IDataSet.prototype.remove = function(opt_data) {};


/**
 * @return {ds.IIterator}
 */
ds.IDataSet.prototype.getIterator = function() {};


/**
 * @return {boolean}
 */
ds.IDataSet.prototype.isEmpty = function() {};


/**
 *
 */
ds.IDataSet.prototype.destroy = function() {};


/**
 * @interface
 */
ds.IIterator = function() {};


/**
 * @return {boolean}
 */
ds.IIterator.prototype.hasNext = function() {};


/**
 * @return {*}
 */
ds.IIterator.prototype.next = function() {};


/**
 *
 */
ds.IIterator.prototype.destroy = function() {};


/**
 * @interface
 */
ds.IQueue = function() {};


/**
 * @param {*} data
 */
ds.IQueue.prototype.enqueue = function(data) {};


/**
 * @return {*}
 */
ds.IQueue.prototype.dequeue = function() {};


/**
 * @constructor
 * @implements {ds.IDataItem}
 * @param {*} data
 * @param {ds.ListItem} prev
 * @param {ds.ListItem} next
 */
ds.ListItem = function(data, prev, next) {};


/**
 * @return {*}
 */
ds.ListItem.prototype.get = function() {};


/**
 * @constructor
 * @implements {ds.IDataSet}
 */
ds.List = function() {};


/**
 * @inheritDoc
 */
ds.List.prototype.getFirst = function() {};


/**
 * @return {ds.IDataItem}
 */
ds.List.prototype.getLast = function() {};


/**
 * @return {boolean}
 */
ds.List.prototype.isEmpty = function() {};


/**
 * @param {number} itemNo
 * @return {ds.IDataItem}
 */
ds.List.prototype.locate = function(itemNo) {};


/**
 * @param {*} data
 * @return {ds.IDataItem}
 */
ds.List.prototype.find = function(data) {};


/**
 * @param {*} data
 */
ds.List.prototype.addFirst = function(data) {};


/**
 * @param {*} data
 */
ds.List.prototype.addLast = function(data) {};


/**
 * @param {*} data
 * @param {number} itemNo
 */
ds.List.prototype.addAt = function(data, itemNo) {};


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
ds.List.prototype.removeAt = function(itemNo) {};


/**
 * @return {number}
 */
ds.List.prototype.getSize = function() {};


/**
 * @inheritDoc
 */
ds.List.prototype.add = function(data) {};


/**
 * @inheritDoc
 */
ds.List.prototype.remove = function(opt_data) {};


/**
 * @inheritDoc
 */
ds.List.prototype.getIterator = function() {};


/**
 * @inheritDoc
 */
ds.List.prototype.destroy = function() {};


/**
 * @constructor
 * @implements {ds.IDataSet}
 * @implements {ds.IQueue}
 * @param {*} dataType
 */
ds.Queue = function(dataType) {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.getFirst = function() {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.add = function(data) {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.remove = function(opt_data) {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.isEmpty = function() {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.getIterator = function() {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.destroy = function() {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.enqueue = function(data) {};


/**
 * @inheritDoc
 */
ds.Queue.prototype.dequeue = function() {};
