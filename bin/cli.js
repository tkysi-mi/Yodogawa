#!/usr/bin/env node
'use strict';

const { red } = require('kleur');
const install = require('./commands/install');

const HELP = `Usage: yodogawa [command] [options]

Commands:
  (なし)             対話形式でスキル・テンプレートをインストール
  doctor             docs/project/ のトレーサビリティ・構造を検査
  new-task <slug>    docs/tasks/ に連番タスクディレクトリを作成
  help               このヘルプを表示

各コマンドの詳細は yodogawa <command> --help を参照してください。`;

function printHelp() {
  console.log(HELP);
}

async function run(argv = process.argv.slice(2), { cwd = process.cwd() } = {}) {
  const [command, ...rest] = argv;
  if (command === undefined) {
    // 後方互換: 引数なしは従来どおり対話インストール
    await install.main({ cwd });
    return 0;
  }
  if (command === 'doctor') return require('./commands/doctor').main(rest, { cwd });
  if (command === 'new-task') return require('./commands/new-task').main(rest, { cwd });
  if (command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    return 0;
  }
  console.error(red(`✖ Unknown command: ${command}`));
  console.error(HELP);
  return 2;
}

// main は install の別名（既存利用箇所の後方互換のため維持）
module.exports = { main: install.main, run };

if (require.main === module) {
  run()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((err) => {
      console.error(red(`\n✖ Error: ${err.message}`));
      process.exitCode = 1;
    });
}
