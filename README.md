# factory-font-loader

lazy font loader that waits until DOM is loaded before loading web fonts. and caches them for the future

## Installation

```shell
$ npm install @unic/factory-font-loader
```

## Importing

```javascript
// ES6 Module
import createFontLoader from '@unic/factory-font-loader';

// CommomJS
const createFontLoader = require('@unic/factory-font-loader').default;
```

## Usage
```js
import createFontLoader from '@unic/factory-font-loader';

const fontLoader = createFontLoader('path/to/stylesheet.css');
fontLoader.loadFonts();
```

**Important**: In further examples and the API we'll just infer that you've already generated your new object with the composite applied to it and will not give any more examples on how to do that.

**Examples**
```js
// Applying the composite to a new object literal
const obj = Object.assign({}, factoryFontLoader('path/to/stylesheet.css'));

// Equivalent with lodash.merge
const obj = _.merge({}, factoryFontLoader('path/to/stylesheet.css'));

// Just use it as a
const obj = factoryFontLoader('path/to/stylesheet.css');
```

## API

FontLoader has own functionality and functionality provided by included composites.

**Own methods**
* [loadFonts()](#loadFonts)

**Logger Composite**  
Documentation of these methods are extern
* [log()](https://github.com/unic/composite-logger)

### loadFonts()
<a name="loadFonts"></a>

Load web fonts asynchronously. Checks if browser support localStorage.
Checks if there is a valid cached version of web font in localStorage. If so, loads fonts from cache.
If not, loads fonts after `DOMContentLoaded` event.

TODO:
* expand to use Flash of Faux Text (FOFT) or Flash of Unstyled Text (FOUT)
  ** depends on ability to subset fonts

## License

Apache-2.0
