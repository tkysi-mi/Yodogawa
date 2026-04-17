# 構造チェックとレビュー観点

SKILL.md 手順6〜7 で使う確認コマンドとレビュー観点。

## セクション存在確認

```bash
# アーキテクチャ図の確認
grep "\`\`\`mermaid" docs/project/04-design/07-architecture.md && echo "OK" || echo "MISSING: Architecture Diagram"
# パターン定義の確認
grep "## 採用アーキテクチャパターン" docs/project/04-design/07-architecture.md && echo "OK" || echo "MISSING: Pattern definition"
# ADR セクションの確認
grep "## ADR" docs/project/04-design/07-architecture.md && echo "OK" || echo "MISSING: ADR section"
```

## チェックリスト

- [ ] `docs/project/04-design/07-architecture.md` が作成されている
- [ ] システム全体像（クライアント / API / DB / 外部サービス）が可視化されている
- [ ] コンポーネント間のプロトコルがラベルで明示されている
- [ ] スケーラビリティ・冗長化構成が反映されている
- [ ] 採用アーキテクチャパターンと理由が明記されている
- [ ] 重要な技術選定の ADR（背景・決定・代替案・影響）が記録されている

## レビュー確認質問

- 「技術スタック・リポジトリ構造・データモデル・API 仕様すべてと整合していますか？」
- 「非機能要件（性能、可用性、セキュリティ）を満たせる構成ですか？」
- 「将来チームが ADR を読んで意思決定の背景を理解できますか？」
- 「外部依存（SaaS、API）が明示されていますか？」

## ADR 記録の基準

- DB / 言語 / フレームワーク選定など後戻りコストが大きいもの
- 代替案と比較検討した決定
- セキュリティや性能に影響する設計選択
- チームのコーディング規約に関わる大枠の方針

## Git への追加（任意）

```bash
git add docs/project/04-design/07-architecture.md
git status
```

推奨コミットメッセージ:

```text
docs: アーキテクチャ設計の定義

- システム全体図（Mermaid）の作成
- アーキテクチャパターンと ADR の記録
```
