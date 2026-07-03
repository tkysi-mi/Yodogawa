'use strict';

// bin/lib/project-spec.js は templates/project/ の実体を写した定義データ（SSoT）。
// テンプレートと spec が乖離すると doctor が誤報・見逃しを始めるため、
// 本物の templates/ に対して同期を検証する。

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const fs = require('fs-extra');

const spec = require('../bin/lib/project-spec');
const { parseLines, splitTableCells, HEADING_RE } = require('../bin/lib/markdown');
const { walkMdFiles } = require('../bin/lib/walk-md');

const TEMPLATES_PROJECT = path.join(__dirname, '..', 'templates', 'project');

function templatePath(rel) {
  return path.join(TEMPLATES_PROJECT, ...rel.split('/'));
}

test('spec-sync: CANONICAL_FILES と OPTIONAL_FILES は番号付きサブディレクトリの実テンプレート全体を過不足なく分割する', () => {
  const actual = walkMdFiles(TEMPLATES_PROJECT)
    .map((abs) => path.relative(TEMPLATES_PROJECT, abs).split(path.sep).join('/'))
    .filter((rel) => /^\d{2}-/.test(rel));
  const declared = [...spec.CANONICAL_FILES, ...spec.OPTIONAL_FILES].sort();
  assert.deepStrictEqual(actual.sort(), declared);
});

test('spec-sync: REQUIRED_HEADINGS の各キーは対応テンプレートの H2 以下の見出しに前方一致する', () => {
  for (const [rel, keys] of Object.entries(spec.REQUIRED_HEADINGS)) {
    const lines = parseLines(fs.readFileSync(templatePath(rel), 'utf8'));
    const headings = [];
    for (const line of lines) {
      if (line.inFence) continue;
      const m = line.visible.match(HEADING_RE);
      if (m && m[1].length >= 2) headings.push(m[2].trim());
    }
    for (const key of keys) {
      assert.ok(
        headings.some((h) => h.startsWith(key)),
        `${rel}: 見出しキー「${key}」がテンプレートに存在しません（見出し: ${headings.join(' / ')}）`
      );
    }
  }
});

test('spec-sync: REQUIRED_TABLE_HEADERS の各ヘッダセルは対応テンプレートの表に存在する', () => {
  for (const [rel, header] of Object.entries(spec.REQUIRED_TABLE_HEADERS)) {
    const lines = parseLines(fs.readFileSync(templatePath(rel), 'utf8'));
    const found = lines.some((line) => {
      if (line.inFence) return false;
      const cells = splitTableCells(line.visible);
      return cells !== null && cells.includes(header);
    });
    assert.ok(found, `${rel}: テーブルヘッダ「${header}」がテンプレートに存在しません`);
  }
});

test('spec-sync: REVIEW_ARTIFACTS のテンプレートが実在する', () => {
  for (const artifact of spec.REVIEW_ARTIFACTS) {
    assert.ok(fs.existsSync(templatePath(artifact)), `templates/project/${artifact} がありません`);
  }
});

test('spec-sync: ID_FAMILIES の定義ファイルはすべて正準/任意ファイルとして宣言済み', () => {
  const declared = new Set([...spec.CANONICAL_FILES, ...spec.OPTIONAL_FILES]);
  for (const fam of spec.ID_FAMILIES) {
    for (const rel of fam.definitionFiles) {
      assert.ok(declared.has(rel), `${fam.family}: 定義ファイル ${rel} が CANONICAL/OPTIONAL に未宣言`);
    }
  }
});

test('spec-sync: KNOWN_TOKENS の各トークンは templates/project/ のいずれかに出現する（死にエントリの防止）', () => {
  const corpus = walkMdFiles(TEMPLATES_PROJECT)
    .map((abs) => fs.readFileSync(abs, 'utf8'))
    .join('\n');
  for (const token of spec.KNOWN_TOKENS) {
    assert.ok(corpus.includes(token), `トークン ${token} が templates/project/ に出現しません`);
  }
});
