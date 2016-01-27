const test = require('tape');
const spawnShell = require('./');

test('it work!', t => {
  const result = spawnShell();
  t.equal(result, 42);
  t.end();
});
