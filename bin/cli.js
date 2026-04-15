#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const { bold, green, cyan, red } = require('kleur');

async function main() {
  console.log(bold().cyan('\n🚀 Welcome to Yodogawa Skills Installer!\n'));

  const response = await prompts({
    type: 'select',
    name: 'type',
    message: 'Which configuration would you like to install?',
    choices: [
      { title: 'Antigravity (.agent)', value: 'antigravity' },
      { title: 'Cursor (.cursor)', value: 'cursor' },
      { title: 'Claude Code (.claude)', value: 'claude' },
      { title: 'Codex (.codex)', value: 'codex' }
    ]
  });

  if (!response.type) {
    console.log(red('✖ Operation cancelled.'));
    process.exit(0);
  }

  const pkgRoot = path.join(__dirname, '..');
  const dirMap = {
    antigravity: '.agent',
    cursor: '.cursor',
    claude: '.claude',
    codex: '.codex',
  };
  const targetDirName = dirMap[response.type];
  const targetDir = path.join(process.cwd(), targetDirName);

  try {
    if (fs.existsSync(targetDir)) {
      const confirm = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${targetDirName} already exists. Overwrite?`,
        initial: false
      });
      if (!confirm.overwrite) {
        console.log(red('✖ Operation cancelled.'));
        process.exit(0);
      }
    }

    console.log(`\nInstalling Yodogawa skills to ${bold(targetDirName)}...`);

    await fs.copy(path.join(pkgRoot, 'skills'), path.join(targetDir, 'skills'));
    await fs.copy(path.join(pkgRoot, 'templates'), path.join(targetDir, 'templates'));
    await fs.copy(path.join(pkgRoot, 'scripts'), path.join(targetDir, 'scripts'));

    console.log(green(`\n✔ Successfully installed Yodogawa skills for ${response.type}!`));
    console.log(`\nNext steps:`);
    console.log(`1. Open ${bold(targetDirName + '/skills/')} to explore the skills.`);
    console.log(`2. Start using them in your project!\n`);

  } catch (err) {
    console.error(red(`\n✖ Error installing skills: ${err.message}`));
    process.exit(1);
  }
}

main().catch(err => {
  console.error(red(err));
  process.exit(1);
});
