'use strict';

// Markdown を「論理行」のモデルに変換する共通前処理。
// 全チェックはこのモデル経由で走査することで、フェンスコードブロック内・
// HTML コメント内のテキストを誤検知しないことを一箇所で保証する。

const FENCE_RE = /^ {0,3}(`{3,}|~{3,})/;
const LINK_RE = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

// content → [{ raw, visible, line, inFence }]
// - line: 1 始まり
// - inFence: フェンス区切り行自身を含む
// - visible: HTML コメント区間を除去したテキスト（フェンス内は raw のまま）
function parseLines(content) {
  const rawLines = String(content).split(/\r?\n/);
  const lines = [];
  let inFence = false;
  let fenceChar = null;
  let inComment = false;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    let lineInFence = inFence;

    if (!inComment) {
      const fenceMatch = raw.match(FENCE_RE);
      if (fenceMatch) {
        if (!inFence) {
          inFence = true;
          fenceChar = fenceMatch[1][0];
          lineInFence = true;
        } else if (fenceMatch[1][0] === fenceChar) {
          inFence = false;
          lineInFence = true;
        }
      }
    }

    let visible;
    if (lineInFence) {
      visible = raw;
    } else {
      const stripped = stripComments(raw, inComment);
      visible = stripped.visible;
      inComment = stripped.inComment;
    }
    lines.push({ raw, visible, line: i + 1, inFence: lineInFence });
  }
  return lines;
}

function stripComments(text, inComment) {
  let out = '';
  let rest = text;
  while (rest.length > 0) {
    if (inComment) {
      const end = rest.indexOf('-->');
      if (end === -1) {
        rest = '';
      } else {
        rest = rest.slice(end + 3);
        inComment = false;
      }
    } else {
      const start = rest.indexOf('<!--');
      if (start === -1) {
        out += rest;
        rest = '';
      } else {
        out += rest.slice(0, start);
        rest = rest.slice(start + 4);
        inComment = true;
      }
    }
  }
  return { visible: out, inComment };
}

// content → [{ target, line }]（フェンス内・コメント内のリンクは除外）
function extractLinks(content) {
  const links = [];
  for (const line of parseLines(content)) {
    if (line.inFence) continue;
    LINK_RE.lastIndex = 0;
    let m;
    while ((m = LINK_RE.exec(line.visible)) !== null) {
      links.push({ target: m[1], line: line.line });
    }
  }
  return links;
}

// テーブル行なら trim 済みセル配列、そうでなければ null
function splitTableCells(raw) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('|')) return null;
  const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return inner.split('|').map((cell) => cell.trim());
}

module.exports = { parseLines, extractLinks, splitTableCells };
