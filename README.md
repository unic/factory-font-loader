# factory-font-loader

lazy font loader

## Installation

```shell
$ npm install @unic/factory-font-loader
```

## Importing

```javascript
// ES6 Module
import factoryFontLoader from '@unic/factory-font-loader';

// CommomJS
const factoryFontLoader = require('@unic/factory-font-loader').default;
```

## Usage

A composite is a function or an object which can be used as is or to merged with another object. These composites are normally used in the factory/composition pattern.

Helpful Ressources:
* https://www.youtube.com/watch?v=ImwrezYhw4w
* https://www.youtube.com/watch?v=wfMtDGfHWpA

**Important**: In further examples and the API we'll just infer that you've already generated your new object with the composite applied to it and will not give any more examples on how to do that.

**Examples**
```js
// Applying the composite to a new object literal
const obj = Object.assign({}, factoryFontLoader());

// Equivalent with lodash.merge
const obj = _.merge({}, factoryFontLoader());

// Just use it as a
const obj = factoryFontLoader();
```

## API

TODO: Provide information for this package

## License

Apache-2.0
