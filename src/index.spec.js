(() => {
  QUnit.module('Module A');

  QUnit.test('first test within module', assert => {
    assert.ok(false, 'a dummy');
  });
})();

// factoryFontLoader({ href: 'path/to/css' });
