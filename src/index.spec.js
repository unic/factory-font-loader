import createFactoryFontLoader from './index';

(() => {
  QUnit.module('Factory Font Loader Tests');

  QUnit.test('factory font loader should execute without error', assert => {
    // test if function does not raise exception in QUnit
    // https://stackoverflow.com/questions/9822400/how-to-assert-that-a-function-does-not-raise-an-exception

    const fontLoader = createFactoryFontLoader({ href: 'path/to/css' });
    assert.ok(true, 'My function does not crash');
  });
})();

// factoryFontLoader({ href: 'path/to/css' });
