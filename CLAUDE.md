# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリの目的

AIネイティブIDE（Antigravity, Cursor, Claude Code, Codex）向けの**仕様駆動開発スキル集**。Markdownベースのスキル定義を蓄積し、`npm install -g yodogawa` で他プロジェクトに導入できるCLIツールとして配布する。

## 開発コマンド

```bash
# Markdownのlint（全.mdファイル対象、node_modules と test/fixtures を除外）
npm run lint:md

# lint自動修正
npm run lint:md:fix

# テスト（node:test。test/**/*.test.js）
npm test

# リポジトリ整合性チェック（スキル間 /xxx 参照・README 表・相対リンク。dev 専用）
npm run check:repo

# CLIをローカルで実行テスト
node bin/cli.js            # 対話インストール
node bin/cli.js doctor --dir test/fixtures/broken-project   # ドキュメント検査
node bin/cli.js new-task some-task-slug                     # タスク採番
```

- **pre-commitフック**: huskyにより `npm run lint:md` がコミット前に自動実行される
- **CI**: lint / test / manifest 同期チェック / `check:repo` を実行（`.github/workflows/ci.yml`）

## アーキテクチャ

### CLIツール (`bin/`)

npmパッケージ `yodogawa` のエントリポイント。`bin/cli.js` は argv ディスパッチャで、引数なしは対話インストール（`bin/commands/install.js`）、`doctor`（`bin/commands/doctor.js`）と `new-task`（`bin/commands/new-task.js`）をサブコマンドとして持つ。インストールは配置先（Claude Code 用 `.claude/` または Cursor/Codex/Antigravity 共通の `.agents/`）を選択し、`skills/`, `templates/` をそのまま `{IDE_DIR}/` 配下にコピーする。スキルの中核は `name` / `description` ＋ Markdown 本文で、配置先ディレクトリの違いで各 IDE に対応する。一部の frontmatter フィールド（`disable-model-invocation` / `allowed-tools` / `argument-hint` / `context: fork`）は Claude Code 向けの拡張で、他 IDE での対応は各 IDE 仕様に依存する（README「設計上の決定」参照）。

`doctor` の各チェックは `bin/checks/*.js`（`run({ rootDir })` を export、単体実行シム付き）、共有ロジックは `bin/lib/`（`project-spec.js` が docs/project の正準構造・ID 体系の SSoT。templates/ との同期は `test/project-spec-sync.test.js` が検証）。npm の `files` が配布するコードは `bin` のみ（他は `skills`/`templates`/`README.md`/`CHANGELOG.md`）。配布物から参照されるコードは `bin/` 配下に置くこと（`scripts/` は dev 専用で非配布）。

依存: `fs-extra`, `kleur`, `prompts`（サブコマンドは非対話のため `prompts` を使わない）

### スキル体系 (`skills/`)

各フォルダが1つのスキル定義（`{name}/SKILL.md`）。番号プレフィックスで開発フェーズを表す：

| プレフィックス | フェーズ | 概要 |
|:--|:--|:--|
| `a-NNN` | プロジェクト設計 | 要件定義→ドメイン→技術選定→画面/DB/API/インフラ設計 |
| `b-NNN` | タスク管理 | タスクディレクトリ作成→定義→リサーチ→実装計画→レビュー |
| `c-NNN` | 実装実行 | ステップバイステップ実装→ドキュメント更新 |

インストール後は `.claude/skills/{name}/SKILL.md` または `.agents/skills/{name}/SKILL.md` として各IDEに認識される。

### テンプレート (`templates/`)

- `project/` — プロジェクトレベルのドキュメントテンプレート（要件、シナリオ、ドメイン、設計）
- `tasks/task-template/` — タスク単位の3ドキュメント（`a-definition.md`, `b-research.md`, `c-implementation.md`）

### タスク管理構造

タスクは `docs/tasks/task000001-{スラッグ}/` に配置。spec-kit（GitHub）にインスパイアされた仕様→リサーチ→実装計画→実行のフロー。タスクIDは6桁ゼロパディング。

## スキル作成ルール

新規スキル追加時のルール：

- `skills/{kebab-name}/SKILL.md` 形式でフォルダを作成する
- YAML frontmatterに `name` と `description` フィールドを必須で記載
- セクション構成: 目的 / 前提 / 手順 / 完了条件 / エスカレーション
- ステップ記法: 分岐は「IF ... THEN ...」、反復は「FOR EACH ...」
- 12,000文字のワークフロー上限を意識し、長文は `@path/to/doc.md` 参照
- 依存スキルはバッククォート付きスラッシュ名（`/a-002-initialize-project` フル形、または `/a-002` 短縮形）で参照する。参照先の実在は CI の `npm run check:repo` で検証される

## npmパッケージ配布

`package.json` の `files` フィールドで `bin`, `skills`, `templates`, `README.md`, `CHANGELOG.md` のみを配布対象にしている。スキルやテンプレートの追加・変更時はバージョンを上げて `npm publish` する。

## Markdownlint設定

`.markdownlint.json` で以下のルールを無効化:
MD001(見出しレベル), MD013(行長), MD024(重複見出し), MD033(HTML), MD036(強調の代用), MD040(コードブロック言語), MD041(先頭見出し), MD060
