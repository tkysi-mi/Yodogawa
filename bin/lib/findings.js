'use strict';

const path = require('path');

const SEVERITY = { ERROR: 'error', WARNING: 'warning' };

function makeFinding(check, severity, file, line, message) {
  return { check, severity, file, line: line == null ? null : line, message };
}

function summarize(findings) {
  let errors = 0;
  let warnings = 0;
  for (const f of findings) {
    if (f.severity === SEVERITY.ERROR) errors++;
    else if (f.severity === SEVERITY.WARNING) warnings++;
  }
  return { errors, warnings };
}

// findings の file を OS 非依存で安定させるための正規化（Windows でも posix 区切り）
function toPosixRelative(baseDir, absPath) {
  return path.relative(baseDir, absPath).split(path.sep).join('/');
}

// finding の位置表示（file または file:line）
function formatPosition(finding) {
  return finding.line == null ? finding.file : `${finding.file}:${finding.line}`;
}

module.exports = { SEVERITY, makeFinding, summarize, toPosixRelative, formatPosition };
