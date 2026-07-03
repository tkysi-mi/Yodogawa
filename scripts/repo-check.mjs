#!/usr/bin/env node
// リポジトリ自身の整合性を検証する（dev / CI 専用。npm では配布しない）。
//
//   node scripts/repo-check.mjs [root]
//
// 検査内容:
//   1. スキル間参照（`/a-002` 短縮形・`/a-002-initialize-project` フル形）の実在
//   2. README スキル表のコード ↔ skills/ ディレクトリの双方向一致
//   3. skills/・templates/ 内の相対リンク切れ（bin/checks/links.js を再利用）
//
// 問題ごとに stderr へ報告し、1 件でもあれば exit 1。なければ ok で exit 0。

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parseLines } = require("../bin/lib/markdown.js");
const { toPosixRelative } = require("../bin/lib/findings.js");
const { walkMdFiles } = require("../bin/lib/walk-md.js");
const { collectBrokenLinks } = require("../bin/checks/links.js");

const ROOT = resolve(
  process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..")
);

const CODE = String.raw`[abcd]-\d{3}[a-z]?`;
// 直前が英数字・ドット・スラッシュ・ハイフン等（= パス断片）の `/xxx` は除外。
// フェンス内も対象（スキルの bash 例中の参照も実在すべき）、コメント内は除外。
const REF_RE = new RegExp(String.raw`(?<![\w./-])/(${CODE})((?:-[a-z0-9]+)*)`, "g");
const TABLE_CODE_RE = new RegExp("`/(" + CODE + ")`", "g");

const problems = [];

// --- skills/ ディレクトリのコード集合 -------------------------------------
const skillsDir = join(ROOT, "skills");
const skillDirNames = existsSync(skillsDir)
  ? readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  : [];
const dirCodeRe = new RegExp(`^(${CODE})-`);
const dirCodes = new Set(
  skillDirNames.map((name) => dirCodeRe.exec(name)?.[1]).filter(Boolean)
);

// --- 1. スキル間参照の実在 -------------------------------------------------
const scanTargets = [];
for (const dir of ["skills", "templates"]) {
  const abs = join(ROOT, dir);
  if (existsSync(abs)) scanTargets.push(...walkMdFiles(abs));
}
if (existsSync(join(ROOT, "README.md"))) scanTargets.push(join(ROOT, "README.md"));

for (const file of scanTargets) {
  const rel = toPosixRelative(ROOT, file);
  for (const line of parseLines(readFileSync(file, "utf8"))) {
    for (const m of line.visible.matchAll(REF_RE)) {
      const [, code, suffix] = m;
      if (suffix) {
        const full = `${code}${suffix}`;
        if (!skillDirNames.includes(full)) {
          problems.push(`${rel}:${line.line} 参照切れ: /${full} に対応する skills/${full} がありません`);
        }
      } else {
        const candidates = skillDirNames.filter((d) => d.startsWith(`${code}-`));
        if (candidates.length === 0) {
          problems.push(`${rel}:${line.line} 参照切れ: /${code} に前方一致する skills ディレクトリがありません`);
        } else if (candidates.length > 1) {
          problems.push(
            `${rel}:${line.line} 曖昧な参照: /${code} が複数のディレクトリに一致します（${candidates.join(", ")}）`
          );
        }
      }
    }
  }
}

// --- 2. README スキル表 ↔ skills/ の双方向一致 -----------------------------
const readmePath = join(ROOT, "README.md");
if (existsSync(readmePath)) {
  const tableCodes = new Set();
  for (const line of parseLines(readFileSync(readmePath, "utf8"))) {
    if (line.inFence || !line.visible.trim().startsWith("|")) continue;
    for (const m of line.visible.matchAll(TABLE_CODE_RE)) tableCodes.add(m[1]);
  }
  for (const code of tableCodes) {
    if (!dirCodes.has(code)) {
      problems.push(`README.md: スキル表の /${code} に対応する skills ディレクトリがありません`);
    }
  }
  for (const code of dirCodes) {
    if (!tableCodes.has(code)) {
      problems.push(`README.md: skills/${code}-* が README のスキル表に載っていません`);
    }
  }
}

// --- 3. skills/・templates/ の相対リンク切れ --------------------------------
for (const dir of ["skills", "templates"]) {
  const abs = join(ROOT, dir);
  for (const f of collectBrokenLinks(abs, `${dir}/`)) {
    problems.push(`${f.file}:${f.line} ${f.message}`);
  }
}

// --- 報告 -------------------------------------------------------------------
// process.exit() はパイプへの stderr フラッシュを打ち切ることがあるため使わない
if (problems.length > 0) {
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} 件の問題が見つかりました。`);
  process.exitCode = 1;
} else {
  console.log("ok: スキル参照・README 表・相対リンクは健全です");
}
