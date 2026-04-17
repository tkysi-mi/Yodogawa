---
name: a-001-setup-doc-structure
description: docs/ 配下にプロジェクト/タスク用のディレクトリ構造と README を作成する。新規リポジトリでドキュメント基盤を初期化する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Bash, Glob
---

# SetupDocStructure (a-001)

## 目的

- プロジェクトルートに標準化されたドキュメントディレクトリ構造を作成する。
- `docs/README.md` を作成し、ドキュメント構成と更新方針を明文化する。

## 前提

- プロジェクトのルートディレクトリへの書き込み権限があること
- `docs/` ディレクトリが存在しない、または既存の構造を拡張したいこと

## 手順

### 1. スクリプトの実行

環境に応じたスクリプトを実行。スクリプト本体とフォールバック実装は [reference/directory-structure.md](reference/directory-structure.md#スクリプト実行コマンド) を参照。

```bash
SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
bash "$SCRIPT_DIR/scripts/setup-docs.sh"
```

### 2. 結果の確認

スクリプト実行結果にエラーがないこと、および期待した構造が生成されていることを確認。生成構造と各ディレクトリの用途は [reference/directory-structure.md](reference/directory-structure.md#生成されるディレクトリ構造) を参照。

### 3. Git への追加（オプション）

ユーザーに確認し、「はい」なら:

```bash
git add docs/
git status
```

推奨コミットメッセージは [reference/directory-structure.md](reference/directory-structure.md#git-追加時の推奨コミットメッセージ) を参照。

### 4. 完了条件の確認

- [ ] スクリプトが正常に終了した
- [ ] `docs/` ディレクトリ構造が正しく作成されている

## 完了条件

- プロジェクトルートに `docs/` ディレクトリが作成されている
- `docs/project/` 配下に `01-requirements/`, `02-behavior/`, `03-domain/`, `04-design/` が存在する
- `docs/tasks/` ディレクトリが存在する
- `docs/README.md` が作成されている
- ユーザーに作成結果が報告されている

## エスカレーション

- **既存の `docs/` が存在し重要ファイルを含む**: 「既存のドキュメント構造が検出されました。上書きや削除のリスクがあるため、手動で確認してください。」と警告し処理を中断
- **権限エラー**: 「ディレクトリの作成に失敗しました。書き込み権限を確認してください。」
- **Git リポジトリでない**: 「このディレクトリは Git リポジトリではありません。必要なら `git init` を実行してください。」

## 参考

- [reference/directory-structure.md](reference/directory-structure.md) — 生成構造、各ディレクトリの用途、スクリプト詳細、推奨コミットメッセージ
