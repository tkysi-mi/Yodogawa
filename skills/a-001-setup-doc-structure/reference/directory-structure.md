# docs ディレクトリ構造とコミットメッセージ

SKILL.md 手順2〜3で参照する生成構造とコミットメッセージテンプレート。

## 生成されるディレクトリ構造

```
docs/
├── README.md
├── project/
│   ├── 01-requirements/
│   ├── 02-behavior/
│   ├── 03-domain/
│   └── 04-design/
└── tasks/
```

### 各ディレクトリの用途

- `project/01-requirements/` — 要件定義（システム概要、機能要件、非機能要件、ユーザーストーリー）
- `project/02-behavior/` — 振る舞い定義（Gherkin シナリオ）
- `project/03-domain/` — ドメインモデル、ユビキタス言語
- `project/04-design/` — 画面設計、データモデル、API 仕様、アーキテクチャ等
- `tasks/` — 個別タスク（`task{ID}-{SLUG}/` 形式）

## Git 追加時の推奨コミットメッセージ

```
ドキュメント構造の初期化

- 標準的な構造を持つ docs/ ディレクトリを追加
- ドキュメント構成を説明する docs/README.md を追加
```

## スクリプト実行コマンド

```bash
if [ -d ".agent" ]; then
  SCRIPT_DIR=".agent"
elif [ -d ".cursor" ]; then
  SCRIPT_DIR=".cursor"
elif [ -d ".claude" ]; then
  SCRIPT_DIR=".claude"
elif [ -d ".codex" ]; then
  SCRIPT_DIR=".codex"
else
  echo "エラー: AI coding assistant ディレクトリが見つかりません"
  exit 1
fi

bash "$SCRIPT_DIR/scripts/setup-docs.sh"
```
