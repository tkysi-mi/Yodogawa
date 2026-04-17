---
name: a-005-create-domain-diagram
description: ドメインモデルを Mermaid 図（Context Map・Aggregate 構造）として可視化する。ドメインモデル定義後、関係性を図で確認する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# CreateDomainDiagram (a-005)

## 目的

- ドメインモデルドキュメント（`01-domain-model.md`）を基に、視覚的なダイアグラムを作成する。
- Context Map（Bounded Context 間の関係図）を Mermaid 形式で図示する。
- 各 Bounded Context 内の Aggregate 構造や関係性を図示する（オプション）。

## 前提

- `docs/project/03-domain/01-domain-model.md` が作成されていること（`/a-004-define-domain-model` 実行済み）。
- ドメインモデルドキュメントに Bounded Context の一覧と関係性が記述されていること。

## 手順

### 1. ドキュメントの確認

```bash
ls -la docs/project/03-domain/01-domain-model.md 2>/dev/null || echo "ファイルが存在しません"
```

未作成の場合、`/a-004-define-domain-model` の実行を促す。

### 2. Context Map の情報収集と提案

`docs/project/03-domain/01-domain-model.md` から以下を抽出し、構成案を提示する:

- Bounded Context のリスト
- 戦略的分類（Core / Supporting / Generic）
- Context 間の関係性と通信方法

### 3. Context Map 図の作成

`## Context Map` セクションに Mermaid 図を追加する。スタイル定義と記述テンプレートは [examples/mermaid-templates.md](examples/mermaid-templates.md#context-mapbounded-context-間の関係) を参照。

- Core Domain: 金色、Supporting: 水色、Generic: グレー
- エッジラベルに関係パターン（Customer/Supplier、ACL 等）と通信方法を記載

### 4. 詳細図の作成（オプション）

ユーザー確認の上、以下を追加作成する:

- **Aggregate 構造図**: クラス図形式。Aggregate 内部の Entity/Value Object と関係を表現。
- **イベントフロー図**: シーケンス図形式。主要ビジネスフロー（Command → Event → Policy）を表現。

テンプレートは [examples/mermaid-templates.md](examples/mermaid-templates.md#aggregate-構造図クラス図形式) を参照。

### 5. レビューと確認

作成した図を提示し、関係性の正確性、色分けの適切性、読みやすさを確認する。質問例は [reference/structure-check.md](reference/structure-check.md#レビュー確認質問) を参照。フィードバックに応じてレイアウト（TD/LR）や配置を調整する。

### 6. 構造チェック

```bash
grep "\`\`\`mermaid" docs/project/03-domain/01-domain-model.md \
  && grep "## Context Map" docs/project/03-domain/01-domain-model.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/project/03-domain/01-domain-model.md
git commit -m "docs: ドメインモデル図（Context Map）の追加"
```

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加任意) を参照。

## 完了条件

- `docs/project/03-domain/01-domain-model.md` に Context Map 図が追加されている。
- Bounded Context 間の関係性が正しく表現されている。
- 戦略的分類が視覚的に区別されている。
- オプションの詳細図（Aggregate 図、シーケンス図）が必要に応じて追加されている。
- ユーザーが図の内容を承認している。

## エスカレーション

- **ドメインモデルが不完全で図を作成できない**: 「`/a-004-define-domain-model` に戻って定義を補完しましょう。」
- **図が複雑すぎて読みにくい**: 「主要な関係のみに絞るか、図を分割することを検討しましょう。」

## 参考

- [examples/mermaid-templates.md](examples/mermaid-templates.md) — Context Map / Aggregate / シーケンス図の Mermaid テンプレート、スタイル定義、エッジラベル例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー質問、Git 追加例
