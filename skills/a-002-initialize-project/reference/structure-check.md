# 構造チェックコマンド集

SKILL.md 手順11で使う、生成済みドキュメントの構造確認用コマンド。

## a-002 生成ドキュメントの必須セクション/テーブル検証

```bash
# 01-product-brief.md: 主要セクションの確認
grep "## 背景 / 解く課題" docs/project/01-requirements/01-product-brief.md && echo "OK" || echo "MISSING: 背景 / 解く課題"
grep "## 成功指標" docs/project/01-requirements/01-product-brief.md && echo "OK" || echo "MISSING: 成功指標"
grep "## 非ゴール" docs/project/01-requirements/01-product-brief.md && echo "OK" || echo "MISSING: 非ゴール"

# 03-parking-lot.md: テーブルヘッダー
grep "| Category 1 | Category 2 |" docs/project/01-requirements/03-parking-lot.md \
  && echo "OK" || echo "MISSING: Table Header"

# 04-non-functional-requirements.md: テーブルヘッダー
grep "| カテゴリ | 要件 |" docs/project/01-requirements/04-non-functional-requirements.md \
  && echo "OK" || echo "MISSING: Table Header"

# 05-user-stories.md: テーブルヘッダー
grep "| ストーリーID | ストーリー |" docs/project/01-requirements/05-user-stories.md \
  && echo "OK" || echo "MISSING: Table Header"

# 06-features-implemented.md（existing モードのみ）: テーブルヘッダー
grep "| 機能ID | Category 1 |" docs/project/01-requirements/06-features-implemented.md \
  && echo "OK" || echo "MISSING: Table Header"
```

## チェックリスト

- [ ] すべてのファイルが存在する
- [ ] 各ファイルがテンプレートの基本構造を維持している（主要セクション・テーブル）
- [ ] プレースホルダーが適切な内容に置き換わっている

## Git への追加（オプション）

```bash
git add docs/project/01-requirements/
git status
```

推奨コミットメッセージ:

```
docs: 要件定義ドキュメントの作成

- Product Brief、機能要件、非機能要件、ユーザーストーリーを追加
```
