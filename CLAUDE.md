# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリの目的

AIネイティブIDE（Antigravity, Cursor, Claude Code, Codex）向けの**仕様駆動開発スキル集**。Markdownベースのスキル定義を蓄積し、`npm install -g yodogawa` で他プロジェクトに導入できるCLIツールとして配布する。

## 開発コマンド

```bash
# Markdownのlint（全.mdファイル対象、node_modules除外）
npm run lint:md

# lint自動修正
npm run lint:md:fix

# CLIをローカルで実行テスト
node bin/cli.js
```

- **pre-commitフック**: huskyにより `npm run lint:md` がコミット前に自動実行される
- **テストスイートは未整備**: `npm test` は未実装（`echo "Error: no test specified" && exit 1`）

## アーキテクチャ

### CLIツール (`bin/cli.js`)

npmパッケージ `yodogawa` のエントリポイント。対話形式で配置先（Claude Code 用 `.claude/` または Cursor/Codex/Antigravity 共通の `.agents/`）を選択し、`skills/`, `templates/`, `scripts/` をそのまま `{IDE_DIR}/` 配下にコピーする。4つのIDEは全て Claude Code の SKILL.md 標準に収束しているため、配置先ディレクトリの違いだけで対応できる。

依存: `fs-extra`, `kleur`, `prompts`

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
- 依存ワークフローは `Call /workflow-name` と明記

## npmパッケージ配布

`package.json` の `files` フィールドで `bin`, `skills`, `templates`, `scripts`, `README.md`, `CHANGELOG.md` のみを配布対象にしている。スキルやテンプレートの追加・変更時はバージョンを上げて `npm publish` する。

## Markdownlint設定

`.markdownlint.json` で以下のルールを無効化:
MD001(見出しレベル), MD013(行長), MD024(重複見出し), MD033(HTML), MD036(強調の代用), MD040(コードブロック言語), MD041(先頭見出し), MD060
