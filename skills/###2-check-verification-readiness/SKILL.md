---
name: check-verification-readiness
description: 変更/Issueに対する「推奨検証方法」と「検証環境の現状（Docker/依存/devサーバ/認証）」を読み取りで診断し、検証可能までのギャップと手順を提示する。事実確認の後・実装計画の前に使用。環境を起動・変更しない。
disable-model-invocation: false
allowed-tools: Read, Grep, Glob, Bash(docker ps:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(npm ls:*), Bash(npm outdated:*), Bash(tasklist:*), Bash(netstat:*), Bash(curl:*), Bash(gh issue view:*)
argument-hint: "[issue番号 | 検証したい変更の説明]"
---

# CheckVerificationReadiness

## 目的

- 変更（または Issue）に対して **「どう検証すべきか（推奨検証方法）」** を決める。
- **検証環境の現状**（Docker・依存・dev サーバ・Shopify 認証・アプリ到達性）を読み取りで診断する。
- **検証可能になるまでのギャップと手順**を提示し、後続のプランモード（実装＋検証のプランニング）に渡す。

ワークフロー上の位置: `Issue作成 → 事実確認(verify-issue-facts) → 【このスキル】検証方法＋環境現状の確認 → プランモードで実装＆検証をプランニング`。

## 制約（最重要）

<critical>
- このスキルは**読み取り専用・診断のみ**。`allowed-tools` に `Write`/`Edit`/`Agent` を含めず、Bash も状態を変えない確認系（`docker ps`/`netstat`/`tasklist`/`git status/diff/log`/`npm ls/outdated`/`curl`）にスコープしている。
- **環境を起動・変更しない**。`docker start` / `npm i` / `npm run dev` などの**実行はしない**。必要な手順は「提案」として提示するだけ。実際の起動は後続のプランモード以降で行う。
- `curl` は到達確認の **GET のみ**。POST/PUT/DELETE 等の状態変更には使わない。
- 結果は**チャットに出力するのみ**。ファイルは作成・変更しない。
</critical>

## 手順

`$ARGUMENTS` に issue 番号があれば文脈取得に使う。なければ直前の事実確認結果・`git diff`・ユーザー説明から対象を特定する。

### 1. 対象の把握

検証対象（変更種別）を特定する。情報源の優先順:

- 直前の事実確認（verify-issue-facts）の結果があればそれを使う。
- `git status` / `git diff` で未コミットの変更を確認する。
- `$ARGUMENTS` の issue 番号があれば `gh issue view <番号>` で文脈を補う。

変更がどの層に属するかを判定する（backend / 管理画面UI / テーマ拡張 / prisma / 本番）。

### 2. 検証方法の決定

変更種別から推奨検証手段を選び、既存プレイブック（メモリ）に紐づける。

| 変更種別 | 推奨検証 | 参照プレイブック |
|---|---|---|
| backend（loader/action・metafield 保存等） | ユニットテスト＋ GraphiQL(:3457) クエリ／管理画面操作 | dev-env-verification |
| 管理画面 UI（Polaris） | claude-in-chrome で admin（mix-juice-2）を操作 | dev-env-verification |
| テーマ拡張（Liquid／ストアフロント） | preview URL で出力・XSS を検証 | storefront-xss-verification |
| prisma schema／migration | `prisma migrate status`・型生成確認 | local-npm-allowscripts |
| 本番 | Railway `/health` → deployment list → logs | production-deploy-and-railway |

**成功条件**（どうなれば pass か）を必ず言語化する。

### 3. 環境現状の診断（read-only）

選んだ検証方法に必要な環境を、状態を変えずに確認する。

- **Docker / DB**: `docker ps` で `food-labeler-dev`（postgres:16・port 5433）が Up か。
- **依存**: `node_modules` の有無（Glob/Read）、`npm ls` の整合 → **npm i が要るか**。
- **dev サーバ**（`shopify app dev`）: `tasklist` でプロセス、`netstat` でポート（GraphiQL 3457 等）の LISTENING、必要なら `curl` で GET 到達確認。
- **Shopify CLI 認証**: 切れていればデバイス認証＝**手動ログインが必要**（このフローで Claude が代行できない唯一のブロッカー）。
- **確認先 URL**: 埋め込みアプリ admin（開発ストア mix-juice-2）。

### 4. ギャップと手順の提示

現状から「今すぐ検証可能」か、未達なら**埋めるべき手順**を順序立てて提示する（**実行はしない**）。手動ブロッカー（Shopify ログイン）は明示する。

### 5. レポート出力（チャットのみ）

下記フォーマットで出力し、プランモードへ渡す。

## 出力フォーマット

```
## 検証レディネス確認

### 対象
<検証対象 / 変更種別を 1-2文>

### 推奨検証方法
- 手段: <ユニットテスト / ブラウザ(claude-in-chrome) / ストアフロント preview / GraphiQL ...>
- 成功条件: <どうなれば pass か>
- 参照プレイブック: <該当メモリ/手順>

### 環境現状
| 項目 | 状態 | 備考 |
|------|------|------|
| Docker / food-labeler-dev | ✅/❌ | ... |
| 依存(node_modules) | ✅/❌ | npm i 要否 |
| dev サーバ | ✅/❌ | port/process |
| Shopify 認証 | ✅/❓ | 要ログイン等 |

### ギャップと手順（提案・未実行）
1. <例: docker start food-labeler-dev>
2. <例: npm i>
3. <例: npm run dev（background）>
- 手動ブロッカー: Shopify ログイン（ユーザー対応）

### 次の一手
プランモードへ: 上記の検証方法＋手順を実装計画に組み込む
```

## 完了条件

- 推奨検証方法と成功条件が提示されている。
- 環境現状が全項目チェックされている。
- 検証可能までのギャップと手順が提示されている（未実行）。
- **環境・ファイルの状態を一切変更していない**（read-only 遵守）。
