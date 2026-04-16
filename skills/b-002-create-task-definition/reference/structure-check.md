# 構造チェックとレビュー観点

SKILL.md 手順7〜8で使う構造確認コマンドとレビュー観点。

## セクション存在確認

```bash
grep "## 目的" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && grep "## ユーザーストーリー" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && grep "## 変更内容" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && grep "## 受け入れ基準" docs/tasks/task{ID}-{SLUG}/a-definition.md \
  && echo "OK" || echo "MISSING SECTION"
```

## チェックリスト

- [ ] 目的に数値 / Before-After が含まれている
- [ ] すべての重要なユーザーストーリーが列挙されている
- [ ] 変更箇所がファイル名やエンドポイント単位で特定されている
- [ ] 受け入れ基準がテスト可能な表現になっている

## レビュー確認質問

- 「目的は明確ですか？」
- 「変更内容は網羅されていますか？」
- 「受け入れ基準は具体的で測定可能ですか？」

## Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/a-definition.md
git commit -m "docs(task): タスク定義書の作成 task{ID}"
```

## セキュリティ要件の確認観点

受け入れ基準にセキュリティ要件が欠けている場合、以下を検討:

- 入力バリデーション
- XSS / CSRF / SQL Injection 対策
- 認証・認可
- データの暗号化
