import test from 'ava';
import factoryFontLoader from './index';

test('factoryFontLoader is executed without failing', t => {
  t.notThrows(factoryFontLoader);
});
