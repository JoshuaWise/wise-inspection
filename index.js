const util = require('util');
const inspect = require('bindings')({
	bindings: 'inspect.node',
	module_root: __dirname
}).inspect;

function format(value, options) {
	const str = util.inspect(value, options);
	return str.includes('\n') ? '\n  ' + str : str;
}

function customInspect(_, options) {
	if (this == null || this.inspect !== inspect) {
		throw new TypeError('Illegal invocation');
	}
	const inspection = this.inspect();
	const name = String((this.constructor.name || 'Promise'));
	switch (inspection.state) {
		case 'fulfilled':
			return `${name} { ${format(inspection.value, options)} }`;
		case 'rejected':
			return `${name} { <rejected> ${format(inspection.reason, options)} }`;
		default:
			return `${name} { <pending> }`;
	}
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
	Class.prototype[util.inspect.custom] = customInspect;
	return Class;
}

module.exports = wiseInspection;
