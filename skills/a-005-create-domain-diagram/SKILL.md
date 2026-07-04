---
name: a-005-create-domain-diagram
description: （任意 / advanced）Domain Sketch を完全な Event Storming（Bounded Context・Aggregate・Context Map）へ拡張し、Mermaid 図で可視化する。複雑なドメインで Full DDD が必要なときに使用。標準の MVP フローには含まれない。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# CreateDomainDiagram (a-005)

> ⚠️ これは**任意 / advanced スキル**。標準の MVP フローには含まれない。a-004 の軽量な Domain Sketch（`01-domain-sketch.md`）で十分なドメインでは実行不要。Bounded Context が複数に分かれる、集約境界の検討が必要、Context 間連携が複雑、といった場合にのみ使う。

## 目的

- 軽量な Domain Sketch（`01-domain-sketch.md`）を入力に、完全な Event Storming 形式のドメインモデル（`01-domain-model.md`）へ拡張する。
- Bounded Context・Commands・Events・Policies・Aggregates・Read Models・External Systems を体系的に整理する。
- Context Map（Bounded Context 間の関係図）と Aggregate 構造を Mermaid 形式で図示する。

## 前提

- `docs/project/03-domain/01-domain-sketch.md` が作成されていること（`/a-004-define-domain-model` 実行済み）。
- ドメインが複雑で、軽量な Domain Sketch だけでは設計判断が難しいこと（そうでなければ本スキルは不要）。

## 手順

### 1. ドキュメントの確認

```bash
ls -la docs/project/03-domain/01-domain-sketch.md 2>/dev/null || echo "Domain Sketch が存在しません"
```

未作成の場合、`/a-004-define-domain-model` の実行を促す。`01-domain-sketch.md` を読み込み、主要概念・境界・中核エンティティを把握する。

### 2. Full DDD テンプレートの準備

このスキルの配置ディレクトリ（`skills/a-005-create-domain-diagram/`）を起点に、相対パス `../../templates/project/03-domain/01-domain-model.md` を Read で読み込み、その内容を `docs/project/03-domain/01-domain-model.md` へ Write する（冪等。既存ならスキップして報告する）。Domain Sketch の内容を起点に、Bounded Context・Commands・Events・Policies・Aggregates・Read Models・External Systems を埋める。

コピー直後に、ドキュメント冒頭のメタヘッダを記入する（Owner は文書責任者。未確認ならユーザーに確認し、既存 docs があればその Owner を引き継ぐ / Status は `draft` / Last-updated は当日日付）。

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
git commit -m "docs: Full DDD ドメインモデル・Context Map 図の作成"
```

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加任意) を参照。

## 完了条件

- `docs/project/03-domain/01-domain-model.md` が Full Event Storming 形式で作成され、Context Map 図が追加されている。
- Bounded Context 間の関係性が正しく表現されている。
- 戦略的分類が視覚的に区別されている。
- オプションの詳細図（Aggregate 図、シーケンス図）が必要に応じて追加されている。
- ユーザーが図の内容を承認している。

## エスカレーション

- **Domain Sketch が不完全で拡張できない**: 「`/a-004-define-domain-model` に戻って Domain Sketch を補完しましょう。」
- **そもそも Full DDD が過剰**: 「MVP 段階では Domain Sketch で十分なことが多いです。本スキルは複雑ドメインに限って使いましょう。」
- **図が複雑すぎて読みにくい**: 「主要な関係のみに絞るか、図を分割することを検討しましょう。」

## 参考

- [examples/mermaid-templates.md](examples/mermaid-templates.md) — Context Map / Aggregate / シーケンス図の Mermaid テンプレート、スタイル定義、エッジラベル例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー質問、Git 追加例
- [../a-004-define-domain-model/reference/event-storming-guide.md](../a-004-define-domain-model/reference/event-storming-guide.md) — Actors / Commands / Events / Policies / Aggregates / Context Map パターンなど各要素の意味・付箋の色・CQRS / ACL の解説
- [../../templates/project/03-domain/01-domain-model.md](../../templates/project/03-domain/01-domain-model.md) — Full Event Storming（advanced）テンプレート
