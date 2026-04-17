---
name: b-001-create-task-directory
description: docs/tasks/ 配下に連番タスク ID 付きディレクトリを作成する。新しい実装タスクに着手する最初の手順として使用。
disable-model-invocation: true
argument-hint: "[slug]"
allowed-tools: Read, Write, Bash, Glob
---

# CreateTaskDirectory (b-001)

## 目的

- 新しいタスク専用のディレクトリを作成する（ID は自動採番）。
- タスク ID の採番ルール（`taskXXXXXX`）を統一し、管理しやすくする。
- **注意**: このスキルはディレクトリ作成のみ。タスク定義書などのドキュメント作成は後続のスキル（`/b-002-create-task-definition` など）で実施。

## 前提

- `docs/tasks/` ディレクトリが存在すること（未作成なら `/a-001-setup-doc-structure` を先に実行）

## 手順

### 1. スラッグの決定

`$ARGUMENTS` が指定されている場合はそれをスラッグとして使用する。未指定の場合のみユーザーに質問:

- 「タスクの内容を 3〜5 語の英数字とハイフンで表現してください（例: `user-profile-edit`）。」

命名規則の詳細は [examples/naming-convention.md](examples/naming-convention.md) を参照。

### 2. スクリプトの実行

決定したスラッグを引数にして `create-task.sh` を呼び出す。スクリプトが既存タスク走査・ID 採番・形式チェック・ディレクトリ作成までを自動実行する。

```bash
SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
bash "$SCRIPT_DIR/scripts/create-task.sh" "<SLUG>"
```

### 3. 結果の確認

スクリプトの終了コードが 0 であることと、出力された作成パス（`docs/tasks/task{ID}-{SLUG}`）を確認。

### 4. 次のステップの案内

- 「タスクディレクトリ `docs/tasks/task{ID}-{SLUG}` を作成しました。」
- 「続いてタスク定義書を作成しますか？（`/b-002-create-task-definition`）」

## 完了条件

- `docs/tasks/task{ID}-{SLUG}/` ディレクトリが作成されている
- ユーザーに作成されたディレクトリパスが報告されている

## エスカレーション

- **`docs/tasks/` が見つからない**: スクリプトがエラー終了するので、`/a-001-setup-doc-structure` の実行を促す
- **スラッグ形式違反**: スクリプトがエラー終了するので、英小文字・数字・ハイフンのみで再入力を求める
- **スクリプトが見つからない**: `.claude/` または `.agents/` 配下に `scripts/create-task.sh` がない場合、`yodogawa` CLI での再インストールを促す

## 参考

- [examples/naming-convention.md](examples/naming-convention.md) — タスク ID の採番ルールとスラッグ命名規則
