# 構造チェックとレビュー観点

SKILL.md 手順7〜8 で使う確認コマンドとレビュー観点。

## セクション存在確認

```bash
# 画面一覧セクションの確認
grep "## 画面一覧" docs/project/04-design/03-screen-design.md && echo "OK" || echo "MISSING: Screen list"
# 画面遷移図の確認
grep "\`\`\`mermaid" docs/project/04-design/03-screen-design.md && echo "OK" || echo "MISSING: Flowchart"
# レスポンシブポリシーの確認
grep "## レスポンシブデザインポリシー" docs/project/04-design/03-screen-design.md && echo "OK" || echo "MISSING: Responsive policy"
```

## チェックリスト

- [ ] `docs/project/04-design/03-screen-design.md` が作成されている
- [ ] 主要な画面がすべて網羅されている
- [ ] 各画面の URL パスとアクセス権限が定義されている
- [ ] Empty State / Loading / Error の各状態が考慮されている
- [ ] 画面遷移図にデッドエンドがない
- [ ] 認証失敗時・404 等のエラー導線が定義されている
- [ ] レスポンシブのブレークポイントと方針（モバイルファースト等）が定まっている

## レビュー確認質問

- 「ユーザーストーリーを完遂するのに必要な画面がすべて揃っていますか？」
- 「初回訪問時の Empty State は適切にハンドリングされますか？」
- 「権限のないユーザーが迷い込まない導線になっていますか？」
- 「MVP スコープと将来拡張が区別されていますか？」

## Git への追加（任意）

```bash
git add docs/project/04-design/03-screen-design.md
git status
```

推奨コミットメッセージ:

```text
docs: 画面設計ドキュメントの作成

- 画面一覧と遷移フロー（Mermaid）を追加
- レスポンシブデザインポリシーを定義
```
