---
name: a-013-define-architecture
description: 技術スタック・リポジトリ構造・データモデル・API 仕様を統合し、システムアーキテクチャと ADR を定義する。各設計ドキュメント確定後、全体像と意思決定を文書化する際に使用。
disable-model-invocation: true
---

# DefineArchitecture (a-013)

## 目的

- これまでに定義された設計（技術スタック、リポジトリ構造、データモデル、API 仕様）を統合する。
- システム全体の構造を Mermaid 図で視覚化する。
- 採用したアーキテクチャパターン（レイヤード、クリーンアーキテクチャなど）を明確化する。
- 重要なアーキテクチャ決定（ADR: Architecture Decision Record）を記録する。

## 前提

- 以下が作成されていること:
  - `docs/project/design/01-tech-stack.md`
  - `docs/project/design/02-repository-structure.md`
  - `docs/project/design/05-data-model.md`
  - `docs/project/design/06-api-spec.md`
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

上記 4 ドキュメントを読み込む。不足があれば対応ワークフロー（`/a-007`, `/a-008`, `/a-011`, `/a-012`）の実行を促す。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/07-architecture.md" "docs/project/design/07-architecture.md"
```

### 3. アーキテクチャの提案

技術スタックとリポジトリ構造からシステムの主要コンポーネント（クライアント、API、DB、外部サービス）を抽出し、全体図の構成案を提示する。

- 「[Web] -> [API Server] -> [DB]」
- 「[API Server] -> [External Service]」

### 4. 詳細定義（インタビュー）

#### 4.1 システムアーキテクチャ図

コンポーネント間の接続、プロトコル（HTTP/gRPC）、データフロー、スケーラビリティ構成（LB、Replica）を Mermaid 図で表現する。記述例は [examples/architecture-templates.md](examples/architecture-templates.md#システムアーキテクチャ図mermaid) を参照。

#### 4.2 アーキテクチャパターン

採用パターン（レイヤード、クリーン、マイクロサービス等）と選定理由を明確にする。選定ガイドは [examples/architecture-templates.md](examples/architecture-templates.md#アーキテクチャパターン選定ガイド) を参照。

#### 4.3 ADR (Architecture Decision Records)

重要な技術的決定（DB 選定、認証方式、フレームワーク選定など）を背景・代替案・決定理由・影響の形で記録する。テンプレートは [examples/architecture-templates.md](examples/architecture-templates.md#adrarchitecture-decision-recordテンプレート) を参照。ADR 記録の基準は [reference/structure-check.md](reference/structure-check.md#adr-記録の基準) を参照。

### 5. ドキュメント作成

`docs/project/design/07-architecture.md` に以下を記入する:

- システムアーキテクチャ図（Mermaid）
- 採用アーキテクチャパターンの説明
- ADR 一覧

### 6. 構造チェック

```bash
grep "\`\`\`mermaid" docs/project/design/07-architecture.md \
  && grep "## 採用アーキテクチャパターン" docs/project/design/07-architecture.md \
  && grep "## ADR" docs/project/design/07-architecture.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/project/design/07-architecture.md
git commit -m "docs: アーキテクチャ設計の定義"
```

## 完了条件

- `docs/project/design/07-architecture.md` が作成されている。
- システム全体の構成要素と関係性が可視化されている。
- 技術選定の背景（ADR）が文書化され、将来の参照用に残されている。
- ユーザーが内容を承認している。

## エスカレーション

- **アーキテクチャが複雑すぎる**: 「コンポーネント数が多すぎます。概要図と詳細図に分割するか、主要フローに絞って図示することを検討しましょう。」
- **決定理由が不明確**: 「[技術名] の選定理由が曖昧です。後で振り返れるよう、比較検討した代替案も含めて ADR に記録しましょう。」

## 参考

- [examples/architecture-templates.md](examples/architecture-templates.md) — システム全体図、冗長化構成、パターン選定ガイド、ADR テンプレート、ADR の典型例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー質問、ADR 記録基準
