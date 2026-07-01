#!/usr/bin/env bash
# 新規 worktree に、gitignore 済みのローカル設定（.env / .claude 等）を
# メイン checkout から複製する。git worktree は tracked ファイルしか checkout
# しないため、それを補う。.worktreeinclude に列挙したものが対象。
#
# 実行コンテキスト: Orca の setup（cwd = 新 worktree）。Windows では cmd.exe
# 経由で実行されるため、コピー元は環境変数に依存せず自己解決する:
#   - $ORCA_ROOT_PATH が渡ればそれを使う
#   - 無ければ git からメイン worktree を導出する（cmd.exe は $VAR を展開しない）
#
# Orca への登録（cmd.exe でも安全な相対パス。cwd は worktree）:
#   bash scripts/worktree-setup.sh
set -eu

# コピー先 = この worktree
DST="${ORCA_WORKTREE_PATH:-$PWD}"

# コピー元 = メイン checkout（$ORCA_ROOT_PATH 優先、無ければ git から導出）
SRC="${ORCA_ROOT_PATH:-}"
if [ -z "$SRC" ]; then
  SRC="$(git -C "$DST" worktree list --porcelain 2>/dev/null | awk '/^worktree /{print $2; exit}')"
fi
if [ -z "$SRC" ] || [ "$SRC" = "$DST" ]; then
  echo "worktree-setup: コピー元(メイン checkout)を特定できないためスキップ" >&2
  exit 0
fi

INCLUDE="$DST/.worktreeinclude"
if [ ! -f "$INCLUDE" ]; then
  echo "worktree-setup: $INCLUDE が無いためスキップ"
  exit 0
fi

# .worktreeinclude の各行をリテラルパスとして扱う（glob は未対応）。
# 既存ファイルは上書きしない／ディレクトリは再帰コピー。
while IFS= read -r entry || [ -n "$entry" ]; do
  entry="${entry%$'\r'}"                      # CRLF 対策で CR を除去
  case "$entry" in '' | \#*) continue ;; esac # 空行・コメント行をスキップ
  entry="${entry%/}"                          # 末尾スラッシュを除去
  [ -e "$SRC/$entry" ] || continue            # コピー元が無ければスキップ
  [ -e "$DST/$entry" ] && continue            # 既存は上書きしない
  mkdir -p "$DST/$(dirname "$entry")"
  cp -R "$SRC/$entry" "$DST/$entry" && echo "worktree-setup: seeded $entry"
done < "$INCLUDE"
