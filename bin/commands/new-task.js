'use strict';

const fs = require('fs-extra');
const path = require('path');
const { bold, green, red, yellow } = require('kleur');

// b-001-create-task-directory の採番規則に準拠（SKILL.md 手順2）
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TASK_DIR_RE = /^task(\d{6})-/;
const MAX_ID = 999999;

const USAGE = `Usage: yodogawa new-task <slug> [--dir <path>] [--json]

docs/tasks/ に連番タスク ID 付きディレクトリを作成します（作成はディレクトリのみ。
タスク定義書などのドキュメントは /b-002-create-task-definition 以降で作成します）。

Arguments:
  slug          タスク内容を表す英小文字・数字・ハイフンのスラッグ（3〜5 語推奨）

Options:
  --dir <path>  プロジェクトのルート（既定: カレントディレクトリ）
  --json        機械可読な JSON を stdout に出力
  --help        このヘルプを表示

Exit codes: 0 = 成功 / 1 = 操作失敗 / 2 = 使い方の誤り`;

function parseArgs(argv) {
  const opts = { json: false, dir: null, slug: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    else if (arg === '--dir') {
      if (i + 1 >= argv.length) return { error: '--dir にはパスを指定してください' };
      opts.dir = argv[++i];
    } else if (arg === '--help' || arg === '-h') return { help: true };
    else if (arg.startsWith('-')) return { error: `不明なオプション: ${arg}` };
    else if (opts.slug === null) opts.slug = arg;
    else return { error: `引数が多すぎます: ${arg}` };
  }
  return { opts };
}

async function main(argv, { cwd = process.cwd() } = {}) {
  const parsed = parseArgs(argv);
  if (parsed.help) {
    console.log(USAGE);
    return 0;
  }
  if (parsed.error) {
    console.error(red(`✖ ${parsed.error}`));
    console.error(USAGE);
    return 2;
  }

  const { slug, dir, json } = parsed.opts;
  if (!slug) {
    console.error(red('✖ スラッグを指定してください（例: yodogawa new-task user-profile-edit）'));
    console.error(USAGE);
    return 2;
  }
  if (!SLUG_RE.test(slug)) {
    console.error(
      red(`✖ スラッグ「${slug}」が不正です。英小文字・数字・ハイフンのみ（連続ハイフン禁止）で指定してください`)
    );
    return 2;
  }

  const rootDir = path.resolve(cwd, dir || '.');
  if (!fs.existsSync(rootDir)) {
    console.error(red(`✖ 指定されたディレクトリが存在しません: ${rootDir}`));
    return 2;
  }
  const tasksDir = path.join(rootDir, 'docs', 'tasks');
  if (!fs.existsSync(tasksDir)) {
    console.error(
      red('✖ docs/tasks がありません。/a-001-setup-doc-structure でドキュメント骨格を先に作成してください')
    );
    return 1;
  }

  // 3〜5 語推奨（範囲外は警告のみで続行 = b-001 SKILL.md に忠実）。
  // --json の stdout を汚さないよう警告は stderr へ出す。
  const wordCount = slug.split('-').length;
  if (wordCount < 3 || wordCount > 5) {
    console.error(yellow(`⚠ スラッグは 3〜5 語を推奨します（現在 ${wordCount} 語）。このまま続行します`));
  }

  const ids = fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => TASK_DIR_RE.exec(entry.name))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  if (nextId > MAX_ID) {
    console.error(red(`✖ タスク ID が上限（${MAX_ID}）を超えました`));
    return 1;
  }

  const id = `task${String(nextId).padStart(6, '0')}`;
  const dirName = `${id}-${slug}`;
  await fs.ensureDir(path.join(tasksDir, dirName));
  const relPath = `docs/tasks/${dirName}`;

  if (json) {
    console.log(JSON.stringify({ id, slug, path: relPath }, null, 2));
  } else {
    console.log(green(`✔ タスクディレクトリ ${bold(relPath)} を作成しました`));
    console.log('続いてタスク定義書を作成しますか？（/b-002-create-task-definition）');
  }
  return 0;
}

module.exports = { main };
