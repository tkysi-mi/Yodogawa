'use strict';

const fs = require('fs');
const path = require('path');

// dir 配下の .md ファイルを再帰列挙する（絶対パス、名前順で決定的）。
// Node 18 互換のため readdirSync の recursive オプションは使わない。
function walkMdFiles(dir) {
  const out = [];
  (function walk(current) {
    const entries = fs
      .readdirSync(current, { withFileTypes: true })
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
    }
  })(dir);
  return out;
}

module.exports = { walkMdFiles };
