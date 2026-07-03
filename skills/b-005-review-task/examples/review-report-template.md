# レビューレポート詳細テンプレート

SKILL.md 手順5「レポート作成」で利用する詳細版テンプレート。簡易版は SKILL.md 本体にある。

## 詳細テンプレート

```markdown
# タスクレビュー結果: task{ID}-{SLUG}

**実施日**: YYYY-MM-DD

## 前提整合性（doctor links）

| 項目 | 判定 | 根拠（file:line） |
|:--|:--:|:--|
| docs/tasks 内リンク | PASS | 該当ファイルへのリンク切れなし（`yodogawa doctor --json` の `links` finding に該当なし） |

## 判定

- 実装開始可否: FAIL

## 詳細（観点別 PASS/FAIL）

| # | 観点 | 判定 | 根拠（file:line） | コメント |
|--:|:--|:--:|:--|:--|
|1|定義 ↔ 実装（変更内容）| FAIL | `docs/tasks/task000003-auth-login/a-definition.md:22`: 「POST /api/verify」 | 対応する実装ステップが c-implementation.md に無い |
|2|定義 ↔ 実装（ユーザーストーリー）| PASS | `docs/tasks/task000003-auth-login/c-implementation.md:10`: 「Step2: ログイン画面実装」 | 全USに対応ステップあり |
|3|定義 ↔ 実装（受け入れ基準）| PASS | `docs/tasks/task000003-auth-login/a-definition.md:40`: 「- [ ] 3回失敗でロック」 | 対応ステップで実現される |
|4|リサーチ ↔ 実装| FAIL | `docs/tasks/task000003-auth-login/b-research.md:18`: 「メール送信遅延リスク」 | 対策がc-implementation.mdに見当たらない |
|5|実装計画の完全性| PASS | `docs/tasks/task000003-auth-login/c-implementation.md:5`: 「Phase1完了条件: ...」 | フェーズ完了条件明記 |
|6|タスク全体の実現性| PASS | `docs/tasks/task000003-auth-login/a-definition.md:5`: 「目的: ログイン簡素化」 | 実装計画と整合 |

## 修正が必要な項目

1. **APIエンドポイント漏れ**: `POST /api/verify` の実装ステップを `c-implementation.md` に追加する。
2. **リスク対策未反映**: メール送信を非同期キュー化する設計を計画に追加する。

## 所見

### 強み
（このタスクドキュメントの優れている点）

### 改善点
（改善すべき点、懸念事項）

### 推奨事項
（実装開始前に対応すべき事項）

## 備考

（追加のコメント、質問事項など）
```
