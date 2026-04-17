---
name: b-002-create-task-definition
description: 対話を通じてタスク定義（目的・変更内容・受け入れ基準）を a-definition.md に記録する。タスクディレクトリ作成後、仕様を確定する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "[task-id]"
---

# CreateTaskDefinition (b-002)

## 目的

- 新しいタスクの背景・目的・スコープを明確化する。
- ユーザーストーリーと変更内容を整理し、後続のリサーチ・実装計画に渡す。
- 測定可能な受け入れ基準を定義し、完了条件を共有する。

## 前提

- `docs/tasks/task{ID}-{SLUG}/` が `/b-001-create-task-directory` で作成済み
- テンプレート: `{IDE_DIR}/templates/tasks/task-template/a-definition.md`
- タスクの概要が関係者と共有済み

## 手順

`$ARGUMENTS` が指定されている場合は `task{ID}-{SLUG}`（例: `task000003-auth-login`）として使用する。未指定の場合はユーザーに対象タスクを確認する。

### 1. タスクディレクトリとテンプレートの確認

対象タスクディレクトリを確認し、テンプレートをコピー。スクリプトが冪等なので、既存ファイルはスキップされる。

```bash
ls -d docs/tasks/task*

SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
bash "$SCRIPT_DIR/scripts/init-task-doc.sh" "docs/tasks/task{ID}-{SLUG}" definition
```

### 2. 目的・背景のヒアリング

現状の課題、困っている人、完了後の価値/KPI を具体的に確認。質問例は [examples/hearing-and-criteria.md](examples/hearing-and-criteria.md#目的背景のヒアリング) を参照。

### 3. ユーザーストーリーの整理

形式「[役割]として、[目的]がしたい。なぜなら[理由]だから」で作成。優先度と関連 ID（US-001 等）を付与。詳細は [examples/hearing-and-criteria.md](examples/hearing-and-criteria.md#ユーザーストーリー) を参照。

### 4. 変更内容の洗い出し

カテゴリ別（画面/UI、API/サービス、データモデル/DB、その他）に列挙。ファイル名・エンドポイント・テーブル名を具体的に記載。カテゴリ詳細: [examples/hearing-and-criteria.md](examples/hearing-and-criteria.md#変更内容のカテゴリ)

### 5. 受け入れ基準の策定

観点: 正常系、異常系・エラー表示、性能・セキュリティ、テスト要件。具体例は [examples/hearing-and-criteria.md](examples/hearing-and-criteria.md#受け入れ基準の観点) を参照。

### 6. ドキュメントへの反映

`docs/tasks/task{ID}-{SLUG}/a-definition.md` に以下を順に埋める:

- 目的・背景
- ユーザーストーリー一覧
- 変更内容一覧
- 受け入れ基準
- メモ/補足情報（関連 Issue・制約等）

HTML コメントは削除せず、テンプレートのガイドとして残す。

### 7. 構造チェック

```bash
grep "## 目的" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && grep "## ユーザーストーリー" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && grep "## 変更内容" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && grep "## 受け入れ基準" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 8. レビューと確認

完成したドキュメントをユーザーに提示し、目的の明確さ・変更内容の網羅性・受け入れ基準の測定可能性を確認。質問例は [reference/structure-check.md](reference/structure-check.md#レビュー確認質問) を参照。

### 9. Git への追加（任意）と次のステップ

```bash
git add docs/tasks/task{ID}-{SLUG}/a-definition.md
git commit -m "docs(task): タスク定義書の作成 task{ID}"
```

次は `/b-003-create-task-research` でリサーチドキュメント作成を提案。

## 完了条件

- `docs/tasks/task{ID}-{SLUG}/a-definition.md` が作成されている
- 以下のセクションがすべて記載:
  - 目的（解決する問題、提供する価値）
  - ユーザーストーリー一覧（最低1個以上）
  - 変更内容一覧（該当カテゴリがすべて含まれる）
  - 受け入れ基準（正常系、異常系、テスト要件）
- 目的が具体的で測定可能、ストーリーは役割/目的/理由形式
- 変更内容が具体的なファイル名・コンポーネント名を含む
- ユーザーが内容を確認し承認している

## エスカレーション

- **タスクの目的が曖昧**: 「具体的な問題と解決後の状態を明確にしてください。」
- **変更内容が不明確**: 「具体的なファイル名・コンポーネント名・カラム名を含めてください。」
- **受け入れ基準が曖昧**: 「テスト可能な基準を定義してください。」（例: 「使いやすい」→「登録完了まで3クリック以内」）
- **ユーザーストーリーが技術的すぎる**: ユーザー視点の価値を記載（例: 「React Hook Form を使用したい」→「入力エラーを即座に確認したい」）
- **スコープが大きすぎる**: 複数タスクへの分割を推奨（1タスクは1〜5日で完了できる粒度が理想）
- **セキュリティ要件が欠けている**: [reference/structure-check.md](reference/structure-check.md#セキュリティ要件の確認観点) の観点を提示

## 参考

- [examples/hearing-and-criteria.md](examples/hearing-and-criteria.md) — ヒアリング質問、ユーザーストーリー形式、変更内容カテゴリ、受け入れ基準例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー観点、セキュリティ観点
