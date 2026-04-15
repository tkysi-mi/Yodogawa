---
name: a-008-define-repository-structure
description: 技術スタックに基づいてプロジェクトのディレクトリ構造、アーキテクチャパターン、命名規則を定義するワークフロー
---

# DefineRepositoryStructure (a-008)

## 目的

- 決定された技術スタックに基づいて、最適なリポジトリ構造を定義する。
- アーキテクチャパターン（レイヤード、機能ベース、クリーンアーキテクチャなど）を選定する。
- ディレクトリの責務、命名規則、依存関係ルールを明確化する。

## 前提

- `docs/project/design/01-tech-stack.md` が作成されていること（先に `DefineTechStack` (a-007) を実行）。
- `docs/project/domain/01-domain-model.md` が作成されていること（推奨）。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

- `docs/project/design/01-tech-stack.md` を読み込み、技術スタックを確認する。

  ```bash
  ls -la docs/project/design/01-tech-stack.md 2>/dev/null || echo "ファイルが存在しません"
  ```

- 存在しない場合：ユーザーに通知し、`DefineTechStack` (a-007) を実行するよう促す。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/04-design/02-repository-structure.md" "docs/project/design/02-repository-structure.md"
  ```

### 3. アーキテクチャパターンの提案

- 技術スタックと要件に基づき、最適なアーキテクチャパターンを提案する。
  - **レイヤードアーキテクチャ**: 一般的なバックエンド（NestJS, Django等）
  - **機能ベース (Feature-based)**: フロントエンド、モジュラーモノリス
  - **クリーンアーキテクチャ**: 複雑なドメインロジックを持つ場合
  - **Atomic Design / FSD**: フロントエンド特化

- ユーザーに提示：
  - 「以下のアーキテクチャパターンを推奨します：[パターン名]」
  - 「理由：[技術スタックとの適合性、保守性など]」

### 4. ディレクトリ構造の詳細定義

ユーザーからのフィードバックを受け、詳細を決定する。

#### 4.1 ディレクトリ構成

- ソースコードのルート（`src/` vs `app/`）
- テストコードの配置（`tests/` vs コロケーション）
- 機能モジュールの構成（`features/`, `components/`, `lib/` 等）

#### 4.2 命名規則とルール

- ファイル名（PascalCase, camelCase, kebab-case）
- 依存関係ルール（上位層から下位層への依存のみ許可など）
- コロケーション戦略（関連ファイルをまとめるか分離するか）

### 5. ドキュメント作成

- `docs/project/design/02-repository-structure.md` に決定事項を記入する。
- **必須項目**:
  - ディレクトリツリー図（`tree`形式）
  - 各ディレクトリの役割説明
  - 採用したアーキテクチャパターンと理由
  - 命名規則と依存ルール

### 6. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # ディレクトリ構造図の確認
     grep "project-root/" docs/project/design/02-repository-structure.md && echo "OK" || echo "MISSING: Directory tree"
     # アーキテクチャパターンセクションの確認
     grep "## アーキテクチャパターン" docs/project/design/02-repository-structure.md && echo "OK" || echo "MISSING: Architecture section"
     # 命名規則セクションの確認
     grep "## 命名規則" docs/project/design/02-repository-structure.md && echo "OK" || echo "MISSING: Naming convention section"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/02-repository-structure.md` が作成されている
     - [ ] ディレクトリツリーが技術スタックと整合している
     - [ ] 各ディレクトリの責務が定義されている

### 7. Git への追加（オプション）

- ユーザーに確認：「作成したリポジトリ構造ドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/02-repository-structure.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: リポジトリ構造とアーキテクチャ定義の作成

  - ディレクトリ構成、命名規則、依存関係ルールを定義
  - 採用アーキテクチャパターン: [パターン名]
  ```

## 完了条件

- `docs/project/design/02-repository-structure.md` が作成されている。
- プロジェクトのディレクトリ構造が明確に定義されている。
- チーム開発に必要なルール（命名、配置、依存）が文書化されている。
- ユーザーが内容を承認している。

## エスカレーション

- 技術スタックと構造の不一致がある場合：
  - 「選択されたフレームワーク（[名前]）の標準構成と異なります。標準に従うか、独自の構造を採用するか確認しましょう。」と提案する。
- 構造が過度に複雑な場合：
  - 「初期段階では複雑すぎる可能性があります。まずはフラットな構成から始め、必要に応じて分割することを推奨します。」と提案する。
