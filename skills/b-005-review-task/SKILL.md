---
name: b-005-review-task
description: タスクの定義・リサーチ・実装計画ドキュメント間の一貫性をレビューし、不整合や抜け漏れを検出する。タスク実装に着手する前の最終確認として使用。
disable-model-invocation: true
argument-hint: "[task-id]"
context: fork
allowed-tools: Read, Grep, Glob, Write, Bash
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

`$ARGUMENTS` が指定されている場合は `task{ID}-{SLUG}`（例: `task000003-auth-login`）として使用する。未指定の場合はユーザーに対象タスクを確認する。

### 1. 対象タスクの確認

```bash
ls -d docs/tasks/task*
```

- レビュー対象のタスクIDとスラッグを特定。
- 不足ドキュメントがあれば該当スキル(b-002/b-003/b-004)に差し戻す。
- **注記**: この存在確認は doctor では代替できない。`yodogawa doctor` の `structure`/`id-trace`/`placeholder` は `docs/project/` 固定で `docs/tasks/` を検査対象にしないため、ここは従来どおり `ls`/`Glob` で確認する。

### 2. 前提整合性の自動検査（doctor links のみ）

```bash
npx -y yodogawa doctor --json
```

`findings` のうち `check: "links"` かつ `file` が `docs/tasks/task{ID}-{SLUG}/` で始まる項目のみを確認する（`links` は `docs/` 全体を検査対象にする唯一のチェックのため、docs/tasks 内の相対リンク切れはここで拾える）。**`structure`/`id-trace`/`placeholder` の finding はこのタスクディレクトリに関係しないため無視する。** リンク切れがあれば前提整合性 FAIL としてレポートの「前提整合性」節に記録する（手順4の観点別 PASS/FAIL とは別枠）。doctor が実行できない場合は前提整合性の確認を省略してよい。

### 3. 各ドキュメントの読み込み

- `a-definition.md`: 目的/ユーザーストーリー/変更内容/受け入れ基準
- `b-research.md`: ベストプラクティス/再利用コード/技術選定/リスク
- `c-implementation.md`: フェーズ/ステップ/成果物/テスト計画

### 4. 一貫性チェック（観点別 PASS/FAIL + 根拠引用）

以下の 6 観点は**すべて doctor 非対応**（`structure`/`id-trace`/`placeholder` が `docs/tasks/` を検査対象にしないため）。エージェントが `a-definition.md` / `b-research.md` / `c-implementation.md` を Read して判断し、判定には file:line の引用を必須とする（判定ルール: 観点内に Error 相当の指摘が1件以上あれば FAIL、Warning 相当のみなら PASS+注記）。

> **エージェントの役割範囲**: 手順2の doctor links チェックは出力の解釈と修正提案に限定する（再実装しない）。この手順4の6観点はすべて doctor 非対応の意味判断であり、役割は「読解判断＋証拠引用」である。

| # | 観点 | チェック内容 |
|---|------|--------------|
|1|定義 ↔ 実装（変更内容）|全ての変更点に対応するステップあるか／スコープ外作業がないか|
|2|定義 ↔ 実装（ユーザーストーリー）|各ユーザーストーリーを満たすステップが存在するか|
|3|定義 ↔ 実装（受け入れ基準）|ステップ完了で受け入れ基準を満たせるか／基準が具体的か|
|4|リサーチ ↔ 実装|選定した技術/リスク対策が計画に反映されているか|
|5|実装計画の完全性|フェーズ順序・ステップ粒度・テスト計画が適切か|
|6|タスク全体の実現性|目的/スコープ/依存関係/期間が妥当か|

各観点は **PASS / FAIL** で判定し、根拠（file:line引用）を必ず添える。各観点のチェックリスト・検出すべき問題パターンは [reference/consistency-checks.md](reference/consistency-checks.md) を参照。

### 5. レポート作成

`docs/tasks/task{ID}-{SLUG}/TASK-REVIEW-REPORT.md` に以下を記入（詳細版テンプレートは [examples/review-report-template.md](examples/review-report-template.md) を参照）：

```markdown
# タスクレビュー結果: task{ID}-{SLUG}
**実施日**: YYYY-MM-DD

## 前提整合性（doctor links）
- docs/tasks 内リンク: [PASS/FAIL] – 根拠(file:line)

## 判定
- 実装開始可否: [PASS / FAIL]

## 詳細（観点別 PASS/FAIL）
| # | 観点 | 判定 | 根拠（file:line） | コメント |
|--:|:--|:--:|:--|:--|
|1|定義 ↔ 実装（変更内容）| [PASS/FAIL] | ... | ... |
|2|定義 ↔ 実装（ユーザーストーリー）| ... | ... | ... |
|3|定義 ↔ 実装（受け入れ基準）| ... | ... | ... |
|4|リサーチ ↔ 実装| ... | ... | ... |
|5|実装計画の完全性| ... | ... | ... |
|6|タスク全体の実現性| ... | ... | ... |

## 修正が必要な項目
1. **カテゴリ**: ...
   - 詳細 / 推奨対応 / 影響

## 所見
- 強み:
- 改善点:
- 推奨事項:
```

### 6. 実装開始可否の判定とユーザー報告

- 実装開始可否（PASS/FAIL）をレポートに明記する（全6観点PASSならPASS、1つでもFAILならFAILの単純AND判定）。
- ユーザーに FAILした観点と根拠(file:line)を報告し、次のアクションを案内する。
- 判定基準・修正ガイダンス・ベストプラクティスは [reference/assessment-criteria.md](reference/assessment-criteria.md) を参照。

### 7. Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/TASK-REVIEW-REPORT.md
git commit -m "docs(task): レビューレポート作成 task{ID}"
```

## 完了条件

- 全観点に対して PASS/FAIL 判定と根拠（file:line引用）が記載されている。
- 修正事項がカテゴリ別・優先度付きで整理されている。
- 実装開始可否（PASS/FAIL）が明記され、関係者に共有済み。

## エスカレーション

- **FAILした観点が複数（目安3件以上）**: 「致命的な不整合が複数あります。タスクドキュメント全体の再検討が必要です。」
- **目的未達**: 「現在の実装計画では目的を達成できません。定義や計画を更新してください。」
- **リスク未対策**: 「リサーチで検出されたリスクが計画に反映されていません。対策を追加してください。」
- **テスト不足**: 「テスト計画が不十分です。ユニット/統合/E2Eを補完してください。」
- **スコープ過大**: 「フェーズ/ステップ数が多すぎます。タスク分割を検討してください。」

## 参考

- [reference/consistency-checks.md](reference/consistency-checks.md) — 一貫性チェックの詳細項目（6観点すべてdoctor非対応）
- [reference/assessment-criteria.md](reference/assessment-criteria.md) — PASS/FAIL判定基準・修正ガイダンス・ベストプラクティス・タスクライフサイクル
- [examples/review-report-template.md](examples/review-report-template.md) — 詳細レポートテンプレート
