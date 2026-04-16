# 構造チェックとレビュー観点

SKILL.md 手順6〜7 で使う確認コマンドとレビュー観点。

## セクション存在確認

```bash
# ディレクトリ構造図の確認
grep "project-root/" docs/project/design/02-repository-structure.md && echo "OK" || echo "MISSING: Directory tree"
# アーキテクチャパターンセクションの確認
grep "## アーキテクチャパターン" docs/project/design/02-repository-structure.md && echo "OK" || echo "MISSING: Architecture section"
# 命名規則セクションの確認
grep "## 命名規則" docs/project/design/02-repository-structure.md && echo "OK" || echo "MISSING: Naming convention section"
```

## チェックリスト

- [ ] `docs/project/design/02-repository-structure.md` が作成されている
- [ ] ディレクトリツリーが技術スタックと整合している
- [ ] 各ディレクトリの責務が定義されている
- [ ] 採用アーキテクチャパターンの理由が記載されている
- [ ] 命名規則（ファイル名・識別子）が定義されている
- [ ] 依存関係ルールが明示されている
- [ ] テスト配置方針（コロケーション or 分離）が定まっている

## アーキテクチャパターン選定ガイド

| パターン | 適合するケース |
|:--|:--|
| レイヤード | 一般的なバックエンド（NestJS, Django 等） |
| 機能ベース | フロントエンド、モジュラーモノリス |
| クリーンアーキテクチャ | 複雑なドメインロジックを持つ場合 |
| Atomic Design / FSD | フロントエンド特化、大規模 UI |

## レビュー確認質問

- 「フレームワーク標準の構成と整合していますか？」
- 「チームが迷わず配置できるレベルの具体性がありますか？」
- 「将来の機能追加で破綻しない柔軟性がありますか？」

## Git への追加（任意）

```bash
git add docs/project/design/02-repository-structure.md
git status
```

推奨コミットメッセージ:

```text
docs: リポジトリ構造とアーキテクチャ定義の作成

- ディレクトリ構成、命名規則、依存関係ルールを定義
- 採用アーキテクチャパターン: [パターン名]
```
