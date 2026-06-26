# Event Storming ガイド

ドメイン概念抽出の観点集。a-004（Domain Sketch）の手順3・4 では主要概念・境界・中核エンティティ・重要ルールの抽出に使う。

> 以下の **Bounded Context / コマンドとイベント / 集約とモデル / Context Map の関係性** は完全な Event Storming の観点であり、標準フローでは必須ではない。複雑ドメインで Full DDD が必要なときに、任意スキル `/a-005-create-domain-diagram`（advanced）と `01-domain-model.md` で用いる。a-004 の Domain Sketch では、これらを軽量に（中核エンティティ・境界の把握に必要な範囲で）参照する。

## Bounded Context の特定

Core Scenarios と MVP Scope を分析し、ビジネス領域を特定。

- **戦略的分類**:
  - **Core**: ビジネスの中核的な競争優位を生む領域
  - **Supporting**: Core を支援する領域
  - **Generic**: 汎用的に解決できる領域（既製ソリューション候補）

## 各 Context の定義項目

### 概要とアクター

- Context の責務と主要な責任
- 登場するアクター（Actors）とその役割

### コマンドとイベント（Event Storming）

- **Commands**: アクターが実行するアクション（命令形、例: `RegisterUser`）
- **Domain Events**: 結果として発生するビジネス上の出来事（過去形、例: `UserRegistered`）
- **Policies**: 自動化ルール（`Whenever X, then Y` 形式）

### 集約とモデル

- **Aggregates**: 一貫性を保つエンティティの塊
- **Read Models**: 画面表示用の参照モデル
- **External Systems**: 連携する外部システム

## ユビキタス言語の洗練観点

- 用語の重複や曖昧さがないか
- 禁止用語（`Data`, `Process` など曖昧な語）が含まれていないか
- 定義が具体的で Context 内での意味に限定されているか

## Context Map の関係性

- **Customer-Supplier**: 上流/下流の依存関係
- **Shared Kernel**: 共有される小さなモデル
- **Anticorruption Layer**: 外部モデルの変換層
- **Conformist**: 上流に従う
- **Partnership**: 相互協調

## レビュー観点

- ビジネス用語は正確に表現されているか
- Aggregate の境界は適切か
- ユビキタス言語の定義は明確か

## 構造確認コマンド

標準フロー（Domain Sketch）:

```bash
grep "## 中核エンティティと責務" docs/project/03-domain/01-domain-sketch.md \
  && echo "OK" || echo "MISSING: 中核エンティティ"
grep "## 重要なビジネスルール" docs/project/03-domain/01-domain-sketch.md \
  && echo "OK" || echo "MISSING: 重要なビジネスルール"
grep "| 用語 | 定義 |" docs/project/03-domain/02-ubiquitous-language.md \
  && echo "OK" || echo "MISSING: Terminology table"
```

advanced（Full Event Storming / a-005 実行時の `01-domain-model.md`）:

```bash
grep "Bounded Context:" docs/project/03-domain/01-domain-model.md \
  && echo "OK" || echo "MISSING: Bounded Context definition"
grep "### Aggregates" docs/project/03-domain/01-domain-model.md \
  && echo "OK" || echo "MISSING: Aggregates section"
```

## Git コミットメッセージ

```
docs: Domain Sketch とユビキタス言語の定義

- Core Scenarios からの主要概念・境界・中核エンティティの整理
- ユビキタス言語の整備
```
