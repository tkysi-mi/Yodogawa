'use strict';

const fs = require('fs');
const path = require('path');

const { parseLines, splitTableCells } = require('../lib/markdown');
const { SEVERITY, makeFinding, toPosixRelative } = require('../lib/findings');
const { walkMdFiles } = require('../lib/walk-md');

const CHECK = 'placeholder';
const HEADING_RE = /^ {0,3}(#{1,6})\s+(.+)$/;
const COMMENT_ONLY_CELL_RE = /^<!--[\s\S]*-->$/;
const HR_RE = /^(-{3,}|\*{3,}|_{3,})$/;

// templates/ 由来の意味プレースホルダ（実測列挙）。コメント外に残っていたら
// テンプレート未記入とみなす。汎用の \[.+\] はチェックボックスや Markdown
// リンクと衝突するため、既知トークンの完全一致のみ検出する。
const KNOWN_TOKENS = [
  '[役割]',
  '[目的]',
  '[理由]',
  '[課題]',
  '[画面名]',
  '[フェーズ名]',
  '[コンテキスト名]',
  '[Bounded Context名]',
];

// 空でも正常なセクション（テンプレート上、空欄がありうるもの）
function isExemptHeading(text) {
  return (
    text.includes('（任意）') ||
    text.includes('(任意)') ||
    text.startsWith('メモ') ||
    text.startsWith('Not Covered in MVP')
  );
}

function checkFile(absPath, file, findings) {
  const lines = parseLines(fs.readFileSync(absPath, 'utf8'));

  for (const line of lines) {
    if (line.inFence) continue;

    // 1. コメントのみのテーブルセル（テンプレート行がそのまま残っている）
    if (line.visible.includes('|')) {
      const rawCells = splitTableCells(line.raw);
      if (rawCells && rawCells.some((cell) => COMMENT_ONLY_CELL_RE.test(cell))) {
        findings.push(
          makeFinding(
            CHECK,
            SEVERITY.WARNING,
            file,
            line.line,
            'テーブルに未記入のテンプレートセル（<!-- ... -->）が残っています'
          )
        );
        continue;
      }
    }

    // 2. 既知の角括弧プレースホルダ（リンク [text](...) は除外）
    const tokens = KNOWN_TOKENS.filter((token) => {
      const idx = line.visible.indexOf(token);
      return idx !== -1 && line.visible[idx + token.length] !== '(';
    });
    if (tokens.length > 0) {
      findings.push(
        makeFinding(
          CHECK,
          SEVERITY.WARNING,
          file,
          line.line,
          `テンプレートのプレースホルダ ${tokens.join(' ')} が残っています`
        )
      );
    }

    // 3. **例:** マーカーの残置（例示ブロックが削除されていない）
    if (line.visible.trim() === '**例:**') {
      findings.push(
        makeFinding(
          CHECK,
          SEVERITY.WARNING,
          file,
          line.line,
          'テンプレートの例示ブロック（**例:**）が残っています'
        )
      );
    }
  }

  // 4. 空セクション（##/### の本文にコメント・空行・罫線以外が無い）
  const headings = [];
  lines.forEach((line, idx) => {
    if (line.inFence) return;
    const m = line.visible.match(HEADING_RE);
    if (m) headings.push({ level: m[1].length, text: m[2].trim(), line: line.line, idx });
  });
  headings.forEach((heading, hi) => {
    if (heading.level < 2 || heading.level > 3) return;
    if (isExemptHeading(heading.text)) return;
    const next = headings.slice(hi + 1).find((h) => h.level <= heading.level);
    const endIdx = next ? next.idx : lines.length;
    const hasContent = lines.slice(heading.idx + 1, endIdx).some((line) => {
      if (line.inFence) return true; // コードブロックは本文とみなす
      const text = line.visible.trim();
      return text !== '' && !HR_RE.test(text) && !HEADING_RE.test(line.visible);
    });
    if (!hasContent) {
      findings.push(
        makeFinding(
          CHECK,
          SEVERITY.WARNING,
          file,
          heading.line,
          `セクション「${heading.text}」が未記入です`
        )
      );
    }
  });
}

function run({ rootDir }) {
  const projectDir = path.join(rootDir, 'docs', 'project');
  if (!fs.existsSync(projectDir)) return [];

  const findings = [];
  for (const abs of walkMdFiles(projectDir)) {
    checkFile(abs, `docs/project/${toPosixRelative(projectDir, abs)}`, findings);
  }
  return findings;
}

module.exports = { run };

if (require.main === module) {
  require('../lib/check-cli').runCheckCli(run, process.argv[2]);
}
