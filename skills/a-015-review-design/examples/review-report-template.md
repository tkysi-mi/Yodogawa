# 設計レビュー結果レポートテンプレート

SKILL.md 手順3 で作成する `docs/project/DESIGN-REVIEW-REPORT-*.md` のフォーマット例。

## レポートフォーマット

```markdown
# 設計ドキュメント一貫性レビュー結果

**実施日**: YYYY-MM-DD
**doctor**: `structure` 検査（04-design配下の存在確認）と `placeholder` 検査（2.6 の `[Owner名]` 残置検出）を利用。`id-trace` は 04-design 非対応のため 2.1〜2.5 はすべてRead手動確認。

## サマリー

- 観点別判定: PASS 4 / FAIL 2（全6観点）
- 総合: FAIL（FAIL観点: 2.2, 2.4）

## 詳細（観点別 PASS/FAIL）

| 観点 | 判定 | 根拠（file:line） | コメント |
|:--|:--:|:--|:--|
| 2.1 テックスタック ↔ アーキテクチャ | PASS | `docs/project/04-design/07-architecture.md:14`: 「PostgreSQL, Redis」 | tech-stackの選定技術がarchitecture図に反映（Read手動確認） |
| 2.2 データモデル ↔ ドメインモデル | FAIL | `docs/project/03-domain/01-domain-sketch.md:20`: 「中核エンティティ: Order」 | Aggregate「Order」に対応するテーブル定義が `05-data-model.md` に無い |
| 2.3 API仕様 ↔ データモデル | PASS | `docs/project/04-design/06-api-spec.md:33`: 「user_rank」 | データモデルの派生フィールドとして明示あり |
| 2.4 画面設計 ↔ API仕様 | FAIL | `docs/project/04-design/03-screen-design.md:41`: 「注文履歴画面」 | `GET /api/orders/history` が定義されていない |
| 2.5 インフラ ↔ アーキテクチャ | PASS | `docs/project/04-design/08-infrastructure.md:10`: 「Multi-AZ構成」 | 可用性要件を満たす |
| 2.6 ドキュメントメタ情報（Owner/Status） | PASS | `docs/project/04-design/01-tech-stack.md:3`: 「> **Owner**: 田中」 | Owner 記入済み（placeholder finding なし）。Status はフェーズと整合。ヘッダ未導入の旧ドキュメントなし |

## 推奨アクション

1. `/a-011-define-data-model` で `orders` テーブルを定義する。
2. `/a-012-define-api-spec` で `GET /api/orders/history` を追加する。
```

## 判定ルールの使い方

| 判定 | 意味 | 根拠列の要件 |
|:--|:--|:--|
| PASS | 観点内に Error 相当の指摘が無い | Warning相当の注記があれば file:line 付きでコメント欄に残す（消さない） |
| FAIL | 観点内に Error 相当の指摘が1件以上 | 根拠列に file:line と該当行の引用が1件以上必須 |

観点 2.1〜2.5 は doctor 非対応のため、判定は必ずRead/Grepによる手動確認＋file:line引用で行う（2.6 のみ doctor の placeholder 検出を補助に使える。[reference/consistency-checks.md](../reference/consistency-checks.md)参照）。

## コミットメッセージ例

```text
docs: 設計整合性レビューレポートの作成
```
