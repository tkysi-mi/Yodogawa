---
name: ship-and-confirm
description: 実装と検証(green)が済み、ユーザーが出荷を承認した後に使用。feature ブランチのコミット → push → PR → ローカルゲート/マージ可否確認 → squash マージ →(承認時)npm リリースまでを規約どおり安全に行う。未検証・承認前には使わない。コミット/マージ/リリースの局面。
disable-model-invocation: false
allowed-tools: Read, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git switch:*), Bash(git checkout:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(npm run lint:md:*), Bash(node bin/cli.js:*), Bash(npm pack:*), Bash(npm version:*), Bash(npm publish:*), Bash(npm whoami:*), Bash(npx yodogawa:*), Bash(npm install:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh issue view:*)
argument-hint: "[PR/Issue番号 | 出荷したい変更]"
---

# ShipAndConfirm

## 目的

- 実装＋検証(green)が済んだ変更を、**ユーザーの出荷承認後に**安全にメインへ反映する。
- コミット → push → PR → ローカルゲート/マージ可否 → squash マージ →(承認時)npm リリース を**規約どおり・安全に**一貫実行する。

ワークフロー位置: `… → #3 計画 → 実装 → 検証(green) → 【このスキル】(承認後) コミット→PR→マージ→(任意)リリース`。
検証の実行自体は #3 計画の実行中（または #4）に行う。このスキルは**検証 green を前提に「出荷」だけ**を担う。

## 制約（最重要）

<critical>
- **出荷はユーザーの明示的な承認があるときだけ**（「出荷して」「コミットして」「マージまで進めて」等）。commit / push / PR / merge / publish は外向き・不可逆寄りの操作。**承認なく勝手に実行しない**。承認は per-action（特に **merge は main を更新**するので、マージ直前に最終確認。**npm publish は取消困難**なので publish 直前にも最終確認）。
- **検証 green が前提**。`npm run lint:md` が緑、CLI 挙動(`bin/cli.js`)や配布物を触る変更なら一時ディレクトリでの CLI smoke も OK であること。未検証なら出荷せず先に検証する。
- **`--no-verify` 等でフックを迂回しない**。husky の pre-commit = `npm run lint:md`(markdownlint) は通す。落ちたら md を**根本から直す**。
- **コミット前に作業ツリーを掃除**：`git status` で意図したファイルだけか確認。`.claude/` / `.agents/` / `.cursor/` / `.codex/`（スキルや CLI ローカルテスト生成物）は gitignore 済なので混入しないが、念のため確認する。
- **破壊的 git は使わない**（`reset --hard` / `push --force` 等）。
</critical>

## 手順

`$ARGUMENTS` に PR/Issue 番号があれば使う。なければ直近の実装ブランチ・`git status`・会話文脈から対象を特定する。

### 1. 出荷前チェック

- 検証が green か確認（直近の `npm run lint:md`、CLI を触る変更なら一時ディレクトリでの `node bin/cli.js` smoke）。未なら出荷を止めて検証へ。
- `git status` で差分を確認し、意図したファイルだけであること。`.claude/` / `.agents/` / `.cursor/` 等のローカルテスト生成物は gitignore 済で混入しないが、目視で確認する。常駐 dev サーバは存在しないので kill 等は不要。

### 2. ブランチ

- feature ブランチ上であること（`main` 直は禁止）。`main` なら `git switch -c <type>/issue-<n>-<slug>`（type = feat/fix/refactor/chore）。

### 3. コミット（Conventional Commits・日本語）

- `git add` → ステージ確認 → `git commit`。形式:

  ```
  <type>(<scope>): <日本語 subject> (#<issue>)

  <本文: 何を・なぜ。箇条書き可>

  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```

- **末尾の `Co-Authored-By` 行は必須**。pre-commit の `npm run lint:md` が落ちたら md を直して再ステージ。`--no-verify` 禁止。

### 4. push

- `git push -u origin <branch>`。

### 5. PR 作成

- `gh pr create --base main --title "<type>(<scope>): … (#<issue>)" --body …`。本文に **概要 / 変更点 / 受け入れ基準(チェック) / 検証結果 / `Closes #<issue>`** を入れ、末尾に必ず:

  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

### 6. マージ可否確認（CI は無い）

- Yodogawa に CI は無い。代わりに**ローカルゲートが green** であること（`npm run lint:md` ＋ 必要なら一時ディレクトリでの CLI smoke）を確認する。
- `gh pr view <n> --json mergeable,mergeStateStatus` で **MERGEABLE / CLEAN（コンフリクト無）**を確認する。

### 7. squash マージ（main を更新 ＝ 直前に最終確認）

- ローカルゲート green とマージ可否を確認し、**マージしてよいかユーザーに最終確認**（merge = main 更新）。
- `gh pr merge <n> --squash --delete-branch`。squash 件名も Conventional Commits 形式を維持。
- 注: マージそのものは自動デプロイ・自動 publish を誘発しない（Yodogawa に自動リリースは無い）。npm へ反映するには下記リリース段を別途実行する。

### 8. リリース（任意・ユーザーがリリースを承認したときだけ）

- README-UPDATING-NPM-PACKAGE.md 準拠。skills/templates の追加・変更を npm へ反映するときに実行する。
- 同梱物確認: `npm pack --dry-run` で `files`（bin / skills / templates / README / CHANGELOG）に過不足が無いか確認。
- 公開者確認: `npm whoami`（未ログインなら止めてユーザーに知らせる）。
- **publish は取消困難。実行直前にユーザーへ最終承認**を取る。承認後:
  - `npm version {patch|minor|major}`（package.json の version 更新 ＋ git tag 作成）。
  - `git push origin main && git push origin --tags`。
  - `npm publish`。

### 9. リリース後確認（リリースした場合のみ）

- 一時ディレクトリで `npx yodogawa@latest`（または `npm install yodogawa@latest`）して install smoke：最新版が `skills/` と `templates/` を正しく展開するか確認。終わったら一時ディレクトリを掃除。
- npm パッケージページ（<https://www.npmjs.com/package/yodogawa>）で最新バージョンが反映されているか確認。
- Claude Code プラグインとして配布するなら `/plugin marketplace add tkysi-mi/Yodogawa` → install が通るかも確認できる。
- Issue が `Closes` で閉じたか確認。確認できない項目は**未確認と明示**する。

## コミット / PR テンプレ（コピーして埋める）

```
# commit
fix(skills): ###5 出荷スキルの外来前提を Yodogawa 実態へ置換 (#42)

<本文>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

```
# release commit（npm version が自動生成）
chore(release): v1.2.0
```

```
# PR body
## 概要 / ## 変更点 / ## 受け入れ基準(チェック) / ## 検証(lint:md / 必要なら CLI smoke 結果)
Closes #<issue>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Red Flags — 出たら止まる

- 承認前に commit / push / merge / publish しようとする → 承認を得てから。merge と publish は特に最終確認。
- 「フックがうるさいので --no-verify」→ 禁止。md を直す。
- 「未検証だけど出荷」→ 先に検証 green（`npm run lint:md` ＋ 必要なら CLI smoke）。
- 「main に直接コミット」→ feature ブランチ＋PR。
- マージ可否が DIRTY / コンフリクト有のままマージ → MERGEABLE / CLEAN を確認してから。
- `Co-Authored-By` / PR の footer を付け忘れ → テンプレどおり付ける。
- 「マージ＝リリース完了」と誤認 → マージは npm へ反映しない。リリースは別承認＋ publish が必要。
- publish 後に install smoke せず「完了」報告 → `npx yodogawa@latest` で最新版が展開されるまで未完。

## 完了条件

- feature ブランチで規約どおりコミット（`Co-Authored-By` 付き）・push 済み、フック迂回なし。
- PR 作成（`Closes #n`・footer 付き）→ ローカルゲート green ＋ MERGEABLE/CLEAN 確認 → squash マージ済み。
- （リリースした場合）`npm version` → push → `npm publish` 済み、`npx yodogawa@latest` の install smoke ok と npm 最新版を確認、Issue クローズを確認（未確認項目は明示）。
- 各 outward 操作（commit / push / merge / publish）がユーザー承認の下で実行されている。
