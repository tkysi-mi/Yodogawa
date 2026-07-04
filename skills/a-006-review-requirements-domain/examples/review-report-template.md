# レビュー結果レポートテンプレート

SKILL.md 手順4 で作成する `docs/project/REVIEW-REPORT-*.md` のフォーマット例。

## レポートフォーマット

```markdown
# ドキュメント一貫性レビュー結果

**実施日**: YYYY-MM-DD
**doctor**: `yodogawa doctor --json` 実行結果 summary = errors: 2, warnings: 3

## サマリー

- 観点別判定: PASS 7 / FAIL 1（全8観点）
- PM Gate 判定: Go with caveats

## 詳細（観点別 PASS/FAIL）

| 観点 | 判定 | 根拠（file:line） | コメント |
|:--|:--:|:--|:--|
| 2.1 ユーザーストーリー ↔ シナリオ | FAIL | `docs/project/01-requirements/05-user-stories.md:18`: 「ペルソナ: P-999」 | US-005 が参照する P-999 が product-brief 未定義（doctor id-trace error）。逆方向coverage・「価値」↔「Then」整合は未確認（doctor非対応部分） |
| 2.2 MVP スコープ ↔ シナリオ | PASS | `docs/project/02-behavior/01-core-scenarios.md:40`: 「## CS-003 決済」 | 全 Must がシナリオでカバー済み（doctor id-trace: FN未参照Warningなし） |
| 2.3 クリティカル制約 ↔ スコープ/ドメイン | PASS | `docs/project/01-requirements/01-product-brief.md:23`: 「社内SSO必須」 | MVP Scope・ドメインに反映確認済み（Read手動確認、doctor非対応） |
| 2.4 Core Scenario ↔ Domain Sketch | PASS | `docs/project/02-behavior/01-core-scenarios.md:52`: 「在庫を引き当てる」 | Domain Sketch の重要ビジネスルールに対応記述あり（Read手動確認、doctor非対応） |
| 2.5 ユビキタス言語 | PASS | `docs/project/03-domain/02-ubiquitous-language.md:9`: 「ShippingAddress」 | 用語登録済み。禁止用語なし（Read手動確認、doctor非対応） |
| 2.6 目的との整合性 | PASS | `docs/project/01-requirements/01-product-brief.md:30`: 「North Star: 週次アクティブ率」 | 価値提案と成功指標は整合（Read手動確認、doctor非対応） |
| 2.7 MVP正当化/過剰作り込み | PASS | `docs/project/01-requirements/02-mvp-scope.md:15`: 「実績バッジ→Not Now」 | 全MustがProduct Briefの課題/指標/仮説にtrace済み（Read手動確認）。注記(Warning): 孤児ペルソナ `01-product-brief.md:8` P-004 が `05-user-stories.md` から未参照（doctor id-trace warning）。過剰ペルソナの可能性、次回改訂で確認 |
| 2.8 ドキュメントメタ情報（Owner/Status） | PASS | `docs/project/01-requirements/01-product-brief.md:3`: 「> **Owner**: 田中」 | Owner 記入済み（placeholder finding なし）。Status はフェーズと整合。ヘッダ未導入の旧ドキュメントなし |

## PM Gate 判定

観点別 PASS/FAIL 表から次の規則で導出する（恣意的な総合判断をしない）。

- クリティカル観点（2.3/2.4/2.7）はすべて PASS
- FAIL は 2.1（非クリティカル）の1件のみ → 「Go with caveats」の条件（FAIL1〜2件、すべて非クリティカル）に合致

**判定**: Go with caveats

**根拠**: FAIL = 2.1（1件、非クリティカル）。クリティカル観点（2.3/2.4/2.7）はすべて PASS。

**caveat**:
1. 2.1: US-005 のペルソナ参照修正を条件に着手可

## 推奨アクション

1. `docs/project/01-requirements/05-user-stories.md` の US-005 ペルソナ参照を修正する。
2. （Warning注記）孤児ペルソナ P-004 がスコープ漏れか過剰ペルソナか、次回改訂で確認する。
```

## 判定ルールの使い方

| 判定 | 意味 | 根拠列の要件 |
|:--|:--|:--|
| PASS | 観点内に Error 相当の指摘が無い | Warning相当の注記があれば file:line 付きでコメント欄に残す（消さない） |
| FAIL | 観点内に Error 相当の指摘が1件以上 | 根拠列に file:line と該当行の引用が1件以上必須 |

doctor findingsを転記する場合も、`message`をそのままコピペせず、file:lineをReadで開いて実際の行を引用する（詳細は[reference/consistency-checks.md](../reference/consistency-checks.md#doctor-findings-の観点マッピング)）。

## PM Gate 判定の使い方

観点別 PASS/FAIL 表からの機械的導出規則（SKILL.md 手順3参照）:

| 判定 | 導出条件 | 次のアクション |
|:--|:--|:--|
| Go | 全観点 PASS | `AI_CONTEXT.md` を実装エージェントへ渡す |
| Go with caveats | FAILが1〜2件、すべて非クリティカル観点（2.1/2.2/2.5/2.6/2.8） | caveat を明記し、合意の上で着手 |
| No-Go | クリティカル観点（2.3/2.4/2.7）がFAIL、またはFAIL総数3以上 | 実装前に該当ドキュメントを修正し再レビュー |

## コミットメッセージ例

```text
docs: 要件・ドメイン整合性レビューレポートの作成
```
