---
name: b-004-create-task-implementation
description: タスクをステップ単位に分割し、各ステップの成果物・受け入れ基準を c-implementation.md に定義する。リサーチ完了後、実装着手前に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "[task-id]"
---

# CreateTaskImplementation (b-004)

## 目的

- タスクを実行可能なフェーズとステップに分割し、作業順序と依存関係を明確にする。
- 各ステップの成果物と受け入れ基準を定義し、作業完了の判断基準を共有する。
- 実装開始前にテスト計画や懸念点を洗い出し、品質リスクを低減する。

## 前提

- `a-definition.md`（b-002）と `b-research.md`（b-003）が作成済み
- タスクディレクトリ: `docs/tasks/task{ID}-{SLUG}/`
- テンプレート: `{IDE_DIR}/templates/tasks/task-template/c-implementation.md`

## 手順

`$ARGUMENTS` が指定されている場合は `task{ID}-{SLUG}`（例: `task000003-auth-login`）として使用する。未指定の場合はユーザーに対象タスクを確認する。

### 1. ドキュメント確認とテンプレート準備

```bash
ls -d docs/tasks/task*
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/tasks/task-template/c-implementation.md" \
   "docs/tasks/task{ID}-{SLUG}/c-implementation.md"
```

`a-definition.md` から目的・変更内容・受け入れ基準を、`b-research.md` から技術方針・ライブラリ選定・リスクを読み取る。

### 2. フェーズ設計

タスクを 2〜4 フェーズに分割（1 フェーズ = 1〜3 日規模）。分割の考え方と例は [examples/phase-step-template.md](examples/phase-step-template.md#フェーズ分割の目安) を参照。

### 3. ステップ分解

各フェーズを 1〜3 時間で完了できるステップに分割し、Title / Details / Deliverables / Verification を定義。記載例は [examples/phase-step-template.md](examples/phase-step-template.md#ステップ分解のテンプレート) を参照。

### 4. テスト計画

フェーズ／ステップ単位で必要なテスト（ユニット、API、UI、E2E、負荷）とカバレッジ目標、検証コマンド（`npm test`, `playwright test` 等）を記載。例は [examples/phase-step-template.md](examples/phase-step-template.md#テスト計画の記載例) を参照。

### 5. ドキュメント反映

`docs/tasks/task{ID}-{SLUG}/c-implementation.md` に以下を記入:

1. フェーズ一覧（目的、完了条件、依存関係）
2. フェーズ内ステップ（Title/Details/Deliverables/Verification）
3. テスト計画
4. メモ・補足（懸念点、要確認事項、リファクタ案）

HTML コメントは削除せずガイドとして残す。

### 6. 構造チェック

```bash
grep "## 実装フェーズ" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
  && grep "## ステップ一覧" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
  && grep "## テスト計画" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
  && echo "OK" || echo "MISSING SECTION"
```

チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/c-implementation.md
git commit -m "docs(task): 実装計画の作成 task{ID}"
```

## 完了条件

- `c-implementation.md` にフェーズ／ステップ／テスト／メモが記載されている
- ステップの粒度が適切（1〜3 時間）で、成果物が明確
- フェーズ順序と依存関係が示されている
- 関係者レビューで疑問がない状態

## エスカレーション

- **フェーズが大きすぎる**: 「1 フェーズが 3 日以上になりそうです。分割してください。」
- **ステップが抽象的**: 「成果物が特定できません。ファイル名や検証手順を明記してください。」
- **テスト計画不足**: 「対象機能のテスト戦略が不足しています。ユニット/統合/E2E を再検討してください。」
- **リスク対策未反映**: 「b-003 で挙げたリスクへの対策ステップがありません。計画に組み込んでください。」
- **依存関係不明**: 「並行実行可能なフェーズと、順序が必要なフェーズを明示してください。」

## 参考

- [examples/phase-step-template.md](examples/phase-step-template.md) — フェーズ分割、ステップ分解、テスト計画の記載例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー観点
