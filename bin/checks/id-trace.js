'use strict';

const fs = require('fs');
const path = require('path');

const { parseLines, HEADING_RE } = require('../lib/markdown');
const { SEVERITY, makeFinding, toPosixRelative } = require('../lib/findings');
const { walkMdFiles } = require('../lib/walk-md');
const { ID_FAMILIES } = require('../lib/project-spec');

const CHECK = 'id-trace';
// 族の列挙は ID_FAMILIES（SSoT）から導出する。前後が英数字・ハイフンに連続する
// 出現（パス断片・複合語 CS-001-detail・P-00X のような部分一致）を除外する
const ID_RE = new RegExp(
  `(?<![0-9A-Za-z-])(${ID_FAMILIES.map((f) => f.family).join('|')})-(\\d+)(?![0-9A-Za-z-])`,
  'g'
);

const ORPHAN_MESSAGES = {
  P: (id) => `「${id}」はどのユーザーストーリーからも参照されていません（孤児ペルソナの可能性）`,
  FN: (id) => `「${id}」は core-scenarios から参照されていません（シナリオ未カバーの可能性）`,
};

function collectOccurrences(projectDir) {
  const occurrences = [];
  for (const abs of walkMdFiles(projectDir)) {
    const relFromProject = toPosixRelative(projectDir, abs);
    for (const line of parseLines(fs.readFileSync(abs, 'utf8'))) {
      if (line.inFence) continue;
      const isHeading = HEADING_RE.test(line.visible);
      ID_RE.lastIndex = 0;
      let m;
      while ((m = ID_RE.exec(line.visible)) !== null) {
        occurrences.push({
          family: m[1],
          id: `${m[1]}-${m[2]}`,
          relFile: relFromProject,
          line: line.line,
          isHeading,
        });
      }
    }
  }
  return occurrences;
}

function run({ rootDir }) {
  const projectDir = path.join(rootDir, 'docs', 'project');
  if (!fs.existsSync(projectDir)) return [];

  const findings = [];
  const occurrences = collectOccurrences(projectDir);
  const toFile = (relFromProject) => `docs/project/${relFromProject}`;

  for (const fam of ID_FAMILIES) {
    const famOccurrences = occurrences.filter((o) => o.family === fam.family);
    if (famOccurrences.length === 0) continue;

    const isDefinition = (o) =>
      fam.definitionFiles.includes(o.relFile) && (!fam.headingDefinition || o.isHeading);

    const definitions = new Map();
    for (const o of famOccurrences) {
      if (isDefinition(o) && !definitions.has(o.id)) definitions.set(o.id, o);
    }
    const references = famOccurrences.filter((o) => !isDefinition(o));

    if (definitions.size === 0) {
      if (fam.degradeWhenNoDefinitions) {
        if (references.length > 0) {
          const first = references[0];
          findings.push(
            makeFinding(
              CHECK,
              SEVERITY.WARNING,
              toFile(first.relFile),
              first.line,
              `${fam.family} の定義元（${fam.definitionFiles.join(' / ')}）で ${fam.family} ID が定義されていないため、${fam.family} の trace 検査をスキップしました`
            )
          );
        }
        continue;
      }
      const anyDefinitionFileExists = fam.definitionFiles.some((rel) =>
        fs.existsSync(path.join(projectDir, ...rel.split('/')))
      );
      if (!anyDefinitionFileExists) continue; // 定義ファイル自体が無い族は skip（structure が別途検出）
    }

    const reported = new Set();
    for (const ref of references) {
      if (definitions.has(ref.id) || reported.has(ref.id)) continue;
      reported.add(ref.id);
      findings.push(
        makeFinding(
          CHECK,
          SEVERITY.ERROR,
          toFile(ref.relFile),
          ref.line,
          `「${ref.id}」が ${fam.definitionFiles.join(' / ')} で定義されていません（trace 切れ）`
        )
      );
    }

    if (fam.orphanScanFiles) {
      const scanFileExists = fam.orphanScanFiles.some((rel) =>
        fs.existsSync(path.join(projectDir, ...rel.split('/')))
      );
      if (scanFileExists) {
        const referencedInScan = new Set(
          references.filter((o) => fam.orphanScanFiles.includes(o.relFile)).map((o) => o.id)
        );
        for (const [id, def] of definitions) {
          if (!referencedInScan.has(id)) {
            findings.push(
              makeFinding(
                CHECK,
                SEVERITY.WARNING,
                toFile(def.relFile),
                def.line,
                ORPHAN_MESSAGES[fam.family](id)
              )
            );
          }
        }
      }
    }
  }

  return findings;
}

module.exports = { run };

if (require.main === module) {
  require('../lib/check-cli').runCheckCli(run, process.argv[2]);
}
