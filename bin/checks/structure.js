'use strict';

const fs = require('fs');
const path = require('path');

const { parseLines, splitTableCells } = require('../lib/markdown');
const { SEVERITY, makeFinding } = require('../lib/findings');
const spec = require('../lib/project-spec');

const CHECK = 'structure';
const HEADING_RE = /^ {0,3}(#{1,6})\s+(.+)$/;

function run({ rootDir }) {
  const projectDir = path.join(rootDir, 'docs', 'project');
  if (!fs.existsSync(projectDir)) {
    return [
      makeFinding(
        CHECK,
        SEVERITY.ERROR,
        'docs/project',
        null,
        'docs/project が存在しません。/a-001-setup-doc-structure でドキュメント骨格を作成してください'
      ),
    ];
  }

  const findings = [];
  const existing = spec.CANONICAL_FILES.map((rel) =>
    fs.existsSync(path.join(projectDir, ...rel.split('/')))
  );
  const frontier = existing.lastIndexOf(true);

  for (let i = 0; i < frontier; i++) {
    if (!existing[i]) {
      findings.push(
        makeFinding(
          CHECK,
          SEVERITY.ERROR,
          `docs/project/${spec.CANONICAL_FILES[i]}`,
          null,
          '必須ファイルがありません（後続フェーズのドキュメントは既に存在します）'
        )
      );
    }
  }

  spec.CANONICAL_FILES.forEach((rel, i) => {
    if (!existing[i]) return;
    const file = `docs/project/${rel}`;
    const lines = parseLines(
      fs.readFileSync(path.join(projectDir, ...rel.split('/')), 'utf8')
    );
    const headings = [];
    let hasRequiredTableHeader = false;
    const requiredHeader = spec.REQUIRED_TABLE_HEADERS[rel];

    for (const line of lines) {
      if (line.inFence) continue;
      const m = line.visible.match(HEADING_RE);
      if (m) headings.push(m[2].trim());
      if (requiredHeader && !hasRequiredTableHeader) {
        const cells = splitTableCells(line.visible);
        if (cells && cells.includes(requiredHeader)) hasRequiredTableHeader = true;
      }
    }

    for (const key of spec.REQUIRED_HEADINGS[rel] || []) {
      if (!headings.some((h) => h.startsWith(key))) {
        findings.push(
          makeFinding(CHECK, SEVERITY.ERROR, file, null, `必須見出し「${key}」が見つかりません`)
        );
      }
    }
    if (requiredHeader && !hasRequiredTableHeader) {
      findings.push(
        makeFinding(
          CHECK,
          SEVERITY.ERROR,
          file,
          null,
          `必須テーブルヘッダ「${requiredHeader}」を含む表が見つかりません`
        )
      );
    }
  });

  const designStarted = spec.CANONICAL_FILES.some(
    (rel, i) => existing[i] && rel.startsWith('04-design/')
  );
  if (designStarted) {
    for (const artifact of spec.REVIEW_ARTIFACTS) {
      if (!fs.existsSync(path.join(projectDir, artifact))) {
        findings.push(
          makeFinding(
            CHECK,
            SEVERITY.WARNING,
            `docs/project/${artifact}`,
            null,
            `設計フェーズに着手していますが ${artifact} がありません（/a-006-review-requirements-domain 未実施の可能性）`
          )
        );
      }
    }
  }

  return findings;
}

module.exports = { run };

if (require.main === module) {
  require('../lib/check-cli').runCheckCli(run, process.argv[2]);
}
