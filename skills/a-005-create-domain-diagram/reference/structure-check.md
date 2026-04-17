# 構造チェックとレビュー観点

SKILL.md 手順5〜7 で使用する確認コマンドとレビュー観点。

## セクション存在確認

```bash
# Mermaid ブロックの存在確認
grep "\`\`\`mermaid" docs/project/03-domain/01-domain-model.md && echo "OK" || echo "MISSING: Mermaid diagram"
# Context Map セクションの確認
grep "## Context Map" docs/project/03-domain/01-domain-model.md && echo "OK" || echo "MISSING: Context Map section"
```

## チェックリスト

- [ ] `docs/project/03-domain/01-domain-model.md` に Context Map 図が含まれている
- [ ] Mermaid 図が正しくレンダリングされる（構文エラーがない）
- [ ] 戦略的分類に応じて色分けされている（Core / Supporting / Generic）
- [ ] 関係パターン（Customer/Supplier など）と通信方法がエッジに記載されている
- [ ] 必要に応じて Aggregate 図やシーケンス図が追加されている

## レビュー確認質問

- 「関係性は正しく表現されていますか？」
- 「分類の色分けは適切ですか？」
- 「複雑すぎて読みにくい箇所はありませんか？」
- 「主要なユースケース（Command → Event）が追えますか？」

## Git への追加（任意）

```bash
git add docs/project/03-domain/01-domain-model.md
git status
```

推奨コミットメッセージ:

```text
docs: ドメインモデル図（Context Map）の追加

- Bounded Context 間の関係を Mermaid 図で視覚化
- 戦略的分類に基づく色分けを追加
```
