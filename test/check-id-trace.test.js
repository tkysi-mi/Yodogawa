'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');

const { run } = require('../bin/checks/id-trace');

const VALID = path.join(__dirname, 'fixtures', 'valid-project');
const BROKEN = path.join(__dirname, 'fixtures', 'broken-project');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

test('id-trace: valid project は findings なし', () => {
  assert.deepStrictEqual(run({ rootDir: VALID }), []);
});

test('id-trace: broken project は trace 切れ Error・孤児 Warning・FN 縮退 Warning を返す（コメント内 ID は無視）', () => {
  const findings = run({ rootDir: BROKEN });
  assert.strictEqual(findings.length, 3);

  const traceBreak = findings.find((f) => f.severity === 'error');
  assert.ok(traceBreak, 'P-003 の trace 切れが Error になる');
  assert.match(traceBreak.message, /P-003/);
  assert.strictEqual(traceBreak.file, 'docs/project/01-requirements/05-user-stories.md');
  assert.strictEqual(typeof traceBreak.line, 'number');

  const orphan = findings.find((f) => f.severity === 'warning' && /P-002/.test(f.message));
  assert.ok(orphan, 'どの US からも参照されない P-002 が孤児 Warning になる');
  assert.strictEqual(orphan.file, 'docs/project/01-requirements/01-product-brief.md');

  const degraded = findings.find((f) => f.severity === 'warning' && /FN/.test(f.message));
  assert.ok(degraded, 'FN 定義元が空のときは族全体で縮退 Warning 1 件');
  assert.match(degraded.message, /スキップ/);
});

test('id-trace: FN 定義がある場合は未定義参照が Error・未参照定義が Warning になる', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    fs.outputFileSync(
      path.join(root, 'docs', 'project', '01-requirements', '06-features-implemented.md'),
      [
        '# 実装済み機能一覧',
        '',
        '| FN | カテゴリ | 機能名 |',
        '|----|---------|--------|',
        '| FN-001 | 調整 | 日程調整 |',
        '| FN-002 | 通知 | 告知配信 |',
        '',
      ].join('\n')
    );
    const scenarios = path.join(root, 'docs', 'project', '02-behavior', '01-core-scenarios.md');
    fs.writeFileSync(
      scenarios,
      fs.readFileSync(scenarios, 'utf8').replace('| 日程調整 |', '| FN-001 / FN-009 |')
    );

    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 2);

    const missing = findings.find((f) => f.severity === 'error');
    assert.match(missing.message, /FN-009/);
    assert.strictEqual(missing.file, 'docs/project/02-behavior/01-core-scenarios.md');

    const orphan = findings.find((f) => f.severity === 'warning');
    assert.match(orphan.message, /FN-002/);
  } finally {
    fs.removeSync(root);
  }
});

test('id-trace: 見出しで定義されていない CS の参照は Error', () => {
  const root = tmpdir();
  try {
    fs.copySync(VALID, root);
    const sketch = path.join(root, 'docs', 'project', '03-domain', '01-domain-sketch.md');
    fs.appendFileSync(sketch, '\n詳細は CS-002 を参照。\n');

    const findings = run({ rootDir: root });
    assert.strictEqual(findings.length, 1);
    assert.strictEqual(findings[0].severity, 'error');
    assert.match(findings[0].message, /CS-002/);
    assert.strictEqual(findings[0].file, 'docs/project/03-domain/01-domain-sketch.md');
  } finally {
    fs.removeSync(root);
  }
});

test('id-trace: 定義ファイル自体が無い族は検査をスキップする', () => {
  const root = tmpdir();
  try {
    // product-brief / user-stories が無い状態で P / US を参照しても findings なし
    fs.outputFileSync(
      path.join(root, 'docs', 'project', '02-behavior', '01-core-scenarios.md'),
      ['# Core Scenarios', '', 'P-005 と US-005 に言及するが定義ファイルが無い。', ''].join('\n')
    );
    assert.deepStrictEqual(run({ rootDir: root }), []);
  } finally {
    fs.removeSync(root);
  }
});
