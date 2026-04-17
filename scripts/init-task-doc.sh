#!/bin/bash

# init-task-doc.sh
# タスクディレクトリにテンプレートから指定のドキュメントをコピーするスクリプト
# Usage: bash scripts/init-task-doc.sh <task-dir> <type>
#   type: definition | research | implementation
# 例:    bash scripts/init-task-doc.sh docs/tasks/task000001-user-profile-edit definition

set -e

TASK_DIR="$1"
DOC_TYPE="$2"

# スクリプト自身の位置からテンプレートルートを解決（.claude/scripts -> .claude/templates）
SCRIPT_SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_ROOT="$SCRIPT_SELF_DIR/../templates/tasks/task-template"

echo "📝 タスクドキュメントの初期化を開始します..."

# 1. 引数チェック
if [ -z "$TASK_DIR" ] || [ -z "$DOC_TYPE" ]; then
  echo "❌ 引数が不足しています。"
  echo "   使い方: bash scripts/init-task-doc.sh <task-dir> <type>"
  echo "   type:   definition | research | implementation"
  echo "   例:     bash scripts/init-task-doc.sh docs/tasks/task000001-login definition"
  exit 1
fi

# 2. タスクディレクトリの存在確認
if [ ! -d "$TASK_DIR" ]; then
  echo "❌ タスクディレクトリが存在しません: $TASK_DIR"
  echo "   先に /b-001-create-task-directory を実行してください。"
  exit 1
fi

# 3. type をファイル名にマッピング
case "$DOC_TYPE" in
  definition)
    SRC_FILE="a-definition.md"
    ;;
  research)
    SRC_FILE="b-research.md"
    ;;
  implementation)
    SRC_FILE="c-implementation.md"
    ;;
  *)
    echo "❌ 不明な type: '$DOC_TYPE'"
    echo "   有効な type: definition | research | implementation"
    exit 1
    ;;
esac

SRC_PATH="$TEMPLATE_ROOT/$SRC_FILE"
DEST_PATH="$TASK_DIR/$SRC_FILE"

# 4. テンプレートの存在確認
if [ ! -f "$SRC_PATH" ]; then
  echo "❌ テンプレートが見つかりません: $SRC_PATH"
  echo "   yodogawa CLI での再インストールを検討してください。"
  exit 1
fi

# 5. 既存ファイルはスキップ（冪等性）
if [ -f "$DEST_PATH" ]; then
  echo "ℹ️  既に存在するためスキップ: $DEST_PATH"
  exit 0
fi

# 6. コピー
echo "🔨 コピー中: $SRC_PATH → $DEST_PATH"
cp "$SRC_PATH" "$DEST_PATH"

# 7. 完了報告
echo ""
echo "✅ タスクドキュメントを初期化しました。"
echo "   パス: $DEST_PATH"
