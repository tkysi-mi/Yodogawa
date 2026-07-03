'use strict';

const path = require('path');

const { summarize, formatPosition } = require('./findings');

// 各チェックを単体スクリプトとして実行するための共通シム。
// findings を 1 行 1 件で表示し、Error があれば exit 1、なければ exit 0。
function runCheckCli(run, dirArg) {
  const rootDir = path.resolve(dirArg || '.');
  const findings = run({ rootDir });
  for (const f of findings) {
    console.log(`${f.severity} ${formatPosition(f)} ${f.message}`);
  }
  const { errors } = summarize(findings);
  process.exitCode = errors > 0 ? 1 : 0;
}

module.exports = { runCheckCli };
