'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');
const prompts = require('prompts');

const { run, main } = require('../bin/cli.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

test('dispatch: 引数なしは従来の対話インストールを起動する（後方互換）', async () => {
  const cwd = tmpdir();
  try {
    prompts.inject(['claude']);
    const code = await run([], { cwd });
    assert.strictEqual(code, 0);
    assert.ok(fs.existsSync(path.join(cwd, '.claude', 'skills')), '.claude/skills がコピーされる');
  } finally {
    fs.removeSync(cwd);
  }
});

test('dispatch: main は install の別名としてエクスポートされ続ける', () => {
  assert.strictEqual(typeof main, 'function');
});

test('dispatch: --help は exit 0', async () => {
  assert.strictEqual(await run(['--help'], { cwd: process.cwd() }), 0);
  assert.strictEqual(await run(['help'], { cwd: process.cwd() }), 0);
});

test('dispatch: 未知コマンドは exit 2', async () => {
  assert.strictEqual(await run(['fix-everything'], { cwd: process.cwd() }), 2);
});
