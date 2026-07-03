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
const VALID = path.join(__dirname, 'fixtures', 'valid-project');
const BROKEN = path.join(__dirname, 'fixtures', 'broken-project');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

async function doctor(args) {
  try {
    const { stdout, stderr } = await execFileP(process.execPath, [CLI, 'doctor', ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout, stderr: err.stderr };
  }
}

test('doctor --json: broken project は exit 1 で機械可読な findings を返す', async () => {
  const { code, stdout } = await doctor(['--dir', BROKEN, '--json']);
  assert.strictEqual(code, 1);

  const report = JSON.parse(stdout); // stdout は純粋な JSON であること
  assert.strictEqual(report.version, 1);
  assert.strictEqual(report.ok, false);
  assert.deepStrictEqual(report.summary, { errors: 4, warnings: 6 });
  assert.deepStrictEqual(
    report.checks,
    [
      { name: 'structure', status: 'fail' },
      { name: 'id-trace', status: 'fail' },
      { name: 'placeholder', status: 'warn' },
      { name: 'links', status: 'fail' },
    ]
  );
  assert.strictEqual(report.findings.length, 10);
  for (const f of report.findings) {
    assert.ok(['error', 'warning'].includes(f.severity));
    assert.ok(typeof f.file === 'string' && !f.file.includes('\\'), 'file は posix 区切り');
    assert.ok(typeof f.message === 'string' && f.message.length > 0);
  }
});

test('doctor --json: valid project は exit 0 で ok:true', async () => {
  const { code, stdout } = await doctor(['--dir', VALID, '--json']);
  assert.strictEqual(code, 0);

  const report = JSON.parse(stdout);
  assert.strictEqual(report.ok, true);
  assert.deepStrictEqual(report.summary, { errors: 0, warnings: 0 });
  assert.deepStrictEqual(report.findings, []);
  assert.ok(report.checks.every((c) => c.status === 'pass'));
});

test('doctor: 人間可読出力にはチェック名・ファイルパス・サマリが含まれる', async () => {
  const { code, stdout } = await doctor(['--dir', BROKEN]);
  assert.strictEqual(code, 1);
  assert.match(stdout, /structure/);
  assert.match(stdout, /docs\/project\/01-requirements\/02-mvp-scope\.md/);
  assert.match(stdout, /4 errors?/);
  assert.match(stdout, /6 warnings?/);
});

test('doctor: --dir が存在しないパスなら exit 2（使い方の誤り）', async () => {
  const missing = path.join(os.tmpdir(), 'yodogawa-no-such-dir-000');
  const { code, stderr } = await doctor(['--dir', missing]);
  assert.strictEqual(code, 2);
  assert.ok(stderr.length > 0);
});

test('doctor: docs/project が無ければ docs/project 前提のチェックのみ skip し、links は走る', async () => {
  const root = tmpdir();
  try {
    // docs/project は無いが docs/tasks にリンク切れがある → links は報告すべき
    fs.outputFileSync(
      path.join(root, 'docs', 'tasks', 'task000001-demo', 'a-definition.md'),
      '[定義](../missing/b.md)\n'
    );
    const { code, stdout } = await doctor(['--dir', root, '--json']);
    assert.strictEqual(code, 1);
    const report = JSON.parse(stdout);
    assert.strictEqual(report.summary.errors, 2, 'structure の Error と links の Error');
    assert.deepStrictEqual(
      report.checks,
      [
        { name: 'structure', status: 'fail' },
        { name: 'id-trace', status: 'skip' },
        { name: 'placeholder', status: 'skip' },
        { name: 'links', status: 'fail' },
      ]
    );
  } finally {
    fs.removeSync(root);
  }
});

test('doctor: --dir の直後がフラグなら値の欠落として exit 2', async () => {
  const { code, stderr } = await doctor(['--dir', '--json']);
  assert.strictEqual(code, 2);
  assert.match(stderr, /--dir にはパスを指定してください/);
});

test('doctor: 未知のオプションは exit 2', async () => {
  const { code } = await doctor(['--nope']);
  assert.strictEqual(code, 2);
});

test('doctor: --dir の値が欠落していたら exit 2', async () => {
  const { code } = await doctor(['--dir']);
  assert.strictEqual(code, 2);
});
