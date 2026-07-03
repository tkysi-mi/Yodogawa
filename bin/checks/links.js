'use strict';

const fs = require('fs');
const path = require('path');

const { extractLinks } = require('../lib/markdown');
const { SEVERITY, makeFinding, toPosixRelative } = require('../lib/findings');
const { walkMdFiles } = require('../lib/walk-md');

const CHECK = 'links';
// URI スキーム付き（http/mailto/tel/data 等すべて）・アンカーのみ・絶対パスは
// 相対リンク検査の対象外（ネットワークアクセスはしない＝決定性）
const SKIP_TARGET_RE = /^([a-z][a-z0-9+.-]*:|#|\/)/i;

// dir 配下の Markdown の相対リンク切れを findings として返す。
// リポジトリ側（scripts/repo-check.mjs）から skills/・templates/ にも
// 再利用できるよう、走査ロジックを分離している。
function collectBrokenLinks(baseDir, filePrefix) {
  const findings = [];
  if (!fs.existsSync(baseDir)) return findings;

  for (const abs of walkMdFiles(baseDir)) {
    const file = `${filePrefix}${toPosixRelative(baseDir, abs)}`;
    for (const link of extractLinks(fs.readFileSync(abs, 'utf8'))) {
      if (SKIP_TARGET_RE.test(link.target)) continue;
      const cleaned = link.target.split('#')[0].split('?')[0];
      if (cleaned === '') continue;
      let decoded;
      try {
        decoded = decodeURIComponent(cleaned);
      } catch {
        decoded = cleaned;
      }
      const resolved = path.resolve(path.dirname(abs), decoded);
      if (!fs.existsSync(resolved)) {
        findings.push(
          makeFinding(
            CHECK,
            SEVERITY.ERROR,
            file,
            link.line,
            `リンク先「${link.target}」が存在しません`
          )
        );
      }
    }
  }
  return findings;
}

function run({ rootDir }) {
  return collectBrokenLinks(path.join(rootDir, 'docs'), 'docs/');
}

module.exports = { run, collectBrokenLinks };

if (require.main === module) {
  require('../lib/check-cli').runCheckCli(run, process.argv[2]);
}
