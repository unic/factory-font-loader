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

## Usage/Quickstart
```js

import createFontLoader from '@unic/factory-font-loader';

// to load fonts on instatiation
const fontLoader = createFontLoader({ href: 'path/to/stylesheet.css' });

// to load fonts from somewhere else
const fontLoader = createFontLoader({ href: 'path/to/stylesheet.css', loadFonts: false })

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

**Parameter**
* options, <code>obj</code>

| Key | Type | Default | Value | Description |
| --- | --- | --- | --- | --- |
| href | string | undefined | <code>path/to/fonts.css</code> | must be provided when instantiating or you will get an error |
| loadFonts | boolean | true | <code>true</code> | calls method loadFonts on instantiation so you don't have to. Should be false if you are going to load fonts from a different place than you instantiate. |

**Example**
```js
const fontLoader = createFontLoader({
  href: 'path/to/font.css'
});
```

## Testing

This package is meant to run in the browser. So, in order to test it, we need to simulate a browser environment.

Start express server to host QUnit tests

<code>npm run testserver</code>

Run the QUnit tests in puppeteer (headless chrome)

<code>npm run browsertest</code>

## License

Apache-2.0
