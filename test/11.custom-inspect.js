'use strict';
const { expect } = require('chai');

describe('[util.inspect.custom]()', function () {
	const print = require('util').inspect;
	class SuperPromise extends Promise {}
	require('../.')(SuperPromise);
	
	class Foobar {
		constructor() {
			this.foo = 123;
			this.bar = 456;
			this.baz = 789;
			this.qux = 101112.123;
			this.abc = 'yup';
			this.xyz = { some: 'thing' };
		}
	}
	
	it('should not affect classes that it is not explicitly applied to', function () {
		const symbol = require('util').inspect.custom;
		expect(symbol).to.be.a('symbol');
		expect(Promise.prototype[symbol]).to.equal(undefined);
		expect(SuperPromise.prototype[symbol]).to.be.a('function');
	});
	it('should output correctly when the promise is pending', function () {
		const str = print(new SuperPromise(() => {}));
		expect(str).to.be.a('string');
		expect(str).to.equal('SuperPromise { <pending> }');
	});
	describe('should output correctly when the promise is fulfilled', function () {
		specify('with a one-line value', function () {
			const str = print(SuperPromise.resolve(123));
			expect(str).to.be.a('string');
			expect(str).to.equal('SuperPromise { 123 }');
		});
		specify('with a multi-line value', function () {
			const str = print(SuperPromise.resolve(new Foobar));
			expect(str).to.be.a('string');
			expect(str).to.equal('SuperPromise { \n  Foobar {\n  foo: 123,\n  bar: 456,\n  baz: 789,\n  qux: 101112.123,\n  abc: \'yup\',\n  xyz: { some: \'thing\' } } }');
		});
	});
	describe('should output correctly when the promise is rejected', function () {
		specify('with a one-line reason', function () {
			const promise = SuperPromise.reject(456);
			const str = print(promise);
			promise.catch(() => {});
			expect(str).to.be.a('string');
			expect(str).to.equal('SuperPromise { <rejected> 456 }');
		});
		specify('with a multi-line reason', function () {
			const promise = SuperPromise.reject(new Foobar);
			const str = print(promise);
			promise.catch(() => {});
			expect(str).to.be.a('string');
			expect(str).to.equal('SuperPromise { <rejected> \n  Foobar {\n  foo: 123,\n  bar: 456,\n  baz: 789,\n  qux: 101112.123,\n  abc: \'yup\',\n  xyz: { some: \'thing\' } } }');
		});
	});
});
