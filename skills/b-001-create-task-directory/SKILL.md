---
name: b-001-create-task-directory
description: docs/tasks/ 配下に連番タスク ID 付きディレクトリ（a-definition.md / b-research.md / c-implementation.md）を作成する。新しい実装タスクに着手する最初の手順として使用。
disable-model-invocation: true
argument-hint: "[slug]"
allowed-tools: Read, Write, Bash, Glob
---

# CreateTaskDirectory (b-001)

## 目的

- 新しいタスク専用のディレクトリを作成する。
- タスク ID の採番ルール（`taskXXXXXX`）を統一し、管理しやすくする。
- **注意**: このスキルはディレクトリ作成のみ。タスク定義書などのドキュメント作成は後続のスキル（`/b-002-create-task-definition` など）で実施。

## 前提

- `docs/tasks/` ディレクトリが存在すること

## 手順

### 1. 既存タスクの確認と ID 採番

```bash
ls -d docs/tasks/task*
```

採番ルールとスラッグ命名は [examples/naming-convention.md](examples/naming-convention.md) を参照。

### 2. タスク名の決定

`$ARGUMENTS` が指定されている場合はそれをスラッグとして使用する。未指定の場合のみユーザーに質問:

- 「タスクの内容を 3〜5 語の英数字とハイフンで表現してください（例: `user-profile-edit`）。」

### 3. ディレクトリの作成

```bash
mkdir -p docs/tasks/task{ID}-{SLUG}
# 例
mkdir -p docs/tasks/task000001-email-auth
```

### 4. 作成確認

```bash
ls -ld docs/tasks/task{ID}-{SLUG} && echo "OK" || echo "FAILED"
```

### 5. 次のステップの案内

- 「ディレクトリ `docs/tasks/task{ID}-{SLUG}` を作成しました。」
- 「続いてタスク定義書を作成しますか？（`/b-002-create-task-definition`）」

## 完了条件

- `docs/tasks/task{ID}-{SLUG}/` ディレクトリが作成されている
- ユーザーにディレクトリパスが報告されている

## エスカレーション

- **`docs/tasks/` が見つからない**: `mkdir -p docs/tasks` を実行するか、`/a-001-setup-doc-structure` の確認を促す
- **命名規則違反**: タスク名にスペースや特殊文字が含まれる場合、修正を求める

## 参考

- [examples/naming-convention.md](examples/naming-convention.md) — タスク ID の採番ルールとスラッグ命名規則
