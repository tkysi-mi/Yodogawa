'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');

const { run } = require('../bin/checks/structure');

const VALID = path.join(__dirname, 'fixtures', 'valid-project');
const BROKEN = path.join(__dirname, 'fixtures', 'broken-project');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

test('structure: valid project (04-design 未着手) は findings なし', () => {
  assert.deepStrictEqual(run({ rootDir: VALID }), []);
});

test('structure: broken project はフロンティア内の必須ファイル欠落と必須見出し欠落を Error にする', () => {
  const findings = run({ rootDir: BROKEN });
  assert.strictEqual(findings.length, 2);
  assert.ok(findings.every((f) => f.check === 'structure' && f.severity === 'error'));

  const missingFile = findings.find((f) => f.file === 'docs/project/01-requirements/02-mvp-scope.md');
  assert.ok(missingFile, '02-mvp-scope.md の欠落が Error になる');
  assert.strictEqual(missingFile.line, null);

  const missingHeading = findings.find((f) => f.file === 'docs/project/01-requirements/01-product-brief.md');
  assert.ok(missingHeading, 'product-brief の見出し欠落が Error になる');
  assert.match(missingHeading.message, /成功指標/);
});

test('structure: docs/project が無い場合は Error 1 件のみ', () => {
  const root = tmpdir();
  try {
    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].severity, 'error');
    assert.strictEqual(findings[0].file, 'docs/project');
  } finally {
    fs.removeSync(root);
  }
});

test('structure: 必須見出しは前方一致（括弧の補足を削っても OK）', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    const brief = path.join(root, 'docs', 'project', '01-requirements', '01-product-brief.md');
    const content = fs.readFileSync(brief, 'utf8')
      .replace('## 成功指標（North Star / KPI / Guardrail）', '## 成功指標');
    fs.writeFileSync(brief, content);
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});

test('structure: 必須テーブルヘッダの欠落は Error', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    const stories = path.join(root, 'docs', 'project', '01-requirements', '05-user-stories.md');
    const content = fs.readFileSync(stories, 'utf8').replace('ストーリーID', 'ID');
    fs.writeFileSync(stories, content);
    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].severity, 'error');
    assert.match(findings[0].message, /ストーリーID/);
  } finally {
    fs.removeSync(root);
  }
});

test('structure: 04-design が存在するのに a-006 生成物が無ければ Warning', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    fs.outputFileSync(
      path.join(root, 'docs', 'project', '04-design', '01-tech-stack.md'),
      ['# テックスタック', '', '## テックスタック一覧', '', '- Node.js', '', '## 技術選定の基準', '', '- 実績優先', ''].join('\n')
    );
    const findings = run({ rootDir: root });
    const files = findings.map((f) => f.message);
    assert.strictEqual(findings.length, 2);
    assert.ok(findings.every((f) => f.severity === 'warning'));
    assert.ok(files.some((m) => m.includes('AI_CONTEXT.md')));
    assert.ok(files.some((m) => m.includes('STAKEHOLDER-SUMMARY.md')));
  } finally {
    fs.removeSync(root);
  }
});

test('structure: docs/project が空（正準ファイルゼロ）なら未着手 Warning を返し偽の健全判定をしない', () => {
  const root = tmpdir();
  try {
    fs.mkdirpSync(path.join(root, 'docs', 'project', '01-requirements'));
    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].severity, 'warning');
    assert.match(findings[0].message, /a-002/);
  } finally {
    fs.removeSync(root);
  }
});

test('structure: 必須見出しは H2 以下で判定し、H1 タイトルでは充足しない', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    const scope = path.join(root, 'docs', 'project', '01-requirements', '02-mvp-scope.md');
    // H1 の「# MVP Scope」は残したまま、必須 H2「## MVP Scope」を別名に変える
    const content = fs.readFileSync(scope, 'utf8').replace('## MVP Scope', '## Scope 表');
    fs.writeFileSync(scope, content);
    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].severity, 'error');
    assert.match(findings[0].message, /MVP Scope/);
  } finally {
    fs.removeSync(root);
  }
});

test('structure: 任意ファイル（06-features-implemented 等）は無くても Error にならない', () => {
  // valid フィクスチャに 06 は無い。テスト1で findings なしを確認済みだが、
  // フロンティアが最後（03-domain）まで進んでいても任意扱いが保たれることを明示する。
  const findings = run({ rootDir: VALID });
  assert.ok(!findings.some((f) => f.file.includes('06-features-implemented')));
  assert.ok(!findings.some((f) => f.file.includes('01-domain-model')));
});
