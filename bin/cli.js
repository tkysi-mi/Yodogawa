#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const { bold, green, cyan, red } = require('kleur');

async function main({ cwd = process.cwd(), pkgRoot = path.join(__dirname, '..') } = {}) {
  console.log(bold().cyan('\n🚀 Welcome to Yodogawa Skills Installer!\n'));

  const response = await prompts({
    type: 'select',
    name: 'type',
    message: 'Which configuration would you like to install?',
    choices: [
      { title: 'Claude Code (.claude/skills/)', value: 'claude' },
      { title: 'Other IDEs — Cursor / Codex / Antigravity (.agents/skills/)', value: 'agents' }
    ]
  });

  if (!response.type) {
    console.log(red('✖ Operation cancelled.'));
    return;
  }

  const dirMap = {
    claude: '.claude',
    agents: '.agents',
  };
  const targetDirName = dirMap[response.type];
  const targetDir = path.join(cwd, targetDirName);

  if (fs.existsSync(targetDir)) {
    const confirm = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${targetDirName} already exists. Merge and update its contents?`,
      initial: false
    });
    if (!confirm.overwrite) {
      console.log(red('✖ Operation cancelled.'));
      return;
    }
  }

  console.log(`\nInstalling Yodogawa skills to ${bold(targetDirName)}...`);

  await fs.copy(path.join(pkgRoot, 'skills'), path.join(targetDir, 'skills'));
  await fs.copy(path.join(pkgRoot, 'templates'), path.join(targetDir, 'templates'));

  console.log(green(`\n✔ Successfully installed Yodogawa skills for ${response.type}!`));
  console.log(`\nNext steps:`);
  console.log(`1. Open ${bold(targetDirName + '/skills/')} to explore the skills.`);
  console.log(`2. Start using them in your project!\n`);
  console.log(`Note: reinstalling merges into existing files. Renamed or removed skills are not auto-deleted — delete ${bold(targetDirName + '/skills')} and ${bold(targetDirName + '/templates')} first to reflect them.\n`);
}

module.exports = { main };

if (require.main === module) {
  main().catch(err => {
    console.error(red(`\n✖ Error installing skills: ${err.message}`));
    process.exit(1);
  });
}
