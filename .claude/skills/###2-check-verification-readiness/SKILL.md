---
name: check-verification-readiness
description: 変更/Issueに対する「推奨検証方法」と「検証環境の現状（node/npm・依存・一時ターゲット・認証）」を診断し、検証可能までのギャップと手順を提示する。合意があれば検証環境のセットアップ（依存導入・一時ターゲット用意・copy smoke）まで行い、実装後の検証で使う検証 runbook を次ステップ用に残す。事実確認の後・実装計画の前に使用。
disable-model-invocation: false
allowed-tools: Read, Grep, Glob, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(npm ls:*), Bash(npm outdated:*), Bash(npm install:*), Bash(npm run lint:md:*), Bash(node bin/cli.js:*), Bash(npm pack:*), Bash(npm whoami:*), Bash(gh auth status:*), Bash(gh issue view:*), Bash(mktemp:*), Bash(rm -rf:*)
argument-hint: "[issue番号 | 検証したい変更の説明]"
---

# CheckVerificationReadiness

## 目的

- 変更（または Issue）に対して **「どう検証すべきか（推奨検証方法）」** を決める。
- **検証環境の現状**（node/npm・依存・一時ターゲット・gh/npm 認証）を読み取りで診断する。
- **検証可能になるまでのギャップと手順**を提示し、後続のプランモード（実装＋検証のプランニング）に渡す。
- 合意があれば**検証環境を実際にセットアップ**し、実装後の検証で再利用する**検証 runbook を次ステップ用に残す**。

ワークフロー上の位置: `Issue作成 → 事実確認(verify-issue-facts) → 【このスキル】検証方法＋環境現状の確認(＋合意でセットアップ) → #3 計画 → #4 検証実行 → #5 出荷`。

## 制約（最重要）

<critical>
- **まず read-only で診断する**（手順1〜4）。`Write`/`Edit` は使わず、レポート以外のファイルは作らない。
- **検証環境の準備は、診断・提示の後にユーザーの go-ahead を得てから実行してよい**（`npm install`（依存欠落時）／一時ターゲット用意／`node bin/cli.js` の copy smoke など非破壊の準備）。**診断 → 提示 → 合意 → 実行**の順を守り、go-ahead 無しに勝手に実行しない。
- **破壊的・不可逆な操作は実行しない**（リポジトリ本体への `rm`／`reset --hard`／force／`npm publish` 等）。提案に留め確認を取る。一時ターゲットディレクトリの掃除（`rm -rf <temp>`）はパスが一時ディレクトリであることを確認してから行う。
- **gh ログイン（`gh auth`）・npm ログイン（`npm login`）は Claude が代行できない手動ブロッカー**。PR 時・公開時に切れていればユーザーに依頼する。
- 認証状態の確認は `gh auth status` / `npm whoami` の **read-only 確認のみ**。結果はチャットに出力する。
</critical>

## 手順

`$ARGUMENTS` に issue 番号があれば文脈取得に使う。なければ直前の事実確認結果・`git diff`・ユーザー説明から対象を特定する。

### 1. 対象の把握

検証対象（変更種別）を特定する。情報源の優先順:

- 直前の事実確認（verify-issue-facts）の結果があればそれを使う。
- `git status` / `git diff` で未コミットの変更を確認する。
- `$ARGUMENTS` の issue 番号があれば `gh issue view <番号>` で文脈を補う。

変更がどの種別に属するかを判定する（md 内容 / CLI挙動(bin/cli.js) / 配布物(package.json files・bin)・公開）。

### 2. 検証方法の決定

変更種別から推奨検証手段を選び、下記 A/B/C のどの段が必要かを紐づける。

| 変更種別 | 推奨検証 |
|---|---|
| スキル/テンプレ等 md 内容の変更 | A: `npm run lint:md` ＋ 内部リンク／frontmatter 確認 |
| CLI（bin/cli.js）挙動の変更 | A+B: lint:md ＋ 一時ディレクトリで `node bin/cli.js` の copy smoke（コピー／冪等／上書き） |
| 配布物（package.json files／bin）・公開の変更 | A+B+C: ＋ `npm pack --dry-run` 同梱確認、公開時 `npx yodogawa@latest` install smoke |

**成功条件**（どうなれば pass か）を必ず言語化する。下記 A〜C（A 静的 / B CLI smoke / C リリース）から、変更種別に応じて必要段を選ぶ（本体実行は #4）。

### 3. 環境現状の診断（read-only）

選んだ検証方法に必要な環境を、状態を変えずに確認する。

- **node/npm**: `node -v` / `npm -v` が使えるか（実行系の前提）。
- **依存**: `node_modules` の有無（Glob/Read）、`npm ls` の整合 → **`npm install` が要るか**（deps: fs-extra / kleur / prompts）。
- **一時ターゲット**: B の copy smoke 用に書き込み可能な一時ディレクトリ（`mktemp -d` 等）を用意できるか。
- **gh / npm 認証**（後段の手動ブロッカー）: PR 時に `gh auth status`、公開時に `npm whoami`。切れていれば**手動ログインが必要**（このフローで Claude が代行できないブロッカー）。

### 4. ギャップと手順の提示

現状から「今すぐ検証可能」か、未達なら**埋めるべき手順**を順序立てて提示する。手動ブロッカー（gh/npm 認証）は明示する。ここまでは read-only。

### 5. セットアップ実行（合意後・任意）

ユーザーが「整えて」等の go-ahead を出したら、非破壊の準備を順に実行する（破壊的操作はしない）:

1. **依存**: `node_modules` が欠落／不整合なら `npm install` → `npm ls` で fs-extra/kleur/prompts を確認
2. **一時ターゲット用意**: `mktemp -d`（例 `T=$(mktemp -d)`）で copy smoke 用ディレクトリを作る
3. **copy smoke を一度通す**: 一時ターゲットを cwd にして `node bin/cli.js` を実行し、対話選択（Claude Code=`.claude/` / Other=`.agents/`）→ `{target}/skills`・`{target}/templates` にコピーされるか・冪等性・既存上書きプロンプトを確認
4. **teardown**（用が済んだら）: 一時ディレクトリを削除（`rm -rf "$T"`、パスが一時ディレクトリであることを確認）。リポジトリ本体は触らないので `git status` がクリーンであることも確認

実装後の検証で再実行が要るので、実行有無に関わらず**下記「検証 runbook」を次ステップ用に必ず残す**。

### 6. レポート出力（チャットのみ）

下記フォーマットで出力し、プランモードへ渡す。

## 出力フォーマット

```
## 検証レディネス確認

### 対象
<検証対象 / 変更種別を 1-2文>

### 推奨検証方法
- 手段: <lint:md / 内部リンク・frontmatter 確認 / CLI install smoke / npm pack --dry-run ...>
- 必要段: <A / A+B / A+B+C>
- 成功条件: <どうなれば pass か>

### 環境現状
| 項目 | 状態 | 備考 |
|------|------|------|
| node / npm | ✅/❌ | バージョン |
| 依存(node_modules) | ✅/❌ | npm install 要否 |
| 一時ターゲット | ✅/❓ | mktemp -d 可否 |
| gh / npm 認証 | ✅/❓ | PR時 gh auth・公開時 npm whoami |

### ギャップと手順（提案。go-ahead 後に実行したものは ✓）
1. <例: npm install（依存欠落時）> [✓ 実行済み / 未]
2. <例: 一時ターゲット用意（mktemp -d）>
3. <例: node bin/cli.js で copy smoke>
- 手動ブロッカー: gh auth（PR時）／ npm login（公開時）（ユーザー対応）

### 検証 runbook（次ステップ＝実装後の検証用に残す）
- A 静的: `npm run lint:md`（markdownlint）＋ frontmatter 妥当性・内部リンク切れ・受け入れ基準を grep/ファイル存在で機械確認
- B CLI smoke（CLI/配布物を触る変更時）: `T=$(mktemp -d)` → 一時ターゲットで `node bin/cli.js`（Claude Code=`.claude/` / Other=`.agents/` を選択）→ `{T}/skills`・`{T}/templates` のツリー確認（コピー漏れ・冪等・上書き） → `rm -rf "$T"` で掃除
- C リリース（公開する変更時のみ）: `npm pack --dry-run` で `files`（bin/skills/templates/README/CHANGELOG）の同梱確認
- 手動ブロッカー: PR 時 `gh auth`／公開時 `npm whoami`（=`npm login`）

### 次の一手
プランモード(#3)へ: 検証方法＋手順を実装計画に組み込む。環境は <準備済み / 上記 runbook で実行> の状態（runbook は #4 検証実行・#5 出荷で再利用）。
```

## 標準検証フロー（参照）

検証の定石は **A 静的ゲート / B CLI smoke / C リリース** の 3 段:

- **A 静的ゲート（必須・最初）**: `npm run lint:md`（markdownlint, 全 `**/*.md`・node_modules除外）。加えて SKILL.md/テンプレの frontmatter 妥当性、**内部リンク切れ**（`[x](reference/...)` 等）、受け入れ基準の機械確認（grep/ファイル存在）。Yodogawa に typecheck/ユニットテスト/build は無いので使わない（`npm test` は未実装）。
- **B CLI smoke**（`bin/cli.js` や配布物を触る変更で実施）: 一時ターゲットで `node bin/cli.js` を実行し、対話選択 → `skills/`・`templates/` が `{target}/skills`・`{target}/templates` に正しくコピーされるか・冪等性・既存上書きプロンプト・コピー漏れを確認。証拠＝コマンド出力・生成ファイルツリー。終わったら一時ディレクトリを掃除。Web UI が無いのでブラウザ検証は不要。
- **C リリース**（公開するときのみ）: `npm pack --dry-run` で同梱物を確認 → ユーザー承認後に `npm version ...` → push → `npm publish` → 公開後 `npx yodogawa@latest` を一時ディレクトリで install smoke。

このスキルの役割は **環境の診断(read-only) ＋ 合意後の準備・copy smoke(手順5) ＋ 検証 runbook の引き継ぎ**まで。A/B/C の**本体実行は #4 execute-verification**、計画への落とし込みは **#3** が担う。

## 完了条件

- 推奨検証方法と成功条件が提示されている。
- 環境現状が全項目チェックされている（診断は read-only）。
- ギャップと手順が提示され、go-ahead があれば非破壊の準備まで実行されている（破壊的操作はしていない）。
- **実装後の検証で使う「検証 runbook」が次ステップ用に残されている**（A 静的／B CLI smoke／C リリース＋手動ブロッカー）。
