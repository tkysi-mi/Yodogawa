---
name: a-004-define-domain-model
description: Event Storming形式でドメインモデルを定義し、ユビキタス言語を反復的に洗練させるワークフロー
---

# DefineDomainModel (a-004)

## 目的

- Event Storming形式でドメインモデルを体系的に定義する。
- ドメインモデルを作成しながら、ユビキタス言語（共通用語）を並行して洗練させる。
- Bounded Context（境界づけられたコンテキスト）を特定し、各コンテキスト内のActors、Commands、Events、Policies、Aggregatesを明確化する。

## 前提

- `docs/project/behavior/01-scenarios.md` が作成されていること（先に `CreateScenarios` (a-003) を実行）。
- `docs/project/domain/` ディレクトリが存在すること（存在しない場合は先に `SetupDocStructure` (a-001) を実行）。
- ドメインエキスパート（ビジネス側の専門家）と協力できること。

## 手順

### 1. ディレクトリと前提条件の確認

- `docs/project/domain/` ディレクトリの存在を確認：

  ```bash
  ls -la docs/project/domain/ 2>/dev/null || echo "ディレクトリが存在しません"
  ```

- ディレクトリが存在しない場合：
  - ユーザーに通知：「`docs/project/domain/` ディレクトリが見つかりません。先に `SetupDocStructure` (a-001) を実行してください。」

- シナリオの確認：
  - `docs/project/behavior/01-scenarios.md` を読み込み、内容を確認する。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/03-domain/01-domain-model.md" "docs/project/domain/01-domain-model.md"
  cp "$SCRIPT_DIR/templates/project/03-domain/02-ubiquitous-language.md" "docs/project/domain/02-ubiquitous-language.md"
  ```

### 3. Bounded Context の特定

- シナリオとユーザーストーリーを分析し、Bounded Context（ビジネス領域）を提案する。
  - 「シナリオから、以下のBounded Contextが考えられます：[コンテキスト一覧]」
- 各Contextの戦略的分類（Core/Supporting/Generic）を確認する。

### 4. 各Bounded Context のドメインモデル定義

各Bounded Contextについて、以下の要素をヒアリング・定義し、`01-domain-model.md` を更新する。
**同時に、新しい用語が登場するたびに `02-ubiquitous-language.md` にも追記する。**

#### 4.1 概要とアクター

- Contextの責務と主要な責任
- 登場するアクター（Actors）とその役割

#### 4.2 コマンドとイベント (Event Storming)

- アクターが実行するアクション（**Commands**、命令形）
- その結果発生するビジネス上の出来事（**Domain Events**、過去形）
- 自動化ルール（**Policies**、"Whenever ..., then ..."）

#### 4.3 集約とモデル

- 一貫性を保つエンティティの塊（**Aggregates**）
- 画面表示用の参照モデル（**Read Models**）
- 連携する外部システム（**External Systems**）

### 5. ユビキタス言語の洗練

- `02-ubiquitous-language.md` を見直し、以下の点を確認・修正する：
  - 用語の重複や曖昧さがないか
  - 禁止用語（Data, Processなど曖昧な語）が含まれていないか
  - 定義が具体的で、Context内での意味に限定されているか

### 6. Context Map の定義

- 各Context間の関係性（Customer-Supplier, Shared Kernelなど）を定義し、`01-domain-model.md` のContext Mapセクション（Mermaid図）を更新する。

### 7. レビューと確認

- 作成したドキュメントを提示し、以下を確認する：
  - 「ビジネス用語は正確に表現されていますか？」
  - 「Aggregateの境界は適切ですか？」
  - 「ユビキタス言語の定義は明確ですか？」

### 8. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # Bounded Context定義の確認
     grep "Bounded Context:" docs/project/domain/01-domain-model.md && echo "OK" || echo "MISSING: Bounded Context definition"
     # Aggregate定義の確認
     grep "### Aggregates" docs/project/domain/01-domain-model.md && echo "OK" || echo "MISSING: Aggregates section"
     # ユビキタス言語定義の確認
     grep "| 用語 | 定義 |" docs/project/domain/02-ubiquitous-language.md && echo "OK" || echo "MISSING: Terminology table"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/domain/01-domain-model.md` が作成され、主要なEvent Storming要素が含まれている
     - [ ] `docs/project/domain/02-ubiquitous-language.md` が作成され、用語が定義されている
     - [ ] ドメインモデルとユビキタス言語の整合性が取れている

### 9. Git への追加（オプション）

- ユーザーに確認：「作成したドメインモデルドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/domain/
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: ドメインモデルとユビキタス言語の定義

  - Event Stormingによるドメインモデルの作成
  - Bounded Contextごとのユビキタス言語の整備
  ```

## 完了条件

- `docs/project/domain/01-domain-model.md` が作成されている。
- `docs/project/domain/02-ubiquitous-language.md` が作成されている。
- 各Bounded Contextについて、主要なドメイン要素（Aggregates, Commands, Events）が定義されている。
- ドメインモデルで使用される用語がユビキタス言語として定義されている。
- ユーザーが内容を承認している。

## エスカレーション

- シナリオが不足していてドメインモデルを作成できない場合：
  - 「シナリオ不足のためモデル化が困難です。`CreateScenarios` (a-003) に戻ってシナリオを充実させましょう。」と提案する。
- Bounded Contextの境界が不明確な場合：
  - 「境界が曖昧です。暫定的な境界を設定し、実装を進めながら見直す方針で進めませんか？」と提案する。
