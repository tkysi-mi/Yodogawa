---
name: b-005-review-task
description: タスクの定義・リサーチ・実装計画ドキュメント間の一貫性をレビューし、不整合や抜け漏れを検出する。タスク実装に着手する前の最終確認として使用。
disable-model-invocation: true
---

# ReviewTask (b-005)

## 目的

- `a-definition.md` / `b-research.md` / `c-implementation.md` の整合性を確認し、実装前にリスクを洗い出す。
- ユーザーストーリーや受け入れ基準が実装計画に反映されているかを検証する。
- レビュー結果をレポート化し、修正アクションと実装可否を明確にする。

## 前提

- `docs/tasks/task{ID}-{SLUG}/` が存在し、a/b/c 各ドキュメントが作成済み。
- レビュー結果を記録するレポート: `docs/tasks/task{ID}-{SLUG}/TASK-REVIEW-REPORT.md`

## 手順

### 1. 対象タスクの確認

```bash
ls -d docs/tasks/task*
```

- レビュー対象のタスクIDとスラッグを特定。
- 不足ドキュメントがあれば該当スキル(b-002/b-003/b-004)に差し戻す。

### 2. 各ドキュメントの読み込み

- `a-definition.md`: 目的/ユーザーストーリー/変更内容/受け入れ基準
- `b-research.md`: ベストプラクティス/再利用コード/技術選定/リスク
- `c-implementation.md`: フェーズ/ステップ/成果物/テスト計画

### 3. 一貫性チェック

| # | 観点 | チェック内容 |
|---|------|--------------|
|1|定義 ↔ 実装（変更内容）|全ての変更点に対応するステップあるか／スコープ外作業がないか|
|2|定義 ↔ 実装（ユーザーストーリー）|各ユーザーストーリーを満たすステップが存在するか|
|3|定義 ↔ 実装（受け入れ基準）|ステップ完了で受け入れ基準を満たせるか／基準が具体的か|
|4|リサーチ ↔ 実装|選定した技術/リスク対策が計画に反映されているか|
|5|実装計画の完全性|フェーズ順序・ステップ粒度・テスト計画が適切か|
|6|タスク全体の実現性|目的/スコープ/依存関係/期間が妥当か|

チェックの際は `OK / Warning / Error` を付与し、根拠をメモする。

各観点のチェックリスト・検出すべき問題パターンは [reference/consistency-checks.md](reference/consistency-checks.md) を参照。

### 4. レポート作成

`docs/tasks/task{ID}-{SLUG}/TASK-REVIEW-REPORT.md` に以下を記入（詳細版テンプレートは [examples/review-report-template.md](examples/review-report-template.md) を参照）：

```markdown
# タスクレビュー結果: task{ID}-{SLUG}
**実施日**: YYYY-MM-DD

## 判定
- 総合評価: [OK / Conditional OK / NG]
- 実装開始可否: [可 / 要修正]

## 詳細
- 定義 ↔ 実装（変更内容）: [OK/Warn/Error] – コメント
- 定義 ↔ 実装（ユーザーストーリー）: ...
- リサーチ ↔ 実装: ...
- 実装計画の完全性: ...
- タスク全体の実現性: ...

## 修正が必要な項目
1. **カテゴリ**: ...
   - 詳細 / 推奨対応 / 影響

## 所見
- 強み:
- 改善点:
- 推奨事項:
```

### 5. 実装開始可否の判定とユーザー報告

- 総合評価（優/良/可/不可）と実装可否をレポートに明記する。
- ユーザーに Error 件数・Warning 件数・総合評価を報告し、次のアクションを案内する。
- 判定基準・修正ガイダンス・ベストプラクティスは [reference/assessment-criteria.md](reference/assessment-criteria.md) を参照。

### 6. Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/TASK-REVIEW-REPORT.md
git commit -m "docs(task): レビューレポート作成 task{ID}"
```

## 完了条件

- 全観点に対して判定とコメントが記載されている。
- 修正事項がカテゴリ別・優先度付きで整理されている。
- 実装可否が明記され、関係者に共有済み。

## エスカレーション

- **Error 多発**: 「致命的な不整合が複数あります。タスクドキュメント全体の再検討が必要です。」
- **目的未達**: 「現在の実装計画では目的を達成できません。定義や計画を更新してください。」
- **リスク未対策**: 「リサーチで検出されたリスクが計画に反映されていません。対策を追加してください。」
- **テスト不足**: 「テスト計画が不十分です。ユニット/統合/E2Eを補完してください。」
- **スコープ過大**: 「フェーズ/ステップ数が多すぎます。タスク分割を検討してください。」

## 参考

- [reference/consistency-checks.md](reference/consistency-checks.md) — 一貫性チェックの詳細項目
- [reference/assessment-criteria.md](reference/assessment-criteria.md) — 評価基準・修正ガイダンス・ベストプラクティス・タスクライフサイクル
- [examples/review-report-template.md](examples/review-report-template.md) — 詳細レポートテンプレート
