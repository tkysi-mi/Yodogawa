'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('fs-extra');

const { run } = require('../bin/checks/links');

const execFileP = promisify(execFile);
const VALID = path.join(__dirname, 'fixtures', 'valid-project');
const BROKEN = path.join(__dirname, 'fixtures', 'broken-project');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

// execFile は非 0 exit で reject するため、exit code を吸収して返す
async function runNode(args) {
  try {
    const { stdout } = await execFileP(process.execPath, args);
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.code, stdout: err.stdout };
  }
}

test('links: valid project は findings なし', () => {
  assert.deepStrictEqual(run({ rootDir: VALID }), []);
});

test('links: broken project は相対リンク切れを Error で検出する', () => {
  const findings = run({ rootDir: BROKEN });
  assert.strictEqual(findings.length, 1);
  assert.strictEqual(findings[0].severity, 'error');
  assert.strictEqual(findings[0].file, 'docs/project/01-requirements/05-user-stories.md');
  assert.strictEqual(findings[0].line, 3);
  assert.match(findings[0].message, /nonexistent\.md/);
});

test('links: 外部 URL・アンカーのみ・フェンス内・コメント内リンクは対象外', () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(
      path.join(root, 'docs', 'note.md'),
      [
        '[外部](https://example.com/broken) [メール](mailto:a@example.com) [アンカー](#見出し)',
        '```',
        '[フェンス内](missing.md)',
        '```',
        '<!-- [コメント内](missing.md) -->',
        '',
      ].join('\n')
    );
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});

test('links: tel:/data: 等の任意の URI スキームは相対パスとして誤検知しない', () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(
      path.join(root, 'docs', 'note.md'),
      '[電話](tel:+81-3-1234-5678) [データ](data:text/plain;base64,SGk=) [FTP](ftp://host/x)\n'
    );
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});

test('links: フラグメント付き・URL エンコードされた相対リンクを解決できる', () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(path.join(root, 'docs', 'sub dir', 'target.md'), '# t\n');
    fs.outputFileSync(
      path.join(root, 'docs', 'index.md'),
      '[a](sub%20dir/target.md#anchor) [b](./sub dir/target.md)\n'
    );
    // 注: [b] 形式（スペース入り生パス）は Markdown 的に不正なため抽出されない。
    // 抽出されるのは [a] のみで、デコードして解決できること。
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});

test('links: docs/tasks 配下も検査対象', () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(
      path.join(root, 'docs', 'tasks', 'task000001-demo', 'a-definition.md'),
      '[定義](../missing/b.md)\n'
    );
    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].file, 'docs/tasks/task000001-demo/a-definition.md');
  } finally {
    fs.removeSync(root);
  }
});

test('単体実行シム: 各チェックが CLI として exit code で pass/fail を返す', async () => {
  const checksDir = path.join(__dirname, '..', 'bin', 'checks');

  for (const name of ['structure', 'id-trace', 'links']) {
    const { code, stdout } = await runNode([path.join(checksDir, `${name}.js`), BROKEN]);
    assert.strictEqual(code, 1, `${name}: broken-project では exit 1`);
    assert.ok(stdout.length > 0, `${name}: findings が出力される`);
  }

  // placeholder は broken-project で Warning のみ → exit 0 だが findings は出力される
  const placeholder = await runNode([path.join(checksDir, 'placeholder.js'), BROKEN]);
  assert.strictEqual(placeholder.code, 0);
  assert.ok(placeholder.stdout.length > 0);

  for (const name of ['structure', 'id-trace', 'placeholder', 'links']) {
    const { code } = await runNode([path.join(checksDir, `${name}.js`), VALID]);
    assert.strictEqual(code, 0, `${name}: valid-project では exit 0`);
  }
});
