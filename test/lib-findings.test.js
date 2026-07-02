'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { SEVERITY, makeFinding, summarize, toPosixRelative } = require('../bin/lib/findings');

test('makeFinding: builds a finding object with all fields', () => {
  const f = makeFinding('id-trace', SEVERITY.ERROR, 'docs/project/a.md', 12, 'P-003 は未定義です');
  assert.deepStrictEqual(f, {
    check: 'id-trace',
    severity: 'error',
    file: 'docs/project/a.md',
    line: 12,
    message: 'P-003 は未定義です',
  });
});

test('makeFinding: accepts null line (position unknown)', () => {
  const f = makeFinding('structure', SEVERITY.WARNING, 'docs/project/a.md', null, 'msg');
  assert.strictEqual(f.line, null);
});

test('summarize: counts errors and warnings', () => {
  const findings = [
    makeFinding('c', SEVERITY.ERROR, 'f', 1, 'm'),
    makeFinding('c', SEVERITY.WARNING, 'f', 2, 'm'),
    makeFinding('c', SEVERITY.WARNING, 'f', 3, 'm'),
  ];
  assert.deepStrictEqual(summarize(findings), { errors: 1, warnings: 2 });
});

test('toPosixRelative: normalizes a path relative to a base dir to posix separators', () => {
  const path = require('path');
  const base = path.join('C:', 'proj');
  const abs = path.join(base, 'docs', 'project', 'a.md');
  assert.strictEqual(toPosixRelative(base, abs), 'docs/project/a.md');
});
