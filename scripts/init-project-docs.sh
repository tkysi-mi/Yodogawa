#!/bin/bash

# init-project-docs.sh
# templates/project/<category>/ 配下のテンプレートを
# docs/project/<category>/ へ一括コピーするスクリプト
# Usage: bash scripts/init-project-docs.sh <category>
#   category: requirements | behavior | domain | design
# 例:    bash scripts/init-project-docs.sh requirements

set -e

CATEGORY="$1"

# スクリプト自身の位置からテンプレートルートを解決（.claude/scripts -> .claude/templates）
SCRIPT_SELF_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_ROOT="$SCRIPT_SELF_DIR/../templates/project"

echo "📝 プロジェクトドキュメントの一括初期化を開始します..."

# 1. 引数チェック
if [ -z "$CATEGORY" ]; then
  echo "❌ category 引数が指定されていません。"
  echo "   使い方: bash scripts/init-project-docs.sh <category>"
  echo "   category: requirements | behavior | domain | design"
  exit 1
fi

# 2. category を番号付きディレクトリ名にマッピング
case "$CATEGORY" in
  requirements)
    SUBDIR="01-requirements"
    ;;
  behavior)
    SUBDIR="02-behavior"
    ;;
  domain)
    SUBDIR="03-domain"
    ;;
  design)
    SUBDIR="04-design"
    ;;
  *)
    echo "❌ 不明な category: '$CATEGORY'"
    echo "   有効な category: requirements | behavior | domain | design"
    exit 1
    ;;
esac

SRC_DIR="$TEMPLATE_ROOT/$SUBDIR"
DEST_DIR="docs/project/$SUBDIR"

# 3. テンプレートディレクトリの存在確認
if [ ! -d "$SRC_DIR" ]; then
  echo "❌ テンプレートディレクトリが見つかりません: $SRC_DIR"
  echo "   yodogawa CLI での再インストールを検討してください。"
  exit 1
fi

# 4. 出力先ディレクトリの存在確認
if [ ! -d "$DEST_DIR" ]; then
  echo "❌ 出力先ディレクトリが存在しません: $DEST_DIR"
  echo "   先に /a-001-setup-doc-structure を実行してください。"
  exit 1
fi

# 5. テンプレートファイルを一括コピー（既存はスキップして冪等性を確保）
COPIED=0
SKIPPED=0

for SRC_PATH in "$SRC_DIR"/*.md; do
  [ -f "$SRC_PATH" ] || continue
  FILENAME=$(basename "$SRC_PATH")
  DEST_PATH="$DEST_DIR/$FILENAME"

  if [ -f "$DEST_PATH" ]; then
    echo "ℹ️  既に存在するためスキップ: $DEST_PATH"
    SKIPPED=$((SKIPPED + 1))
  else
    echo "🔨 コピー中: $SRC_PATH → $DEST_PATH"
    cp "$SRC_PATH" "$DEST_PATH"
    COPIED=$((COPIED + 1))
  fi
done

# 6. 完了報告
echo ""
echo "✅ プロジェクトドキュメントを初期化しました。"
echo "   カテゴリ: $CATEGORY ($SUBDIR)"
echo "   コピー: ${COPIED} ファイル / スキップ: ${SKIPPED} ファイル"
echo "   パス: $DEST_DIR"
