const test = require('tape');
const spawnShell = require('./');
const concat = require('concat-stream');

test('Use shell to run commands', t => {

  const resultPromise = spawnShell('echo "it works"', {
    stdio: [0, 'pipe', 2]
  });

  resultPromise.process.stdout.pipe(concat(
    {encoding: 'string'},
    output => {
      t.equal(output, 'it works\n');
      t.end();
    }
  ));

});

test('Return a promise that resolve with process exit code', t => {

  const resultPromise = spawnShell('exit 1');

  resultPromise.then(exitCode => {
    t.equal(exitCode, 1);
    t.end();
  });

});


test('return a promise that rejects on spawn errors', t => {

  const resultPromise = spawnShell('', { shell: 'unknown' });

  resultPromise.catch(err => {
    t.equal(err.code, 'ENOENT');
    t.end();
  });

});


test('inject your package `node_modules/.bin` directory in path', t => {

  const resultPromise = spawnShell('which eslint', {
    stdio: [0, 'pipe', 2]
  });

  resultPromise.process.stdout.pipe(concat(
    {encoding: 'string'},
    output => {
      t.equal(output, __dirname + '/node_modules/.bin/eslint\n');
      t.end();
    }
  ));

});
