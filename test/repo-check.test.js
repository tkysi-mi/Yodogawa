'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('fs-extra');

const execFileP = promisify(execFile);
const SCRIPT = path.join(__dirname, '..', 'scripts', 'repo-check.mjs');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

async function runScript(args) {
  try {
    const { stdout, stderr } = await execFileP(process.execPath, [SCRIPT, ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code, stdout: err.stdout, stderr: err.stderr };
  }
}

test('repo-check: 実リポジトリは exit 0（参照・README 表・リンクが健全）', async () => {
  const { code, stdout, stderr } = await runScript([]);
  assert.strictEqual(code, 0, `stdout: ${stdout}\nstderr: ${stderr}`);
  assert.match(stdout, /^ok:/m);
});

test('repo-check: 壊れた構成では各問題を報告して exit 1', async () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(
      path.join(root, 'skills', 'a-001-setup-foo', 'SKILL.md'),
      [
        '# Foo',
        '',
        '存在しないスキル `/a-999-missing-skill` を参照。',
        '短縮形 `/b-001` はディレクトリが 2 つあり曖昧。',
        '[壊れたリンク](../missing.md) も含む。',
        '',
      ].join('\n')
    );
    fs.outputFileSync(path.join(root, 'skills', 'b-001-first-variant', 'SKILL.md'), '# x\n');
    fs.outputFileSync(path.join(root, 'skills', 'b-001-second-variant', 'SKILL.md'), '# y\n');
    fs.outputFileSync(
      path.join(root, 'README.md'),
      [
        '# Demo',
        '',
        '## スキル一覧',
        '',
        '| # | コマンド | 名前 | 説明 |',
        '|---|---------|------|------|',
        '| 1 | `/c-001` | 存在しない | ディレクトリなし |',
        '',
      ].join('\n')
    );

    const { code, stderr } = await runScript([root]);
    assert.strictEqual(code, 1);
    assert.match(stderr, /a-999-missing-skill/, 'フル形の参照切れを報告');
    assert.match(stderr, /b-001/, '短縮形の曖昧参照を報告');
    assert.match(stderr, /c-001/, 'README 表にあるがディレクトリが無いコードを報告');
    assert.match(stderr, /a-001/, 'ディレクトリがあるが README 表に無いコードを報告');
    assert.match(stderr, /missing\.md/, 'skills 内の相対リンク切れを報告');
  } finally {
    fs.removeSync(root);
  }
});

test('repo-check: skills/*/evals 配下の壊れたフィクスチャは検査対象外、evals 外は従来どおり検出', async () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(path.join(root, 'skills', 'a-001-setup-foo', 'SKILL.md'), '# Foo\n');
    // evals フィクスチャ: 壊れた参照・リンクを意図的に含む（検出されないこと）
    fs.outputFileSync(
      path.join(root, 'skills', 'a-001-setup-foo', 'evals', 'files', 'broken-docs', 'doc.md'),
      [
        '# Fixture',
        '',
        '存在しないスキル `/a-888-fixture-only` を参照。',
        '[壊れたリンク](../missing-in-fixture.md) も含む。',
        '',
      ].join('\n')
    );
    // evals 外の壊れ（検出されること）
    fs.outputFileSync(
      path.join(root, 'skills', 'b-001-real-skill', 'SKILL.md'),
      ['# Real', '', '[壊れたリンク](./missing-outside.md)', ''].join('\n')
    );
    fs.outputFileSync(
      path.join(root, 'README.md'),
      [
        '## スキル一覧',
        '',
        '| # | コマンド | 名前 | 説明 |',
        '|---|---------|------|------|',
        '| 1 | `/a-001` | Foo | セットアップ |',
        '| 2 | `/b-001` | Real | 実スキル |',
        '',
      ].join('\n')
    );

    const { code, stderr } = await runScript([root]);
    assert.strictEqual(code, 1);
    assert.doesNotMatch(stderr, /a-888-fixture-only/, 'evals 内の参照切れは報告しない');
    assert.doesNotMatch(stderr, /missing-in-fixture\.md/, 'evals 内のリンク切れは報告しない');
    assert.match(stderr, /missing-outside\.md/, 'evals 外のリンク切れは従来どおり報告');
  } finally {
    fs.removeSync(root);
  }
});

test('repo-check: パス断片（skills/a-002-... 等）は参照として誤検知しない', async () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(
      path.join(root, 'skills', 'a-001-setup-foo', 'SKILL.md'),
      ['# Foo', '', 'パス `skills/a-777-not-a-ref/SKILL.md` は参照ではない。', ''].join('\n')
    );
    fs.outputFileSync(
      path.join(root, 'README.md'),
      [
        '## スキル一覧',
        '',
        '| # | コマンド | 名前 | 説明 |',
        '|---|---------|------|------|',
        '| 1 | `/a-001` | Foo | セットアップ |',
        '',
      ].join('\n')
    );
    const { code, stderr } = await runScript([root]);
    assert.strictEqual(code, 0, stderr);
  } finally {
    fs.removeSync(root);
  }
});
