---
name: a-004-define-domain-model
description: Event Storming 形式でドメインモデル（イベント・コマンド・集約）を定義し、ユビキタス言語を整備する。シナリオ作成後、ドメイン設計を開始する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineDomainModel (a-004)

## 目的

- Event Storming 形式でドメインモデルを体系的に定義する。
- ドメインモデルを作成しながら、ユビキタス言語（共通用語）を並行して洗練させる。
- Bounded Context を特定し、Actors / Commands / Events / Policies / Aggregates を明確化する。

## 前提

- `docs/project/behavior/01-scenarios.md` が作成されている（`/a-003-create-scenarios` 実行済み）
- `docs/project/domain/` ディレクトリが存在（なければ `/a-001-setup-doc-structure`）
- ドメインエキスパートと協力できる

## 手順

### 1. ディレクトリと前提条件の確認

```bash
ls -la docs/project/domain/ 2>/dev/null || echo "ディレクトリが存在しません"
```

存在しなければ `/a-001-setup-doc-structure` を促す。`docs/project/behavior/01-scenarios.md` を読み込み内容確認。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/03-domain/01-domain-model.md" "docs/project/domain/01-domain-model.md"
cp "$SCRIPT_DIR/templates/project/03-domain/02-ubiquitous-language.md" "docs/project/domain/02-ubiquitous-language.md"
```

### 3. Bounded Context の特定

シナリオとユーザーストーリーから Bounded Context を提案し、戦略的分類（Core / Supporting / Generic）を確認。詳細は [reference/event-storming-guide.md](reference/event-storming-guide.md#bounded-context-の特定) を参照。

### 4. 各 Bounded Context のドメインモデル定義

各 Context について以下を定義し、`01-domain-model.md` を更新。新しい用語が登場するたびに `02-ubiquitous-language.md` にも追記。

- 概要とアクター
- コマンド / イベント / ポリシー（Event Storming）
- 集約 / Read Models / External Systems

各要素の詳細は [reference/event-storming-guide.md](reference/event-storming-guide.md#各-context-の定義項目) を参照。

### 5. ユビキタス言語の洗練

`02-ubiquitous-language.md` を見直し、重複・曖昧さ・禁止用語を排除。観点は [reference/event-storming-guide.md](reference/event-storming-guide.md#ユビキタス言語の洗練観点) を参照。

### 6. Context Map の定義

Context 間の関係性（Customer-Supplier, Shared Kernel 等）を Mermaid 図で定義。関係パターン: [reference/event-storming-guide.md](reference/event-storming-guide.md#context-map-の関係性)

### 7. レビューと確認

作成したドキュメントを提示し、ビジネス用語の正確性 / Aggregate 境界 / ユビキタス言語定義を確認。

### 8. 完了条件と構造の確認

構造確認コマンドは [reference/event-storming-guide.md](reference/event-storming-guide.md#構造確認コマンド) を参照。

チェックリスト:

- [ ] `01-domain-model.md` に主要な Event Storming 要素が含まれている
- [ ] `02-ubiquitous-language.md` の用語が定義されている
- [ ] ドメインモデルとユビキタス言語の整合性が取れている

### 9. Git への追加（オプション）

```bash
git add docs/project/domain/
git status
```

コミットメッセージ: [reference/event-storming-guide.md](reference/event-storming-guide.md#git-コミットメッセージ)

## 完了条件

- `docs/project/domain/01-domain-model.md` と `02-ubiquitous-language.md` が作成されている
- 各 Bounded Context の主要ドメイン要素（Aggregates, Commands, Events）が定義されている
- ドメインモデルで使用される用語がユビキタス言語として定義されている
- ユーザーが内容を承認している

## エスカレーション

- **シナリオが不足**: 「`/a-003-create-scenarios` に戻ってシナリオを充実させましょう。」
- **Bounded Context の境界が不明確**: 「暫定的な境界を設定し、実装を進めながら見直す方針で進めませんか？」

## 参考

- [reference/event-storming-guide.md](reference/event-storming-guide.md) — Event Storming の観点、Context Map パターン、構造確認コマンド
