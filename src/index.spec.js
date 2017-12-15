// import QUnit from 'qunit';
// import factoryFontLoader from './index';

// QUnit.test('a basic test example', (assert) => {
//   var value = 'hello';
//   assert.equal(value, 'hello', 'We expect value to be hell0');
// });

QUnit.test('ok test', assert => {
  assert.ok(true, 'true succeeds');
  assert.ok('non-empty', 'non-empty string succeeds');

  assert.ok(false, 'false fails');
  assert.ok(0, '0 fails');
  assert.ok(NaN, 'NaN fails');
  assert.ok('', 'empty string fails');
  assert.ok(null, 'null fails');
  assert.ok(undefined, 'undefined fails');
});
console.log('not executed');

// factoryFontLoader({ href: 'path/to/css' });
