---
name: execute-verification
description: 実装後（または既存の変更・PR）に検証を実際に実行し、証拠付き pass/fail と未検証項目を出すときに使用。静的ゲートだけで「動いた」と言わず、機能(CLI smoke)・公開(npm pack/install smoke)まで確認したいとき。#3 計画の検証段の実行・計画外の小変更・「この変更を検証して」。コミット/出荷の前。
disable-model-invocation: false
allowed-tools: Read, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(npm run lint:md:*), Bash(node bin/cli.js:*), Bash(npm pack:*), Bash(npx yodogawa:*), Bash(npm install:*), Bash(mkdir:*), Bash(rm:*), Bash(gh pr view:*)
argument-hint: "[PR/Issue番号 | 検証したい変更]"
---

# ExecuteVerification

## 目的

- 実装した（または既存の）変更を、**実際に検証を実行**して **証拠付き pass/fail** と **未検証項目** を出す。
- 「lint が green」だけで「動いた」と言わない。変更種別に応じて機能(CLI smoke)・公開(install smoke)まで確認する。

ワークフロー位置: `#3 計画 → 実装 → 【このスキル】検証実行 → (green & 承認) #5 出荷`。#3 を経ない小変更や「この PR を検証して」にも単独で使える。

## 制約（最重要）

<critical>
- **検証は実際に実行する**（コマンドを回し、必要なら一時ターゲットディレクトリで CLI を回し、公開済みなら install smoke を見る）。**結論より先に証拠を出す**（evidence before assertions）。
- **コミット / PR / マージ / 公開はしない**。それは #5 ship-and-confirm。このスキルは**検証して報告するだけ**（修正の実装にも踏み込まない）。
- **未検証の段は必ず明示する**。lint green は「Markdown の正しさ」であって「CLI/配布物の機能の正しさ」ではない（CLAUDE.md）。確証が無い所は「未検証」と書き、確信度を calibrate する（confident バイアス回避）。
- B smoke で一時ターゲットディレクトリを作ったら、**終わったら teardown**（一時ディレクトリを `rm -rf <temp>` で削除し、`git status` がクリーンであることを確認）。
- 破壊的・不可逆操作はしない（リポジトリ本体には触れない。`git reset` / `git checkout --` / `npm publish` / `npm version` 等は使わない＝出荷は #5）。
</critical>

## 前提

- 検証対象と**受け入れ基準（pass 条件）**を確定する（#1/#3 の成果物があれば流用。無ければ変更内容から 1〜数個に言語化）。
- どの段（A/B/C）まで要るかは変更種別で決める：SKILL.md/テンプレ/ドキュメントのみ→A 中心、`bin/cli.js` や配布物を触る→A+B、公開するとき→C。**A/B/C の定義は本スキル内に inline 済**（下記）。流れを変えるときは本スキルを直す。

A/B/C 検証フロー（Yodogawa）:

- **A 静的ゲート（必須・最初）**: `npm run lint:md`（markdownlint, 全 `**/*.md`, node_modules 除外）＋ SKILL.md/テンプレの frontmatter 妥当性 ＋ 内部リンク切れ（`[x](reference/...)` 等）＋ 受け入れ基準の機械確認（grep/ファイル存在）。型チェック/ユニットテスト/build は Yodogawa に無いので使わない。
- **B 機能 smoke（CLI挙動 `bin/cli.js` や配布物を触る変更で実施）**: 一時ターゲットディレクトリで `node bin/cli.js` を実行 → 対話選択（Claude Code=`.claude/` / Other=`.agents/`）→ `skills/` と `templates/` が正しくコピーされるか/冪等性/既存ディレクトリ上書きプロンプト/コピー漏れを確認。検証は CLI 出力と生成ファイルツリーで行う。終わったら一時ディレクトリ掃除。
- **C 公開（公開するときのみ）**: 公開前は `npm pack --dry-run` で `files`（bin/skills/templates/README/CHANGELOG）の同梱物を確認。公開済みなら `npx yodogawa@latest` を一時ディレクトリで install smoke（最新版が skills/templates を展開するか）。Yodogawa は CLI/配布物のみで、サーバ/DB/本番デプロイは存在しないため、ヘルスチェック等の動的確認は対象外。

## 手順

### 1. 検証スコープの確定

受け入れ基準（pass 条件）と、必要な検証段（A/B/C）を決める。

### 2. A 静的ゲート（必須・最初）

`npm run lint:md` を実行（markdownlint, errors 0 件を確認）。加えて SKILL.md/テンプレの frontmatter 妥当性・内部リンク切れ（`[x](reference/...)` 等の参照先がファイルとして存在するか）を確認し、受け入れ基準を grep/ファイル存在で機械確認する。**各コマンドの結果（エラー0 件・該当ファイル数等）を証拠として控える**。

### 3. B 機能 smoke（`bin/cli.js`/配布物を触る変更で実施）

一時ターゲットディレクトリ（gitignore 済領域でなくても、リポジトリ外の temp 推奨）を作り、その中で `node <repo>/bin/cli.js` を実行。対話選択で Claude Code（`.claude/`）と Other（`.agents/`）の双方を試し、`{target}/skills` と `{target}/templates` に `skills/`・`templates/` が漏れなくコピーされるか、再実行時の冪等性、既存ディレクトリ上書きプロンプトを確認。**生成ファイルツリー（`ls`/`find`）とコマンド出力を証拠に**。終わったら一時ディレクトリを `rm -rf <temp>` で掃除し、`git status` クリーンを確認。

### 4. C 公開（公開するときのみ）

公開前は `npm pack --dry-run` で `files` の同梱物（bin/skills/templates/README/CHANGELOG）を確認。公開済みなら別の一時ディレクトリで `npx yodogawa@latest` を実行し、最新版が skills/templates を展開する install smoke を行う（出力・生成ツリーを証拠に）。**公開の実行（`npm version`/`git push`/`npm publish`）は #5 の領分でここではしない**。

### 5. 証拠付き報告

受け入れ基準ごとに pass/fail と証拠を併記し、**未検証項目を明示**。検証観点の go/no-go を述べる（出荷の実行は #5）。

## 出力フォーマット

```
## 検証実行レポート

### 対象 / 受け入れ基準
- AC1: ... / AC2: ...

### 結果（証拠付き）
| 段 | 項目 | 結果 | 証拠 |
|----|------|------|------|
| A 静的 | lint:md / frontmatter / 内部リンク | ✅/❌ | 例: lint:md 0 errors・リンク切れ 0 |
| B CLI smoke | cli.js コピー/冪等/上書き | ✅/❌/skip | cli.js→.claude/skills コピー確認(ツリー) |
| C 公開 | pack 同梱 / install smoke | ✅/❌/skip | npm pack: bin/skills/templates 同梱 / npx yodogawa@latest install smoke OK |

### 未検証 / 動的確認が必要
- <静的に green でも未確認の CLI 挙動・公開後の展開・冪等性>

### 検証観点の結論
- go / no-go（理由）。出荷の実行は #5 で（承認後）
```

## Red Flags — 出たら止まる

- 「lint:md green だから動いた/完了」→ B/C と未検証明示が要る。
- 証拠なしに「pass」と書く → コマンド出力・生成ツリーを必ず添える。
- 検証せず #5（出荷）へ進む → 先に #4。
- 一時ターゲットディレクトリを残したまま → teardown（`rm -rf <temp>` ＋ `git status` クリーン確認）する。
- 未検証を「検証済み」と報告 → 禁止。未検証は未検証と書く。
- 検証を越えて修正・コミット・出荷まで踏み込む → **#4 は verify のみ**。

## 完了条件

- 受け入れ基準ごとに pass/fail が**証拠付き**で示されている。
- 必要な段（A/B/C）が変更種別に応じて実行され、**未検証項目が明示**されている。
- B smoke で一時ターゲットディレクトリを作ったら teardown 済み。コミット/出荷はしていない（#5 に委ねる）。
