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

### 2. タスク ID の採番とディレクトリ作成

決定したスラッグについて、次を順に行う。

1. **形式チェック**: スラッグが正規表現 `^[a-z0-9]+(-[a-z0-9]+)*$`（英小文字・数字・ハイフンのみ、連続ハイフン禁止）に一致するか確認。3〜5 語を推奨（範囲外は警告のみで続行）。違反時はエスカレーション参照。
2. **ID の採番**: `docs/tasks/` 配下の `task{6桁数字}-*` ディレクトリから最大 ID を求め、+1 を 6 桁ゼロ詰めした `task{ID}`（例: `task000003`）とする。タスクが無ければ `task000001`。
3. **ディレクトリ作成**: `docs/tasks/task{ID}-{SLUG}` を作成する。

```bash
# 既存タスクを確認して最大 ID を把握
ls -d docs/tasks/task* 2>/dev/null

# 採番した ID とスラッグでディレクトリを作成（{ID}/{SLUG} は実値に置換）
mkdir -p "docs/tasks/task{ID}-{SLUG}"
```

### 3. 結果の確認

作成パス（`docs/tasks/task{ID}-{SLUG}`）が生成されたことを確認。

### 4. 次のステップの案内

- 「タスクディレクトリ `docs/tasks/task{ID}-{SLUG}` を作成しました。」
- 「続いてタスク定義書を作成しますか？（`/b-002-create-task-definition`）」

## 完了条件

- `docs/tasks/task{ID}-{SLUG}/` ディレクトリが作成されている
- ユーザーに作成されたディレクトリパスが報告されている

## エスカレーション

- **`docs/tasks/` が見つからない**: ディレクトリが無い場合は `/a-001-setup-doc-structure` の実行を促す
- **スラッグ形式違反**: 英小文字・数字・ハイフンのみ（連続ハイフン禁止）で再入力を求める

## 参考

- [examples/naming-convention.md](examples/naming-convention.md) — タスク ID の採番ルールとスラッグ命名規則
