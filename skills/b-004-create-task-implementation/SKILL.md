---
name: b-004-create-task-implementation
description: タスクの実装計画を段階的に分割し、ステップごとの成果物と受け入れ基準を定義するワークフロー
---

# CreateTaskImplementation (b-004)

## 目的

- タスクを実行可能なフェーズとステップに分割し、作業順序と依存関係を明確にする。
- 各ステップの成果物と受け入れ基準を定義し、作業完了の判断基準を共有する。
- 実装開始前にテスト計画や懸念点を洗い出し、品質リスクを低減する。

## 前提

- `a-definition.md`（b-002）と `b-research.md`（b-003）が作成済みであること。
- タスクディレクトリ: `docs/tasks/task{ID}-{SLUG}/`
- テンプレート: `{IDE_DIR}/templates/tasks/task-template/c-implementation.md`

## 手順

### 1. ドキュメント確認とテンプレート準備

```bash
ls -d docs/tasks/task*
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/tasks/task-template/c-implementation.md" \
   "docs/tasks/task{ID}-{SLUG}/c-implementation.md"
```

- `a-definition.md` から目的・変更内容・受け入れ基準を読み取る。
- `b-research.md` から技術方針・ライブラリ選定・リスクを把握する。

### 2. フェーズ設計

- タスクを 2〜4 フェーズに分割し、各フェーズのゴールと依存関係を整理。
- 目安: 1フェーズ = 1〜3日で完了できる規模。
- 例: 「データモデル/マイグレーション」「API 実装」「フロントエンド」「統合テスト」

### 3. ステップ分解

- 各フェーズを 1〜3時間で完了できるステップに分割。
- ステップごとに以下を定義:
  - **Title**: 作業名
  - **Details**: 実装内容・注意点（ファイル名・関数名・ライブラリなど）
  - **Deliverables**: 成果物（PR/コミット/ファイル）
  - **Verification**: 実装完了の確認方法（テストコマンド、ブラウザチェック等）

### 4. テスト計画

- フェーズ／ステップ単位で必要なテストを記載。
  - ユニットテスト、API テスト、UI テスト、E2E テスト、負荷テストなど。
- カバレッジ目標や検証手順（`npm test`, `pnpm vitest`, `playwright test` 等）を明示。

### 5. ドキュメント反映

- `docs/tasks/task{ID}-{SLUG}/c-implementation.md` に以下を記入:
  1. フェーズ一覧（目的、完了条件、依存関係）
  2. フェーズ内ステップ（Title/Details/Deliverables/Verification）
  3. テスト計画
  4. メモ・補足（懸念点、要確認事項、リファクタ案など）
- HTMLコメントは削除せずガイドとして残す。

### 6. 構造チェック

```bash
grep "## 実装フェーズ" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
 && grep "## ステップ一覧" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
 && grep "## テスト計画" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
 && echo "OK" || echo "MISSING SECTION"
```

チェックリスト:

- [ ] すべてのフェーズに目的・完了条件・依存関係が記載されている
- [ ] 各ステップに成果物と検証方法がある
- [ ] テスト計画が網羅的に記載されている
- [ ] 懸念点や未決事項がメモ欄に整理されている

### 7. Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/c-implementation.md
git commit -m "docs(task): 実装計画の作成 task{ID}"
```

## 完了条件

- `c-implementation.md` にフェーズ／ステップ／テスト／メモが記載されている。
- ステップの粒度が適切（1〜3時間）で、成果物が明確。
- フェーズ順序と依存関係が示されている。
- 関係者レビューで疑問がない状態になっている。

## エスカレーション

- **フェーズが大きすぎる**: 「1フェーズが 3日以上になりそうです。分割してください。」
- **ステップが抽象的**: 「成果物が特定できません。ファイル名や検証手順を明記してください。」
- **テスト計画不足**: 「対象機能のテスト戦略が不足しています。ユニット/統合/E2E を再検討してください。」
- **リスク対策未反映**: 「b-003 で挙げたリスクへの対策ステップがありません。計画に組み込んでください。」
- **依存関係不明**: 「並行実行可能なフェーズと、順序が必要なフェーズを明示してください。」
