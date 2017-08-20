var util = require('util');
var inspect = require('bindings')({
	bindings: 'inspect.node',
	module_root: __dirname
}).inspect;

function format(value) {
	var string = util.format(value);
	if (string.indexOf('\n') !== -1) return '\n  ' + string;
	return string;
}

function customInspect() {
	if (this == null || this.inspect !== inspect) {
		throw new TypeError('Illegal invocation');
	}
	var inspection = this.inspect();
	var name = '' + (this.constructor.name || 'Promise');
	if (inspection.state === 'fulfilled') {
		return name + ' { ' + format(inspection.value) + ' }';
	}
	if (inspection.state === 'rejected') {
		return name + ' { <rejected> ' + format(inspection.reason) + ' }';
	}
	return name + ' { <pending> }';
}

function isNativePromise(fn) {
	return fn.prototype instanceof Object
		&& (fn.prototype instanceof Promise || fn.prototype === Promise.prototype)
		&& fn.prototype.constructor === fn;
}

function wiseInspection(Class) {
	if (typeof Class !== 'function') {
		throw new TypeError('Expected argument to be a function/class');
	}
	if (!isNativePromise(Class)) {
		throw new TypeError('The given class is not a native Promise');
	}
	Class.prototype.inspect = inspect;
	if (util.inspect && typeof util.inspect.custom === 'symbol') {
		Class.prototype[util.inspect.custom] = customInspect;
	}
	return Class;
}

module.exports = wiseInspection;
