'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const os = require('node:os');
const path = require('node:path');
const fs = require('fs-extra');
const prompts = require('prompts');

const { main } = require('../bin/cli.js');

// Each test injects EXACTLY the number of answers main() consumes, so the
// module-level prompts.inject queue never leaks into the next test.
function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'yodogawa-'));
}

test('happy path: installs skills and templates into .claude on an empty dir', async () => {
  const cwd = tmpdir();
  try {
    prompts.inject(['claude']); // select only; no confirm on an empty dir
    await main({ cwd });

    const skills = path.join(cwd, '.claude', 'skills');
    const templates = path.join(cwd, '.claude', 'templates');
    assert.ok(fs.existsSync(skills), '.claude/skills should exist');
    assert.ok(fs.existsSync(templates), '.claude/templates should exist');
    assert.ok(fs.readdirSync(skills).length > 0, '.claude/skills should not be empty');
    assert.ok(fs.readdirSync(templates).length > 0, '.claude/templates should not be empty');
  } finally {
    fs.removeSync(cwd);
  }
});

test('existing dir: merges into .claude and keeps pre-existing files', async () => {
  const cwd = tmpdir();
  try {
    fs.mkdirpSync(path.join(cwd, '.claude'));
    fs.writeFileSync(path.join(cwd, '.claude', 'MARKER'), 'keep');

    prompts.inject(['claude', true]); // dir exists -> confirm fires -> merge
    await main({ cwd });

    assert.ok(fs.existsSync(path.join(cwd, '.claude', 'skills')), 'skills copied');
    assert.equal(
      fs.readFileSync(path.join(cwd, '.claude', 'MARKER'), 'utf8'),
      'keep',
      'pre-existing file must survive the merge'
    );
  } finally {
    fs.removeSync(cwd);
  }
});

test('copy failure: rejects when the target name is already a regular file', async () => {
  const cwd = tmpdir();
  try {
    // .claude is a FILE, so fs.existsSync is true (confirm fires) and the
    // subsequent fs.copy into .claude/skills fails on every OS (errno differs:
    // ENOTDIR on Linux, ENOENT on Windows) -> assert rejection only.
    fs.writeFileSync(path.join(cwd, '.claude'), 'x');

    prompts.inject(['claude', true]);
    await assert.rejects(main({ cwd }));
  } finally {
    fs.removeSync(cwd);
  }
});
