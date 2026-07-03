'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { parseLines, extractLinks, splitTableCells } = require('../bin/lib/markdown');

test('parseLines: plain lines get 1-based line numbers and visible === raw', () => {
  const lines = parseLines('alpha\nbeta');
  assert.strictEqual(lines.length, 2);
  assert.deepStrictEqual(
    lines.map((l) => ({ raw: l.raw, visible: l.visible, line: l.line, inFence: l.inFence })),
    [
      { raw: 'alpha', visible: 'alpha', line: 1, inFence: false },
      { raw: 'beta', visible: 'beta', line: 2, inFence: false },
    ]
  );
});

test('parseLines: fenced code block lines are flagged inFence (delimiters included)', () => {
  const lines = parseLines(['before', '```bash', 'ls -d docs/tasks/task*', '```', 'after'].join('\n'));
  assert.deepStrictEqual(lines.map((l) => l.inFence), [false, true, true, true, false]);
});

test('parseLines: inline HTML comment is stripped from visible text', () => {
  const [line] = parseLines('foo <!-- 例: P-001 --> bar');
  assert.strictEqual(line.visible, 'foo  bar');
  assert.strictEqual(line.raw, 'foo <!-- 例: P-001 --> bar');
});

test('parseLines: multi-line HTML comment hides all covered lines', () => {
  const lines = parseLines(['<!-- 何を書くか:', 'US-001 を参照', '-->', 'visible US-002'].join('\n'));
  assert.strictEqual(lines[0].visible, '');
  assert.strictEqual(lines[1].visible, '');
  assert.strictEqual(lines[2].visible, '');
  assert.strictEqual(lines[3].visible, 'visible US-002');
});

test('parseLines: comment markers inside a fence do not open a comment', () => {
  const lines = parseLines(['```', '<!-- not a comment start', '```', 'still visible'].join('\n'));
  assert.strictEqual(lines[3].visible, 'still visible');
  assert.strictEqual(lines[3].inFence, false);
});

test('parseLines: fence markers inside a multi-line comment do not open a fence', () => {
  const lines = parseLines(['<!--', '```', '-->', '# heading'].join('\n'));
  assert.deepStrictEqual(lines.map((l) => l.inFence), [false, false, false, false]);
  assert.strictEqual(lines[3].visible, '# heading');
});

test('extractLinks: returns inline link targets with line numbers', () => {
  const links = extractLinks('see [guide](./guide.md) and\n[other](../x/y.md#anchor)');
  assert.deepStrictEqual(links, [
    { target: './guide.md', line: 1 },
    { target: '../x/y.md#anchor', line: 2 },
  ]);
});

test('extractLinks: includes images and strips optional titles', () => {
  const links = extractLinks('![diagram](img/arch.png) [t](a.md "title")');
  assert.deepStrictEqual(links, [
    { target: 'img/arch.png', line: 1 },
    { target: 'a.md', line: 1 },
  ]);
});

test('extractLinks: ignores links inside fences and comments', () => {
  const content = ['```', '[in fence](broken.md)', '```', '<!-- [in comment](broken.md) -->', '[real](ok.md)'].join('\n');
  assert.deepStrictEqual(extractLinks(content), [{ target: 'ok.md', line: 5 }]);
});

test('splitTableCells: splits a table row into trimmed cells', () => {
  assert.deepStrictEqual(splitTableCells('| US-001 | P-001 |  高  |'), ['US-001', 'P-001', '高']);
});

test('splitTableCells: returns null for non-table lines', () => {
  assert.strictEqual(splitTableCells('plain text'), null);
  assert.strictEqual(splitTableCells('- [ ] checkbox'), null);
});
