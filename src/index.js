/**
 * factory-font-loader
 *
 * @author Ben Sonley
 * @copyright Unic AG
 */

import logger from '@unic/composite-logger';
import observer from '@unic/composite-observer';

export default (href = '/assets/css/fonts.css?v1') => {
  const instance = {};

  // ** COMPOSITION **
  Object.assign(instance, logger('FontLoader'), observer());

  // ** PRIVATE FUNCTIONS **

  /**
   * If we have the fonts in localStorage or if we've cached them using the native browser cache
   * @return {Boolean}
   */
  /* eslint-disable prettier/prettier */
  const fileIsCached = () => (
    (window.localStorage && localStorage.fontCssCache) || document.cookie.indexOf('fontCssCache') > -1
  );
  /* eslint-enable */

  /**
   * If browser supports localStorage and XMLHttpRequest
   * @return {boolean}
   */
  /* eslint-disable prettier/prettier */
  const supportsLocalStorageAndXHR = () => (
    !!(window.localStorage && window.XMLHttpRequest)
  );
  /* eslint-enable */

  /**
   * Determine whether a css file has been cached locally
   * and if it's the current version
   *
   * @param  {String} cssHref	- CSS path to check vs the cached one
   * @return {Boolean}
   */
  /* eslint-disable prettier/prettier */
  const cacheIsValid = cssHref => (
    localStorage.fontCssCache && localStorage.fontCssCacheFile === cssHref
  );
  /* eslint-enable */

  /**
   * add a link to the font stylesheet
   */
  const createFontStylesheet = () => {
    const stylesheet = document.createElement('link');
    instance.log('called createFontStyleSheet');
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
    instance.log('called injectRawStyle');
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
  const fetchAndStoreStylesheet = () => {
    const xhr = new XMLHttpRequest();
    instance.log('called fetchAndStoreStylesheet');

    xhr.open('GET', href, true);

    // cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // once we have the content, quickly inject the css rules
        injectRawStyle(xhr.responseText);

        // and cache the text content for further use
        // notice that this overwrites anything that might have already been previously cached
        localStorage.fontCssCache = xhr.responseText;
        localStorage.fontCssCacheFile = href;
      }
    };

    xhr.send();
  };

  /**
   * Inject Stylesheet
   */
  const injectFontsStylesheet = () => {
    // check if we can read from or write to localStorage
    instance.log('supportLocalStorageAndHXR?', supportsLocalStorageAndXHR());
    if (supportsLocalStorageAndXHR()) {
      instance.log('cache is valid?', cacheIsValid(href));
      if (cacheIsValid(href)) {
        // use cached version
        injectRawStyle(localStorage.fontCssCache);
      } else {
        // fetch stylesheet and store it in cache for next tie
        fetchAndStoreStylesheet();
      }
    } else {
      // create stylesheet
      createFontStylesheet();
    }
  };

  instance.loadFonts = () => {
    instance.log('file is cached?', fileIsCached());
    if (fileIsCached()) {
      instance.log('just use the cached version');
      injectFontsStylesheet();
    } else {
      instance.log(
        "don't block the loading of the page; wait until it's done; then download fonts",
      );
      document.addEventListener('DOMContentLoaded', injectFontsStylesheet);
    }
  };

  return instance;
};
