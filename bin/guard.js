/* eslint no-console: 0 */
import chokidar from 'chokidar';
import childProcess from 'child_process';
import fs from 'fs';

let proc;

function toTest(path) {
  if (path.startsWith('test') && path.endsWith('test.js')) {
    return path;
  }
  if (!path.startsWith('src')) return undefined;

  const testPath = `test/${path.replace(/^src\//, '').replace(/\.js/, '-test.js')}`;
  return fs.existsSync(testPath) ? testPath : undefined;
}

chokidar.watch(['src', 'test']).on('change', path => {
  const testPath = toTest(path);
  if (!testPath) return;
  console.log(`Running Test file ${testPath}`);
  if (proc) proc.kill('SIGINT');

  proc = childProcess.spawn('./node_modules/.bin/_mocha', [testPath], { stdio: 'inherit' });
  proc.on('error', err => console.log(err));
});
