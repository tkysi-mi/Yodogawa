'use strict';

const fs = require('fs');
const path = require('path');
const { bold, green, red, yellow, gray } = require('kleur');

const { SEVERITY, summarize } = require('../lib/findings');

const CHECKS = [
  { name: 'structure', run: require('../checks/structure').run },
  { name: 'id-trace', run: require('../checks/id-trace').run },
  { name: 'placeholder', run: require('../checks/placeholder').run },
  { name: 'links', run: require('../checks/links').run },
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
      if (i + 1 >= argv.length) return { error: '--dir にはパスを指定してください' };
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
      const position = f.line == null ? f.file : `${f.file}:${f.line}`;
      const label = f.severity === SEVERITY.ERROR ? red('error') : yellow('warning');
      console.log(`  ${label} ${position} ${f.message}`);
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

  // docs/project 自体が無い場合は structure だけが Error を報告し、他は skip
  const projectMissing = !fs.existsSync(path.join(rootDir, 'docs', 'project'));
  const results = CHECKS.map(({ name, run }) => {
    if (projectMissing && name !== 'structure') {
      return { name, status: 'skip', findings: [] };
    }
    const findings = run({ rootDir });
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
