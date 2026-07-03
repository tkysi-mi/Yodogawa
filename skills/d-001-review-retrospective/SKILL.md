---
name: d-001-review-retrospective
description: A〜Cシリーズ（または1タスク分のb/cサイクル）完了後、成果物ドキュメント（振り返り・ベストプラクティス・レビューレポート）から摩擦点を収集し、対象SKILL.mdへの修正案をdiff形式で提示、docs/LESSONS.mdに汎用的な学びを記録する。A〜Cシリーズ完了後の振り返りタイミングで使用。
disable-model-invocation: true
argument-hint: "[task-id ...]"
context: fork
allowed-tools: Read, Grep, Glob, Write, Bash
---

# ReviewRetrospective (d-001)

## 目的

- A〜Cシリーズ（または1タスク分のb/cサイクル）の実行経験から摩擦点（詰まった・脱線した・手戻りした箇所）を成果物ドキュメントから収集する。
- 摩擦点をスキル・手順単位にマッピングし、対象 SKILL.md への具体的な修正案を diff 形式で提示する（適用はユーザー承認制。SKILL.md自体は編集しない）。
- 汎用的な学びを `docs/LESSONS.md` に追記し、次のタスクのリサーチ（`b-003`）が参照できるようにする。

## 前提

- 対象タスクの成果物ドキュメント（`a-definition.md` / `b-research.md` / `c-implementation.md`）が `docs/tasks/task{ID}-{SLUG}/` に存在すること。特に `c-implementation.md` の `## 振り返り` セクションが記入済みであること。
- `b-005-review-task` を実施済みなら `docs/tasks/task{ID}-{SLUG}/TASK-REVIEW-REPORT.md` も入力として使う（無ければスキップ）。
- 修正案の永続化先: `docs/tasks/task{ID}-{SLUG}/RETROSPECTIVE-REPORT.md`
- 汎用的な学びの蓄積先: `docs/LESSONS.md`（無ければこのスキルが `../../templates/LESSONS.md` から新規作成——スキル配置ディレクトリ起点の相対参照）
- **注記**: `docs/LESSONS.md` は意図的に `docs/project/` の外に置く。`yodogawa doctor` の `id-trace`/`placeholder` は `docs/project/` 配下を無条件に走査し、`US-`/`FN-` 等のID風文字列を trace 切れとして誤検知しうるため（過去タスクで言及したIDが後日リナンバー・削除されると発生する）。

## 手順

`$ARGUMENTS` に1つ以上の `task{ID}-{SLUG}` があればそれを対象にする。未指定ならユーザーに対象範囲（直近のA〜Cシリーズ全体 or 特定タスク群）を確認する。

### 1. 対象タスクの成果物収集

対象タスクごとに:

```bash
ls -d docs/tasks/task*
```

- `c-implementation.md` の `## 振り返り` セクション（うまくいったこと／改善すべきこと／次のタスクへのフィードバック）を Read。
- `b-research.md` の `## 実装時に発見したベストプラクティス` `## 技術的リスクの結果` を Read。
- `TASK-REVIEW-REPORT.md` があれば `## 所見` の改善点・推奨事項を Read。

未記入・未存在なら該当タスクをスキップし、理由を記録する。

### 2. 摩擦点の抽出とスキル・手順へのマッピング

収集した記述から摩擦点候補を洗い出し、原因となったスキル・手順を Read/Grep で特定する（例:「b-003の手順4で外部調査に時間がかかった」→ `skills/b-003-create-task-research/SKILL.md` の該当手順）。
分類基準・マッピング方法の詳細は [reference/friction-point-mapping.md](reference/friction-point-mapping.md) を参照。

### 3. 対象 SKILL.md への修正案の作成

対象 SKILL.md を Read し、摩擦点を解消する具体的な修正案を diff 形式（`-`/`+` 行）で作成する。**SKILL.mdファイル自体は編集しない**（Writeツールはこの手順では使わない。適用要否はユーザーが判断する）。

### 4. レポート作成

`docs/tasks/task{ID}-{SLUG}/RETROSPECTIVE-REPORT.md` に摩擦点一覧・SKILL.md修正案（diff）を記入する（詳細版テンプレートは [examples/retrospective-report-template.md](examples/retrospective-report-template.md) を参照）。複数タスクを対象にした場合は1レポートに集約する。

### 5. LESSONS.md への記録

個別スキルへの修正提案にとどまらない汎用的な学び（複数スキルに共通するパターン、プロジェクト固有の注意点等）を抽出する。
`docs/LESSONS.md` を Read し、同一 task-id の見出し（`### YYYY-MM-DD — task{ID}: ...`）が既に無いか Grep で確認する。既にあればスキップして重複を報告する。無ければ末尾に新規エントリを追記する（Write）。

### 6. レポート出力

チャットに以下を出力する:

- 摩擦点一覧（タスクID・該当スキル・根拠file:line）
- 対象SKILL.mdごとの修正案（diff形式。手順4で保存したレポートへのパスも明記）
- LESSONS.mdへの追記内容のサマリ（スキップした場合はその旨）

### 7. Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/RETROSPECTIVE-REPORT.md docs/LESSONS.md
git commit -m "docs(retrospective): 振り返りレポート作成 task{ID}"
```

## 完了条件

- 対象タスクの成果物ドキュメントを全て読み込んでいる（未記入タスクはスキップ理由を記録）。
- 摩擦点ごとに file:line の根拠付きで SKILL.md 修正案（diff形式）が提示されている（チャット＋`RETROSPECTIVE-REPORT.md`）。
- `docs/LESSONS.md` への追記が完了している（新規作成含む。重複時はスキップ）。
- **SKILL.md自体は書き換えられていない**（提示のみ）。

## エスカレーション

- **成果物ドキュメントが不十分**: 「振り返りセクションが記入されていません。`c-002-update-documentation` で振り返りを記入してから再実行してください。」
- **摩擦点が見つからない**: 「今回の対象タスクでは明確な摩擦点が見つかりませんでした。」と報告して終了する（無理に指摘を作らない）。
- **修正案が複数スキルにまたがる／大規模**: 優先度（頻度・影響度）を付けて提示し、一度に大量の変更を提案しない。

## 参考

- [reference/friction-point-mapping.md](reference/friction-point-mapping.md) — 摩擦点の分類基準・スキル手順へのマッピング方法
- [examples/retrospective-report-template.md](examples/retrospective-report-template.md) — RETROSPECTIVE-REPORT.md詳細テンプレート
