const test = require('tape');
const spawnShell = require('./');
const concat = require('stream-string');
const co = require('co');

test('Use shell to run commands', co.wrap(function * (t) {

  const p = spawnShell('echo "it works"', {
    stdio: [0, 'pipe', 2]
  });

  const output = yield concat(p.stdout);
  t.equal(output, 'it works\n');
  t.end();

}));

test('Returned ChildProcess has a exitPromise prop that resolve with process exit code', co.wrap(function * (t) {

  const p = spawnShell('exit 1');
  const exitCode = yield p.exitPromise;
  t.equal(exitCode, 1);
  t.end();

}));


test('Returned ChildProcess exitPromise is rejected on spawn errors', t => {

  const p = spawnShell('', { shell: 'unknown' });

  p.exitPromise.catch(err => {
    t.equal(err.code, 'ENOENT');
    t.end();
  });

});


test('inject your package `node_modules/.bin` directory in path', co.wrap(function * (t) {

  const p = spawnShell('which eslint', {
    stdio: [0, 'pipe', 2]
  });

  const output = yield concat(p.stdout);
  t.equal(output, __dirname + '/node_modules/.bin/eslint\n');
  t.end();

}));
