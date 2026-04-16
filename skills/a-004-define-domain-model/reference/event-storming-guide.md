# Event Storming ガイド

SKILL.md 手順3〜6で使うドメインモデル定義の観点集。

## Bounded Context の特定

シナリオとユーザーストーリーを分析し、ビジネス領域を特定。

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

```bash
grep "Bounded Context:" docs/project/domain/01-domain-model.md \
  && echo "OK" || echo "MISSING: Bounded Context definition"
grep "### Aggregates" docs/project/domain/01-domain-model.md \
  && echo "OK" || echo "MISSING: Aggregates section"
grep "| 用語 | 定義 |" docs/project/domain/02-ubiquitous-language.md \
  && echo "OK" || echo "MISSING: Terminology table"
```

## Git コミットメッセージ

```
docs: ドメインモデルとユビキタス言語の定義

- Event Stormingによるドメインモデルの作成
- Bounded Contextごとのユビキタス言語の整備
```
