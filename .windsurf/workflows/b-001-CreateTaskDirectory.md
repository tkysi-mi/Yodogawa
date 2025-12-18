---
description: 新規タスク用のディレクトリを作成し、タスクIDを採番するワークフロー
auto_execution_mode: 1
---

# CreateTaskDirectory (b-001)

## 目的

- 新しいタスクのための専用ディレクトリを作成する。
- タスクIDの採番ルール（`taskXXXXXX`）を統一し、管理しやすくする。
- **注意**: このワークフローはディレクトリ作成のみを行います。タスク定義書などのドキュメント作成は後続のワークフロー（`b-001` 等）で実施します。

## 前提

- `docs/tasks/` ディレクトリが存在すること。

## 手順

### 1. 既存タスクの確認とID採番

- 既存のタスクディレクトリを確認し、次のタスクIDを決定する。

  ```bash
  ls -d docs/tasks/task*
  ```

- **採番ルール**:
  - 形式: `task{6桁連番}-{スラッグ}`
  - 例: `task000001-email-auth`
  - 既存がない場合は `task000001` から開始。
  - 既存がある場合は最大番号 + 1。

### 2. タスク名の決定

- ユーザーにタスクのキーワード（スラッグ）を質問する。
  - 「タスクの内容を3-5語の英数字とハイフンで表現してください（例: `user-profile-edit`）。」

### 3. ディレクトリの作成

- 決定したIDとスラッグを使用してディレクトリを作成する。

  ```bash
  mkdir -p docs/tasks/task{ID}-{SLUG}
  ```

  例:

  ```bash
  mkdir -p docs/tasks/task000001-email-auth
  ```

### 4. 作成確認

- ディレクトリが正しく作成されたか確認する。

  ```bash
  ls -ld docs/tasks/task{ID}-{SLUG} && echo "OK" || echo "FAILED"
  ```

### 5. 次のステップの案内

- ユーザーに次のアクションを提案する：
  - 「ディレクトリ `docs/tasks/task{ID}-{SLUG}` を作成しました。」
  - 「続いてタスク定義書を作成しますか？ (`CreateTaskDefinition` / b-001)」

## 完了条件

- `docs/tasks/task{ID}-{SLUG}/` ディレクトリが作成されている。
- ユーザーにディレクトリパスが報告されている。

## エスカレーション

- `docs/tasks/` が見つからない場合:
  - `mkdir -p docs/tasks` を実行するか、`SetupDocStructure` (a-001) の確認を促す。
- 命名規則違反:
  - タスク名にスペースや特殊文字が含まれる場合、修正を求める。
