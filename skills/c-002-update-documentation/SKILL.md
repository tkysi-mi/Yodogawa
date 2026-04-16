---
name: c-002-update-documentation
description: 実装完了後にタスクドキュメント（a-definition / b-research / c-implementation）とプロジェクトドキュメント（要件・ドメイン・API・データモデル等）を実装結果に合わせて更新する。実装完了後、ドキュメントと実コードの整合を取る際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "[task-id]"
---

# UpdateDocumentation (c-002)

## 目的

- 実装完了後にタスクレベルのドキュメント（a-definition.md, b-research.md, c-implementation.md）を実装内容に合わせて更新する。
- プロジェクトレベルのドキュメント（要件・ドメイン・データモデル・API・画面設計等）を実装済み機能に合わせて更新する。
- 計画時と実装時の差異を記録し、次のタスクへのフィードバックとする。
- コードとドキュメントの一貫性を保ち、ドキュメント腐敗を防止する。

## 前提

- `/c-001-ImplementTask` で実装が完了していること
- タスクディレクトリ `docs/tasks/task000001-{スラッグ}/` とタスクドキュメントが存在すること
- 実装タスクリストの全ステップが完了していること
- プロジェクトドキュメント構造（`docs/01-requirements/`, `docs/03-domain/`, `docs/04-design/` など）が存在すること

## 手順

`$ARGUMENTS` が指定されている場合は `task{ID}-{SLUG}`（例: `task000003-auth-login`）として使用する。未指定の場合はユーザーに対象タスクを確認する。

### 1. 実装完了の確認

**タスクID を確認**し、以下を検証：

- [ ] `c-implementation.md` の全ステップが `[x]`
- [ ] 全フェーズの受け入れ基準が満たされている
- [ ] テストが全て通っている
- [ ] PR/MR が作成されている（該当する場合）

未完了なら「タスク {task-id} の実装がまだ完了していません。先に `/c-001-ImplementTask` を実行してください。」と案内する。

### 2. 実装内容の確認

**変更ファイルの特定**:

```bash
git diff main..HEAD --name-only
git log --name-only --oneline main..HEAD
```

確認対象: 新規/変更/削除ファイル、依存関係（package.json 等）、マイグレーション、環境変数。

**計画との差異**:

- 計画通りに実装されたステップ / 変更/追加/スキップしたステップ
- 技術スタック・アーキテクチャ・データモデル・API・画面遷移の変更点

### 3. タスクドキュメントの更新

#### 3.1. `a-definition.md`

- 実装内容・受け入れ基準の更新
- `## 実装時の技術的決定` セクションの追加（必要に応じて）
- `## 実装結果` セクションの追加（実装日、実装者、ブランチ、PR/MR、テスト結果、デプロイ）

記載例: [examples/task-doc-updates.md](examples/task-doc-updates.md)

#### 3.2. `b-research.md`

- 技術選定の更新（計画時と実際の差異、理由）
- `## 実装時に発見したベストプラクティス` の追記
- `## 技術的リスクの結果` の追記（計画時リスクの結果）

#### 3.3. `c-implementation.md`

- 全ステップのチェックボックスが `[x]` か確認
- 各ステップに `**実装メモ**` を追記（必要に応じて）
- 各フェーズに `**実装時間**` を記録
- `## 振り返り` セクション（うまくいったこと／改善すべきこと／次のタスクへのフィードバック）を追加

### 4. プロジェクトドキュメントの更新

実装内容に応じて以下を更新（記載例は [examples/project-doc-updates.md](examples/project-doc-updates.md) を参照）：

**要件** (`docs/01-requirements/`):

- [ ] `02-features-implemented.md`: 実装済み機能リストに追加
- [ ] `03-features-planned.md`: 計画中機能リストから削除
- [ ] `05-user-stories.md`: ユーザーストーリーのステータス更新

**ドメイン** (`docs/03-domain/`):

- [ ] `01-domain-model.md`: エンティティ・値オブジェクトの追加
- [ ] `02-ubiquitous-language.md`: 新しいドメイン用語の追加

**設計** (`docs/04-design/`):

- [ ] `03-screen-design.md`: 新しい画面・UI コンポーネント
- [ ] `04-data-model.md`: 新しいテーブル・カラム
- [ ] `05-api-spec.md`: 新しい API エンドポイント
- [ ] `06-architecture.md`: アーキテクチャ変更

**その他**:

- [ ] `README.md`: セットアップ手順、機能一覧、API ドキュメントリンク
- [ ] `CHANGELOG.md`: 変更履歴
- [ ] `.env.example`: 新しい環境変数

### 5. ドキュメント整合性の検証

- クロスリファレンス確認（要件 ↔ ドメイン ↔ データモデル ↔ API ↔ 実装）
- 用語の一貫性確認（ubiquitous-language.md との整合）
- リンク切れの確認

詳細なチェック項目は [reference/doc-structure-and-checks.md](reference/doc-structure-and-checks.md) を参照。

### 6. Git コミット

```bash
git status
git diff docs/
git add docs/tasks/task{id}-{スラッグ}/ docs/01-requirements/ docs/03-domain/ docs/04-design/
git add README.md CHANGELOG.md .env.example
```

コミットメッセージのテンプレートは [reference/doc-structure-and-checks.md](reference/doc-structure-and-checks.md#コミットメッセージのテンプレート) を参照。

### 7. PR への反映とレビュー依頼

- 既存 PR の場合: `git push origin task/{task-id}-{スラッグ}`
- 未作成の場合: `gh pr create` で作成
- レビュー観点（正確性・完全性・明確性・一貫性・最新性）は [reference/doc-structure-and-checks.md](reference/doc-structure-and-checks.md#ドキュメント品質のレビュー観点) を参照

### 8. 次のタスクへのフィードバック

- `c-implementation.md` の振り返りから共通化候補を特定
- ベストプラクティスを次タスクのリサーチ入力として記録
- 必要に応じてタスクテンプレート (`{IDE_DIR}/templates/tasks/task-template/`) を改善

## 完了条件

- [ ] 実装完了が確認されている
- [ ] タスクドキュメントが更新されている（a-definition / b-research / c-implementation）
- [ ] プロジェクトドキュメントが更新されている（要件・ドメイン・設計・README・CHANGELOG・.env.example）
- [ ] ドキュメント間の整合性が確認されている
- [ ] ドキュメント更新がコミットされている
- [ ] 次のタスクへのフィードバックが記録されている

## エスカレーション

- **実装未完了**: 「タスクの実装がまだ完了していません。先に `/c-001-ImplementTask` を実行してください。」
- **計画との差異が大きい**: 差異の理由と影響範囲を明確化し、関係者に共有。必要ならアーキテクチャレビューを実施。
- **ドキュメント更新が複雑**: 段階的更新を推奨（タスクドキュメント → プロジェクトドキュメント、重要度順）。
- **用語の不一致**: `ubiquitous-language.md` で用語を統一し、既存ドキュメントを一括修正。
- **コードとドキュメントの乖離**: どちらが正しいかを確認し、コードまたはドキュメントを修正。

## 参考

- [examples/task-doc-updates.md](examples/task-doc-updates.md) — a-definition/b-research/c-implementation への追記サンプル
- [examples/project-doc-updates.md](examples/project-doc-updates.md) — features/domain/data/api/screen/README/CHANGELOG/env の更新サンプル
- [reference/doc-structure-and-checks.md](reference/doc-structure-and-checks.md) — 整合性チェック項目、ベストプラクティス、ドキュメント構造、コミットテンプレート
