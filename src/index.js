/**
 * factory-font-loader
 *
 * @author Ben Sonley
 * @copyright Unic AG
 */

import logger from '@unic/composite-logger';

const defaultOptions = {
  loadFonts: true,
};

export default (
  { href = false, hrefPartial = false, loadFonts = defaultOptions.loadFonts } = {},
) => {
  const instance = {};
  const LOGGER_NAME = 'FontLoader';

  if (!href) {
    throw new Error('Please provide a path to your font stylesheet');
  }

  // ** Composition **
  Object.assign(instance, logger(LOGGER_NAME));

  // ** Private Functions **

  /**
   * If we have the fonts in localStorage or if we've cached them using the native browser cache
   * @return {Boolean}
   */
  /* eslint-disable prettier/prettier */
  const fileIsCached = () => (
    localStorage.fontCssCache || document.cookie.indexOf('fontCssCache') > -1
  );
  /* eslint-enable */

  /**
   * check if support support localStorage
   * @return {boolean}
   */
  const supportsLocalStorage = () => window && window.localStorage;

  /**
   * If browser supports XMLHttpRequest
   * @return {boolean}
   */
  const supportsXHR = () => window && window.XMLHttpRequest;

  /**
   * Determine whether a css file has been cached locally
   * and if it's the current version
   *
   * @param  {String} cssHref	- CSS path to check vs the cached one
   * @return {Boolean}
   */
  /* eslint-disable prettier/prettier */
  const cacheIsValid = hrefString => (
    localStorage.fontCssCache && localStorage.fontCssCacheFile === hrefString
  );
  /* eslint-enable */

  /**
   * add a link to the font stylesheet
   */
  const createFontStylesheet = () => {
    const stylesheet = document.createElement('link');
    stylesheet.href = href;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(stylesheet);

    // just use the native browser cache
    // this requires a good expires header on the server
    document.cookie = 'fontCssCache';
  };

  /**
   * inject font css to DOM via inline stylesheet
   * @param text, font css style
   */
  const injectRawStyle = text => {
    const style = document.createElement('style');
    // cater for IE8 which doesn't support style.innerHTML
    style.setAttribute('type', 'text/css');

    if (style.styleSheet) {
      style.styleSheet.cssText = text;
    } else {
      style.innerHTML = text;
    }

    document.getElementsByTagName('head')[0].appendChild(style);
  };

  /**
   * fetch stylesheet and store it in localStorage
   */
  const fetchAndInjectStylesheet = src =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', src, true);

      xhr.onload = () => {
        instance.log('inject the raw style from xhr', src);
        injectRawStyle(xhr.responseText);
        return resolve(xhr.responseText);
      };

      xhr.onerror = () => reject(xhr.statusText);

      xhr.send();
    });

  // ** Public Functions **

  instance.loadFonts = () => {
    if (supportsLocalStorage() && supportsXHR()) {
      if (fileIsCached() && cacheIsValid(href)) {
        // inject the cached stylesheet
        instance.log('just use the cached version');
        injectRawStyle(localStorage.fontCssCache);
        return;
      } else if (hrefPartial) {
        // fetch and inject the partial stylesheet
        instance.log('Load a single font-face first.');
        fetchAndInjectStylesheet(hrefPartial);
      }

      // fetch all the fonts after the DOM content is loaded
      instance.log('Wait until page is loaded and then download all the fonts');
      document.addEventListener('DOMContentLoaded', () => {
        fetchAndInjectStylesheet(href)
          .then(text => {
            localStorage.fontCssCache = text;
            localStorage.fontCssCacheFile = href;
          })
          .catch(msg => instance.log('error', msg));
      });
    } else {
      document.addEventListener('DOMContentLoaded', createFontStylesheet);
    }
  };

  // load the fonts on instantiation
  if (loadFonts) instance.loadFonts();

  return instance;
};
