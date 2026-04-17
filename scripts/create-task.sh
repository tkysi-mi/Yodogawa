#!/bin/bash

# create-task.sh
# docs/tasks/ 配下に連番 ID 付きのタスクディレクトリを作成するスクリプト
# Usage: bash scripts/create-task.sh <slug>
# 例:    bash scripts/create-task.sh user-profile-edit

set -e

TASKS_DIR="docs/tasks"
SLUG="$1"

echo "📂 タスクディレクトリの作成を開始します..."

# 1. 引数チェック
if [ -z "$SLUG" ]; then
  echo "❌ スラッグが指定されていません。"
  echo "   使い方: bash scripts/create-task.sh <slug>"
  echo "   例:     bash scripts/create-task.sh user-profile-edit"
  exit 1
fi

# 2. スラッグの形式チェック（英小文字・数字・ハイフンのみ、連続ハイフン禁止）
if ! [[ "$SLUG" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "❌ スラッグは英小文字・数字・ハイフンのみ使用できます: '$SLUG'"
  echo "   例: user-profile-edit"
  exit 1
fi

# 3. 単語数の警告（3〜5 語を推奨、範囲外は警告のみで続行）
WORD_COUNT=$(echo "$SLUG" | awk -F'-' '{print NF}')
if [ "$WORD_COUNT" -lt 3 ] || [ "$WORD_COUNT" -gt 5 ]; then
  echo "⚠️  スラッグは 3〜5 語を推奨しています（現在: ${WORD_COUNT} 語）。"
fi

# 4. docs/tasks/ の存在確認
if [ ! -d "$TASKS_DIR" ]; then
  echo "❌ '$TASKS_DIR' が存在しません。"
  echo "   先に /a-001-setup-doc-structure を実行してください。"
  exit 1
fi

# 5. 既存タスクから次の ID を採番
MAX_ID=0
for dir in "$TASKS_DIR"/task*; do
  [ -d "$dir" ] || continue
  BASENAME=$(basename "$dir")
  # task000123-xxx から 000123 を抜き出す
  if [[ "$BASENAME" =~ ^task([0-9]{6})- ]]; then
    NUM=$((10#${BASH_REMATCH[1]}))
    if [ "$NUM" -gt "$MAX_ID" ]; then
      MAX_ID=$NUM
    fi
  fi
done

NEXT_ID=$((MAX_ID + 1))
TASK_ID=$(printf "task%06d" "$NEXT_ID")
TASK_DIR="$TASKS_DIR/${TASK_ID}-${SLUG}"

# 6. 同名ディレクトリの存在確認（理論上発生しないが保険）
if [ -d "$TASK_DIR" ]; then
  echo "❌ '$TASK_DIR' は既に存在します。"
  exit 1
fi

# 7. 作成
echo "🔨 ディレクトリを作成中: $TASK_DIR"
mkdir -p "$TASK_DIR"

# 8. 完了報告
echo ""
echo "✅ タスクディレクトリを作成しました。"
echo "   パス: $TASK_DIR"
echo ""
echo "次のステップ:"
echo "  - タスク定義書を作成する: /b-002-create-task-definition"
