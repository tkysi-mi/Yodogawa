# 構造チェックコマンド集

SKILL.md 手順9で使う、生成済みドキュメントの構造確認用コマンド。

## 5ドキュメントの必須セクション/テーブル検証

```bash
# 01-system-overview.md: 主要セクションの確認
grep "## 背景" docs/project/requirements/01-system-overview.md && echo "OK" || echo "MISSING: 背景"
grep "## 目的" docs/project/requirements/01-system-overview.md && echo "OK" || echo "MISSING: 目的"

# 02-features-implemented.md: テーブルヘッダー
grep "| 機能ID | Category 1 |" docs/project/requirements/02-features-implemented.md \
  && echo "OK" || echo "MISSING: Table Header"

# 03-features-planned.md: テーブルヘッダー
grep "| Category 1 | Category 2 |" docs/project/requirements/03-features-planned.md \
  && echo "OK" || echo "MISSING: Table Header"

# 04-non-functional-requirements.md: テーブルヘッダー
grep "| カテゴリ | 要件 |" docs/project/requirements/04-non-functional-requirements.md \
  && echo "OK" || echo "MISSING: Table Header"

# 05-user-stories.md: テーブルヘッダー
grep "| ストーリーID | ストーリー |" docs/project/requirements/05-user-stories.md \
  && echo "OK" || echo "MISSING: Table Header"
```

## チェックリスト

- [ ] すべてのファイルが存在する
- [ ] 各ファイルがテンプレートの基本構造を維持している（主要セクション・テーブル）
- [ ] プレースホルダーが適切な内容に置き換わっている

## Git への追加（オプション）

```bash
git add docs/project/requirements/
git status
```

推奨コミットメッセージ:

```
docs: 要件定義ドキュメントの作成

- システム概要、機能要件、非機能要件、ユーザーストーリーを追加
```
