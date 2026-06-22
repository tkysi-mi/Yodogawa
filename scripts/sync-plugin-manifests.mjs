#!/usr/bin/env node
// package.json を単一の情報源として、Claude Code プラグインのマニフェスト
// (.claude-plugin/plugin.json, marketplace.json) の共有メタデータを同期する。
//
//   引数なし : 管理フィールドを書き換える（差分があるファイルのみ）
//   --check  : 書き換えず、ドリフトがあれば該当ファイルを報告して exit 1（CI 用）
//
// プラグイン仕様上の必須は plugin.json の `name` のみで、plugin.json は
// package.json を自動継承しない（独立）。そのため明示的にコピーする。
// `npm version` の version ライフサイクルからも呼ばれ、bump 時に追従させる。

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = join(ROOT, "package.json");
const PLUGIN = join(ROOT, ".claude-plugin", "plugin.json");
const MARKETPLACE = join(ROOT, ".claude-plugin", "marketplace.json");

const readJson = (p) => {
  let raw = readFileSync(p, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // 先頭 BOM を除去
  return JSON.parse(raw);
};
const stringify = (obj) => JSON.stringify(obj, null, 2) + "\n";

// author は文字列 ("Name <email> (url)") かオブジェクト。意図的に naive：
// 文字列はまるごと name にする（email/url は分割しない）。
const toAuthorObject = (author) =>
  typeof author === "string" ? { name: author } : author;

// repository は文字列 shorthand か { url } オブジェクト。先頭 `git+` と末尾
// `.git` をアンカーで除去し、クリーンな https URL に正規化する。
const normalizeRepoUrl = (repository) => {
  const url = typeof repository === "string" ? repository : repository?.url;
  return url ? url.replace(/^git\+/, "").replace(/\.git$/, "") : undefined;
};

// package.json の値を plugin.json に適用（既存キーへ代入＝キー順・非管理キーは保持）。
const applyToPlugin = (plugin, pkg) => {
  plugin.name = pkg.name;
  plugin.version = pkg.version;
  plugin.description = pkg.description;
  plugin.author = toAuthorObject(pkg.author);
  plugin.homepage = pkg.homepage;
  const repo = normalizeRepoUrl(pkg.repository);
  if (repo !== undefined) plugin.repository = repo;
  plugin.license = pkg.license;
  plugin.keywords = [...pkg.keywords];
  return plugin;
};

// marketplace は発行者概念の owner と source/category を管理しない（触らない）。
const applyToMarketplace = (marketplace, pkg) => {
  marketplace.name = pkg.name;
  const entry = marketplace.plugins?.[0];
  if (!entry) throw new Error("marketplace.json: plugins[0] が見つからない");
  entry.name = pkg.name;
  entry.description = pkg.description;
  entry.homepage = pkg.homepage;
  entry.tags = [...pkg.keywords];
  return marketplace;
};

const main = () => {
  const check = process.argv.includes("--check");
  const pkg = readJson(PKG);
  const targets = [
    { path: PLUGIN, label: "plugin.json", apply: applyToPlugin },
    { path: MARKETPLACE, label: "marketplace.json", apply: applyToMarketplace },
  ];

  let drift = false;
  for (const { path, label, apply } of targets) {
    const current = readJson(path);
    const before = stringify(current); // 現値の canonical（行末・空白に非依存の意味比較用）
    const after = stringify(apply(current, pkg));
    if (before === after) continue;
    if (check) {
      drift = true;
      console.error(`drift: ${label} が package.json と同期していません`);
    } else {
      writeFileSync(path, after, "utf8");
      console.log(`synced: ${label}`);
    }
  }

  if (check && drift) {
    console.error("`npm run sync:manifests` を実行して結果をコミットしてください。");
    process.exit(1);
  }
  console.log(check ? "ok: マニフェストは package.json と同期済み" : "done");
};

try {
  main();
} catch (err) {
  console.error(`sync-plugin-manifests failed: ${err.message}`);
  process.exit(1);
}
