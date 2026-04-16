---
name: a-008-define-repository-structure
description: 技術スタックに基づきディレクトリ構造・アーキテクチャパターン・命名規則を定義する。技術選定後、コードの配置方針を決める際に使用。
disable-model-invocation: true
---

# DefineRepositoryStructure (a-008)

## 目的

- 決定された技術スタックに基づいて、最適なリポジトリ構造を定義する。
- アーキテクチャパターン（レイヤード、機能ベース、クリーンアーキテクチャなど）を選定する。
- ディレクトリの責務、命名規則、依存関係ルールを明確化する。

## 前提

- `docs/project/design/01-tech-stack.md` が作成されていること（`/a-007-define-tech-stack` 実行済み）。
- `docs/project/domain/01-domain-model.md` が作成されていること（推奨）。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

```bash
ls -la docs/project/design/01-tech-stack.md 2>/dev/null || echo "ファイルが存在しません"
```

`01-tech-stack.md` を読み込み、技術スタックを把握する。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/02-repository-structure.md" "docs/project/design/02-repository-structure.md"
```

### 3. アーキテクチャパターンの提案

技術スタックと要件に基づき、最適なパターンを提案する。選定ガイドは [reference/structure-check.md](reference/structure-check.md#アーキテクチャパターン選定ガイド) を参照。

- レイヤード / 機能ベース / クリーンアーキテクチャ / Atomic Design / FSD
- 「推奨: [パターン名]」「理由: [技術スタックとの適合性、保守性]」

### 4. ディレクトリ構造の詳細定義

フィードバックを受けて以下を確定する。具体的なツリー例は [examples/structure-templates.md](examples/structure-templates.md#アーキテクチャパターン別の構成例) を参照。

- **ディレクトリ構成**: ソースルート（`src/` vs `app/`）、テスト配置、機能モジュール構成
- **命名規則**: ファイル名（PascalCase / camelCase / kebab-case）、識別子規則
- **依存関係ルール**: 上位層から下位層への依存のみ等
- **コロケーション戦略**: 関連ファイルをまとめるか分離するか

命名規則と依存ルールの具体例は [examples/structure-templates.md](examples/structure-templates.md#命名規則のサンプル) を参照。

### 5. ドキュメント作成

`docs/project/design/02-repository-structure.md` に以下を記入する:

- ディレクトリツリー図（`tree` 形式）
- 各ディレクトリの役割説明
- 採用したアーキテクチャパターンと理由
- 命名規則と依存ルール

### 6. 構造チェック

```bash
grep "project-root/" docs/project/design/02-repository-structure.md \
  && grep "## アーキテクチャパターン" docs/project/design/02-repository-structure.md \
  && grep "## 命名規則" docs/project/design/02-repository-structure.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/project/design/02-repository-structure.md
git commit -m "docs: リポジトリ構造とアーキテクチャ定義の作成"
```

## 完了条件

- `docs/project/design/02-repository-structure.md` が作成されている。
- プロジェクトのディレクトリ構造が明確に定義されている。
- チーム開発に必要なルール（命名、配置、依存）が文書化されている。
- ユーザーが内容を承認している。

## エスカレーション

- **技術スタックと構造の不一致**: 「選択されたフレームワーク（[名前]）の標準構成と異なります。標準に従うか、独自構造を採用するか確認しましょう。」
- **構造が過度に複雑**: 「初期段階では複雑すぎる可能性があります。まずはフラットな構成から始め、必要に応じて分割することを推奨します。」

## 参考

- [examples/structure-templates.md](examples/structure-templates.md) — パターン別ディレクトリツリー例、命名規則、依存関係ルール、コロケーション戦略
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、パターン選定ガイド、レビュー質問
