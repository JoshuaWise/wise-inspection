'use strict';
const { expect } = require('chai');

describe('.inspect()', function () {
	class SuperPromise extends Promise {}
	require('../.')(SuperPromise);
	
	it('should not affect classes that it is not explicitly applied to', function () {
		expect(Promise.prototype.inspect).to.equal(undefined);
		expect(SuperPromise.prototype.inspect).to.be.a('function');
	});
	it('should have a value when the promise is fulfilled', function () {
		const obj = SuperPromise.resolve(123).inspect();
		expect(obj.state).to.equal('fulfilled');
		expect(obj.value).to.equal(123);
		expect(obj.reason).to.equal(undefined);
		expect(Object.keys(obj).length).to.equal(2);
	});
	it('should have a reason when the promise is rejected', function () {
		const promise = SuperPromise.reject(456);
		const obj = promise.inspect();
		promise.catch(() => {});
		expect(obj.state).to.equal('rejected');
		expect(obj.value).to.equal(undefined);
		expect(obj.reason).to.equal(456);
		expect(Object.keys(obj).length).to.equal(2);
	});
	it('should have no value/reason when the promise is pending', function () {
		const obj = new SuperPromise(() => {}).inspect();
		expect(obj.state).to.equal('pending');
		expect(obj.value).to.equal(undefined);
		expect(obj.reason).to.equal(undefined);
		expect(Object.keys(obj).length).to.equal(1);
	});
});
