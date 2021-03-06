import {join} from 'path';
import test from 'ava';
import concat from 'stream-string';
import spawnShell from '.';

test('Use shell to run commands', async t => {
	const p = spawnShell('echo "it works"', {
		stdio: [0, 'pipe', 2]
	});

	const output = await concat(p.stdout);
	t.is(output, 'it works\n');
});

test('Returned ChildProcess has a exitPromise prop that resolve with process exit code', async t => {
	const p = spawnShell('exit 1');
	const exitCode = await p.exitPromise;
	t.is(exitCode, 1);
});

test('Returned ChildProcess exitPromise is rejected on spawn errors', async t => {
	const p = spawnShell('', {shell: 'unknown'});

	const err = await t.throwsAsync(p.exitPromise);
	t.is(err.code, 'ENOENT');
});

test('inject your package `node_modules/.bin` directory in path', async t => {
	const p = spawnShell('which ava', {
		stdio: [0, 'pipe', 2],
		env: {PATH: process.env.PATH}
	});

	const output = await concat(p.stdout);
	t.is(output, join(__dirname, '/node_modules/.bin/ava\n'));
});
