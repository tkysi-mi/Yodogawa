'use strict';

const fs = require('fs');
const path = require('path');
const { bold, green, red, yellow, gray } = require('kleur');

const { SEVERITY, makeFinding, summarize, formatPosition } = require('../lib/findings');

// requiresProject: docs/project が無いとき skip するチェック。
// structure は不在自体を報告し、links は docs/ 全体（docs/tasks 含む）が対象なので走らせる。
const CHECKS = [
  { name: 'structure', run: require('../checks/structure').run, requiresProject: false },
  { name: 'id-trace', run: require('../checks/id-trace').run, requiresProject: true },
  { name: 'placeholder', run: require('../checks/placeholder').run, requiresProject: true },
  { name: 'links', run: require('../checks/links').run, requiresProject: false },
];

const USAGE = `Usage: yodogawa doctor [--dir <path>] [--json]

docs/project/ のトレーサビリティ・構造を検査します。

Options:
  --dir <path>  検査するプロジェクトのルート（既定: カレントディレクトリ）
  --json        機械可読な JSON を stdout に出力
  --help        このヘルプを表示

Exit codes: 0 = Error なし（Warning のみ含む） / 1 = Error あり / 2 = 使い方の誤り`;

function parseArgs(argv) {
  const opts = { json: false, dir: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    else if (arg === '--dir') {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('-')) {
        return { error: '--dir にはパスを指定してください' };
      }
      opts.dir = argv[++i];
    } else if (arg === '--help' || arg === '-h') return { help: true };
    else return { error: `不明なオプション: ${arg}` };
  }
  return { opts };
}

function statusOf(findings) {
  const { errors, warnings } = summarize(findings);
  if (errors > 0) return 'fail';
  if (warnings > 0) return 'warn';
  return 'pass';
}

function printHuman(results, summary) {
  const HEADER = {
    pass: (name) => `${green('✔')} ${bold(name)}`,
    warn: (name) => `${yellow('⚠')} ${bold(name)}`,
    fail: (name) => `${red('✖')} ${bold(name)}`,
    skip: (name) => `${gray('-')} ${bold(name)} ${gray('(skip)')}`,
  };
  for (const result of results) {
    console.log(HEADER[result.status](result.name));
    for (const f of result.findings) {
      const label = f.severity === SEVERITY.ERROR ? red('error') : yellow('warning');
      console.log(`  ${label} ${formatPosition(f)} ${f.message}`);
    }
  }
  const skipped = results.filter((r) => r.status === 'skip').length;
  const suffix = skipped > 0 ? `, ${skipped} skipped` : '';
  const line = `${summary.errors} errors, ${summary.warnings} warnings (${results.length} checks${suffix})`;
  console.log(summary.errors > 0 ? red(`\n✖ ${line}`) : green(`\n✔ ${line}`));
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

  const rootDir = path.resolve(cwd, parsed.opts.dir || '.');
  if (!fs.existsSync(rootDir)) {
    console.error(red(`✖ 指定されたディレクトリが存在しません: ${rootDir}`));
    return 2;
  }

  const projectMissing = !fs.existsSync(path.join(rootDir, 'docs', 'project'));
  const results = CHECKS.map(({ name, run, requiresProject }) => {
    if (projectMissing && requiresProject) {
      return { name, status: 'skip', findings: [] };
    }
    // チェック自体の実行失敗（読み取り不能ファイル等）でも --json の stdout 純度と
    // exit code 契約を守るため、throw は Error finding に変換する
    let findings;
    try {
      findings = run({ rootDir });
    } catch (err) {
      findings = [
        makeFinding(name, SEVERITY.ERROR, '(internal)', null, `チェックの実行に失敗しました: ${err.message}`),
      ];
    }
    return { name, status: statusOf(findings), findings };
  });

  const findings = results.flatMap((r) => r.findings);
  const summary = summarize(findings);
  const ok = summary.errors === 0;

  if (parsed.opts.json) {
    const report = {
      version: 1,
      ok,
      summary,
      checks: results.map(({ name, status }) => ({ name, status })),
      findings,
    };
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHuman(results, summary);
  }
  return ok ? 0 : 1;
}

module.exports = { main };
