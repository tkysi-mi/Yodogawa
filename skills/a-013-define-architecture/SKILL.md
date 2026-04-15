---
name: a-013-define-architecture
description: 技術スタック、リポジトリ構造、データモデル、API仕様を統合し、システム全体のアーキテクチャ設計とADRを定義するワークフロー
---

# DefineArchitecture (a-013)

## 目的

- これまでに定義された設計（技術スタック、リポジトリ構造、データモデル、API仕様）を統合する。
- システム全体の構造をMermaid図で視覚化する。
- 採用したアーキテクチャパターン（レイヤード、クリーンアーキテクチャなど）を明確化する。
- 重要なアーキテクチャ決定（ADR: Architecture Decision Record）を記録する。

## 前提

- `docs/project/design/01-tech-stack.md` が作成されていること。
- `docs/project/design/02-repository-structure.md` が作成されていること。
- `docs/project/design/05-data-model.md` が作成されていること。
- `docs/project/design/06-api-spec.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

- 必要なドキュメントを読み込む：
  - `docs/project/design/01-tech-stack.md`
  - `docs/project/design/02-repository-structure.md`
  - `docs/project/design/05-data-model.md`
  - `docs/project/design/06-api-spec.md`

- ドキュメントが不足している場合、対応するワークフローの実行を促す。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/04-design/07-architecture.md" "docs/project/design/07-architecture.md"
  ```

### 3. アーキテクチャの提案

- 技術スタックとリポジトリ構造から、システムの主要コンポーネント（クライアント、API、DB、外部サービス）を抽出する。
- **システム全体図の構成案を提示**:
  - 「以下のコンポーネントとデータフローを図示します：」
  - 「[Web] -> [API Server] -> [DB]」
  - 「[API Server] -> [External Service]」

### 4. 詳細定義（インタビュー）

ユーザーからのフィードバックを受け、詳細を定義する。

#### 4.1 システムアーキテクチャ図

- コンポーネント間の接続、プロトコル（HTTP/gRPC）、データフローをMermaid図で表現する。
- スケーラビリティや冗長化構成（ロードバランサー、レプリカDB）を反映する。

#### 4.2 アーキテクチャパターン

- 採用したパターン（レイヤード、クリーン、マイクロサービス等）とその選定理由を明確にする。

#### 4.3 ADR (Architecture Decision Records)

- 重要な技術的決定（DB選定、認証方式、フレームワーク選定など）を抽出する。
- 各決定について、背景・代替案・決定理由・影響を記録する。

### 5. ドキュメント作成

- `docs/project/design/07-architecture.md` に決定事項を記入する。
- **必須項目**:
  - システムアーキテクチャ図 (Mermaid)
  - 採用アーキテクチャパターンの説明
  - ADR一覧

### 6. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：
  1. **構造確認**:

     ```bash
     # アーキテクチャ図の確認
     grep "\`\`\`mermaid" docs/project/design/07-architecture.md && echo "OK" || echo "MISSING: Architecture Diagram"
     # パターン定義の確認
     grep "## 採用アーキテクチャパターン" docs/project/design/07-architecture.md && echo "OK" || echo "MISSING: Pattern definition"
     # ADRセクションの確認
     grep "## ADR" docs/project/design/07-architecture.md && echo "OK" || echo "MISSING: ADR section"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/07-architecture.md` が作成されている
     - [ ] システム全体像が視覚化されている
     - [ ] 重要な技術選定の理由（ADR）が記録されている

### 7. Git への追加（オプション）

- ユーザーに確認：「作成したアーキテクチャ設計ドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/07-architecture.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: アーキテクチャ設計の定義

  - システム全体図（Mermaid）の作成
  - アーキテクチャパターンとADRの記録
  ```

## 完了条件

- `docs/project/design/07-architecture.md` が作成されている。
- システム全体の構成要素と関係性が可視化されている。
- 技術選定の背景（ADR）が文書化され、将来の参照用に残されている。
- ユーザーが内容を承認している。

## エスカレーション

- アーキテクチャが複雑すぎる場合：
  - 「コンポーネント数が多すぎます。概要図と詳細図に分割するか、主要なフローに絞って図示することを検討しましょう。」と提案する。
- 決定理由が不明確な場合：
  - 「[技術名]の選定理由が曖昧です。後で振り返れるよう、比較検討した代替案も含めてADRに記録しましょう。」と促す。
