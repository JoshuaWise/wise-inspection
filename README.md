# wise-inspection [![Build Status](https://img.shields.io/travis/JoshuaWise/wise-inspection.svg)](https://travis-ci.org/JoshuaWise/wise-inspection)

This package augments native promises (or a subclass thereof) with synchronous inspection capabilities.

This is only possible for Node.js versions 8 and up.

## Installation

```bash
npm install --save wise-inspection
```

## Usage

```js
require('wise-inspection')(Promise);

const promise = Promise.resolve('foobar');
console.log(promise.inspect());
// => { state: 'fulfilled', value: 'foobar' }
```

## The inspection object

If the promise is:

* fulfilled, the descriptor will be `{ state: 'fulfilled', value: <fulfillmentValue> }`
* rejected, the descriptor will be `{ state: 'rejected', reason: <rejectionReason> }`
* pending, the descriptor will be `{ state: 'pending' }`

## License

[MIT](https://github.com/JoshuaWise/integer/blob/master/LICENSE)
