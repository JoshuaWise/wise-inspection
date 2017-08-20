# wise-inspection [![Build Status](https://img.shields.io/travis/JoshuaWise/wise-inspection.svg)](https://travis-ci.org/JoshuaWise/wise-inspection)

This package augments native promises (or a subclass thereof) with synchronous inspection capabilities.

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

## License

[MIT](https://github.com/JoshuaWise/integer/blob/master/LICENSE)
