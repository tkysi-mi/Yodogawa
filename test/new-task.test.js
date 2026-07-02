'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('fs-extra');

const execFileP = promisify(execFile);
const CLI = path.join(__dirname, '..', 'bin', 'cli.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

async function newTask(args) {
  try {
    const { stdout, stderr } = await execFileP(process.execPath, [CLI, 'new-task', ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout, stderr: err.stderr };
  }
}

test('new-task: 空の docs/tasks では task000001 を作成する', async () => {
  const root = tmpdir();
  try {
    fs.mkdirpSync(path.join(root, 'docs', 'tasks'));
    const { code, stdout } = await newTask(['user-profile-edit', '--dir', root]);
    assert.strictEqual(code, 0);
    assert.ok(fs.existsSync(path.join(root, 'docs', 'tasks', 'task000001-user-profile-edit')));
    assert.match(stdout, /task000001-user-profile-edit/);
  } finally {
    fs.removeSync(root);
  }
});

test('new-task: 最大 ID + 1 を採番し、非準拠のディレクトリ名は無視する', async () => {
  const root = tmpdir();
  try {
    fs.mkdirpSync(path.join(root, 'docs', 'tasks', 'task000002-existing-one'));
    fs.mkdirpSync(path.join(root, 'docs', 'tasks', 'task9-nonconforming'));
    fs.outputFileSync(path.join(root, 'docs', 'tasks', 'task000005-a-file.md'), 'x'); // ファイルは無視
    const { code } = await newTask(['add-login-flow', '--dir', root]);
    assert.strictEqual(code, 0);
    assert.ok(fs.existsSync(path.join(root, 'docs', 'tasks', 'task000003-add-login-flow')));
  } finally {
    fs.removeSync(root);
  }
});

test('new-task: スラッグ形式違反は exit 2 でディレクトリを作らない', async () => {
  const root = tmpdir();
  try {
    fs.mkdirpSync(path.join(root, 'docs', 'tasks'));
    for (const bad of ['Bad_Slug', 'double--hyphen', '-leading', 'trailing-', 'あいう']) {
      const { code, stderr } = await newTask([bad, '--dir', root]);
      assert.strictEqual(code, 2, `${bad} は exit 2`);
      assert.ok(stderr.length > 0);
    }
    assert.deepStrictEqual(fs.readdirSync(path.join(root, 'docs', 'tasks')), []);
  } finally {
    fs.removeSync(root);
  }
});

test('new-task: スラッグ未指定は exit 2', async () => {
  const { code } = await newTask([]);
  assert.strictEqual(code, 2);
});

test('new-task: docs/tasks が無ければ exit 1 で a-001 を案内する', async () => {
  const root = tmpdir();
  try {
    const { code, stderr } = await newTask(['some-valid-slug', '--dir', root]);
    assert.strictEqual(code, 1);
    assert.match(stderr, /a-001-setup-doc-structure/);
  } finally {
    fs.removeSync(root);
  }
});

test('new-task: 語数が 3〜5 の範囲外なら警告のみで続行する', async () => {
  const root = tmpdir();
  try {
    fs.mkdirpSync(path.join(root, 'docs', 'tasks'));
    const { code, stderr } = await newTask(['fix-bug', '--dir', root]);
    assert.strictEqual(code, 0);
    assert.ok(fs.existsSync(path.join(root, 'docs', 'tasks', 'task000001-fix-bug')));
    assert.match(stderr, /3〜5/);
  } finally {
    fs.removeSync(root);
  }
});

test('new-task: --json は id/slug/path を stdout に純粋な JSON で返す', async () => {
  const root = tmpdir();
  try {
    fs.mkdirpSync(path.join(root, 'docs', 'tasks'));
    const { code, stdout } = await newTask(['user-profile-edit', '--dir', root, '--json']);
    assert.strictEqual(code, 0);
    assert.deepStrictEqual(JSON.parse(stdout), {
      id: 'task000001',
      slug: 'user-profile-edit',
      path: 'docs/tasks/task000001-user-profile-edit',
    });
  } finally {
    fs.removeSync(root);
  }
});
