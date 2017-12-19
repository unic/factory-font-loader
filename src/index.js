/**
 * factory-font-loader
 *
 * @author Ben Sonley
 * @copyright Unic AG
 */

import 'whatwg-fetch';
import logger from '@unic/composite-logger';

const LOGGER_NAME = 'FontLoader';
const defaultOptions = {
  loadFonts: true,
};

export default (
  { href = false, hrefPartial = false, loadFonts = defaultOptions.loadFonts } = {},
) => {
  const instance = {};

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
  const fileIsCached = () =>
    localStorage.fontCssCache || document.cookie.indexOf('fontCssCache') > -1;

  /**
   * check if support support localStorage
   * @return {Boolean}
   */
  const supportsLocalStorage = () => window && window.localStorage;

  /**
   * Determine whether a css file has been cached locally
   * and if it's the current version
   *
   * @param  {String} cssHref	- CSS path to check vs the cached one
   * @return {Boolean}
   */
  const cacheIsValid = hrefString =>
    localStorage.fontCssCache && localStorage.fontCssCacheFile === hrefString;

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
   * checkResponse
   * @description check if fetch was successful
   * @param  {Promise} response
   * @return {Promise}          return the response if it is 'OK' or throw error
   */
  const checkResponse = response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  };

  /**
   * parseResponse
   * @description extract data from response
   * @param  {Promise} response
   * @return {String}          return data from response in a string
   */
  const parseResponse = response => response.text();

  /**
   * cacheResponse
   * @description store response in browser cache for later use and pass it through to next handler
   * @param  {String} text font stylesheet
   * @return {String}      font stylesheet
   */
  const cacheResponse = text => {
    localStorage.fontCssCache = text;
    localStorage.fontCssCacheFile = href;
    return text;
  };

  // ** Public Functions **

  instance.loadFonts = () => {
    if (supportsLocalStorage()) {
      if (fileIsCached() && cacheIsValid(href)) {
        // inject the cached stylesheet
        instance.log('just use the cached version');
        injectRawStyle(localStorage.fontCssCache);
        return;
      } else if (hrefPartial) {
        // fetch and inject the partial stylesheet
        instance.log('Load a single font-face first.');
        fetch(hrefPartial)
          .then(response => checkResponse(response))
          .then(response => parseResponse(response))
          .then(text => injectRawStyle(text))
          .catch(msg => instance.log('error', msg));
      }

      // fetch all the fonts after the DOM content is loaded
      instance.log('Wait until page is loaded and then download all the fonts');
      document.addEventListener('DOMContentLoaded', () => {
        fetch(href)
          .then(response => checkResponse(response))
          .then(response => parseResponse(response))
          .then(text => cacheResponse(text))
          .then(text => injectRawStyle(text))
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
