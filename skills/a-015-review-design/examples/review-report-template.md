# 設計レビュー結果レポートテンプレート

SKILL.md 手順3 で作成する `docs/project/DESIGN-REVIEW-REPORT-*.md` のフォーマット例。

## レポートフォーマット

```markdown
# 設計ドキュメント一貫性レビュー結果

**実施日**: YYYY-MM-DD

## サマリー

- OK: X 項目
- Warning: X 項目
- Error: X 項目

## 詳細

### 1. テックスタック ↔ アーキテクチャ

- OK: 選定技術はアーキテクチャパターンに適合しています。

### 2. データモデル ↔ ドメインモデル

- **Error**: Aggregate「Order」に対応するテーブル定義が見つかりません。

### 3. API 仕様 ↔ データモデル

- **Warning**: API レスポンスのフィールド `user_rank` がデータモデルにありません。

### 4. 画面設計 ↔ API 仕様

- **Error**: 「注文履歴画面」に必要な `GET /api/orders/history` が定義されていません。

### 5. インフラ ↔ アーキテクチャ

- OK: 冗長化構成はアーキテクチャの可用性要件を満たしています。

## 推奨アクション

1. `/a-011-define-data-model` で `orders` テーブルを定義する。
2. `/a-012-define-api-spec` で `GET /api/orders/history` を追加する。
3. `/a-011-define-data-model` で `user_rank` のカラム追加を検討する。
```

## 重大度記号の使い方

| 記号 | 意味 | 対応 |
|:--|:--|:--|
| OK | 問題なし | 記録のみ |
| Warning | 軽微な不整合 | 計画的に修正 |
| Error | 重大な不整合 | タスク分解前に必ず修正 |

## コミットメッセージ例

```text
docs: 設計整合性レビューレポートの作成
```
