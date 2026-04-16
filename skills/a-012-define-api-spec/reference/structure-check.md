# 構造チェックとレビュー観点

SKILL.md 手順6〜7 で使う確認コマンドとレビュー観点。

## セクション存在確認

```bash
# 認証セクションの確認
grep "## 認証・認可" docs/project/design/06-api-spec.md && echo "OK" || echo "MISSING: Auth section"
# エンドポイント一覧の確認
grep "## エンドポイント一覧" docs/project/design/06-api-spec.md && echo "OK" || echo "MISSING: Endpoints"
# レスポンス形式の確認
grep "## 共通レスポンス形式" docs/project/design/06-api-spec.md && echo "OK" || echo "MISSING: Response format"
```

## チェックリスト

- [ ] `docs/project/design/06-api-spec.md` が作成されている
- [ ] 認証方式（JWT / OAuth 等）が明確に定義されている
- [ ] トークンの保存先（Cookie / Header）が決まっている
- [ ] ロール・スコープが定義されている
- [ ] 主要リソースの CRUD エンドポイントが網羅されている
- [ ] 特殊アクション（cancel, publish 等）が適切な命名で定義されている
- [ ] 成功時・エラー時の共通レスポンス形式が定義されている
- [ ] ページネーション方式（Offset / Cursor）が決まっている
- [ ] エラーコード体系が定義されている

## レビュー確認質問

- 「データモデルのエンティティすべてに必要な API が揃っていますか？」
- 「画面設計で必要なデータ取得に対応するエンドポイントはありますか？」
- 「認証・認可のフローにセキュリティリスクはありませんか？」
- 「エラー応答のフォーマットはクライアントで扱いやすいですか？」

## Git への追加（任意）

```bash
git add docs/project/design/06-api-spec.md
git status
```

推奨コミットメッセージ:

```text
docs: API 仕様（基本設計）の作成

- 認証・認可方式の定義
- エンドポイント一覧と共通レスポンス形式を定義
```
