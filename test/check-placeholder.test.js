'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');

const { run } = require('../bin/checks/placeholder');

const VALID = path.join(__dirname, 'fixtures', 'valid-project');
const BROKEN = path.join(__dirname, 'fixtures', 'broken-project');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

test('placeholder: valid project は findings なし', () => {
  assert.deepStrictEqual(run({ rootDir: VALID }), []);
});

test('placeholder: broken project は 4 種の残置を Warning で検出する', () => {
  const findings = run({ rootDir: BROKEN });
  assert.strictEqual(findings.length, 4);
  assert.ok(findings.every((f) => f.check === 'placeholder' && f.severity === 'warning'));

  const commentRow = findings.find(
    (f) => f.file === 'docs/project/01-requirements/05-user-stories.md' && /未記入/.test(f.message)
  );
  assert.ok(commentRow, 'コメントのみのテーブルセル行を検出する');
  assert.strictEqual(typeof commentRow.line, 'number');

  const bracketToken = findings.find((f) => /\[役割\]/.test(f.message));
  assert.ok(bracketToken, '[役割] トークン残置を検出する');
  assert.strictEqual(bracketToken.file, 'docs/project/01-requirements/05-user-stories.md');

  const exampleMarker = findings.find((f) => /例/.test(f.message) && f.file.includes('01-domain-sketch'));
  assert.ok(exampleMarker, '**例:** マーカー残置を検出する');

  const emptySection = findings.find((f) => /非ゴール/.test(f.message));
  assert.ok(emptySection, '空セクション（非ゴール）を検出する');
  assert.strictEqual(emptySection.file, 'docs/project/01-requirements/01-product-brief.md');
});

test('placeholder: チェックボックスと Markdown リンクは誤検知しない', () => {
  const root = tmpdir();
  try {
    fs.outputFileSync(
      path.join(root, 'docs', 'project', '01-requirements', '01-product-brief.md'),
      [
        '# Product Brief',
        '',
        '## 背景 / 解く課題',
        '',
        '- [ ] 未完了のチェック項目',
        '- [x] 完了済み項目',
        '[目的](./02-mvp-scope.md) へのリンクはトークンではない。',
        '',
      ].join('\n')
    );
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});

test('placeholder: 「（任意）」付き見出しの空セクションは許容する', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    const sketch = path.join(root, 'docs', 'project', '03-domain', '01-domain-sketch.md');
    fs.appendFileSync(sketch, '\n## 状態遷移（任意）\n\n## 簡易ドメイン図（任意）\n');
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});
