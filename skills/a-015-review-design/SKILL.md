---
name: a-015-review-design
description: 設計ドキュメント（技術・画面・データ・API・アーキ・インフラ）間の一貫性を検証し、要件・ドメインモデルとの整合性を確認する。設計フェーズ完了後、タスク分解に入る前の検査として使用。
disable-model-invocation: true
context: fork
allowed-tools: Read, Grep, Glob, Write, Bash
---

# ReviewDesign (a-015)

## 目的

- 設計フェーズで作成されたすべてのドキュメント間の一貫性を体系的にチェックする。
- 設計ドキュメント間の不整合、漏れ、矛盾を検出し、修正提案を提供する。
- 技術選定、アーキテクチャ、データモデル、API 仕様の整合性を確認する。
- レビュー結果レポートを作成し、修正すべき項目を優先度付きでリストアップする。

## 前提

- 要件・ドメインレビューが完了していること（`/a-006-review-requirements-domain` 実施済み）。
- 以下の設計ドキュメントが作成されていること:
  - `docs/project/04-design/01-tech-stack.md`
  - `docs/project/04-design/02-repository-structure.md`
  - `docs/project/04-design/03-screen-design.md`
  - `docs/project/04-design/05-data-model.md`
  - `docs/project/04-design/06-api-spec.md`
  - `docs/project/04-design/07-architecture.md`
  - `docs/project/04-design/08-infrastructure.md`

## 手順

### 1. ドキュメント存在確認

```bash
ls -l docs/project/04-design/*.md
```

不足しているドキュメントがあれば、対応するスキルの実行を促す。

### 2. 一貫性チェックの実行

以下の 5 観点を自動検索（grep 等）と手動確認で検証する。詳細な観点・コマンドは [reference/consistency-checks.md](reference/consistency-checks.md) を参照。

- **2.1 テックスタック ↔ アーキテクチャ**: 選定技術の反映、ADR の記録
- **2.2 データモデル ↔ ドメインモデル**: Aggregate のカバレッジ、用語統一
- **2.3 API 仕様 ↔ データモデル**: リソース・フィールドの整合
- **2.4 画面設計 ↔ API 仕様**: 必要なエンドポイントのカバレッジ、状態対応
- **2.5 インフラ ↔ アーキテクチャ**: 構成の網羅、非機能要件の反映

### 3. レビュー結果レポートの作成

検出された問題（Error / Warning / OK）をまとめ、`docs/project/DESIGN-REVIEW-REPORT-YYYYMMDDHHMMSS.md` を作成する。フォーマットは [examples/review-report-template.md](examples/review-report-template.md#レポートフォーマット) を参照。

必須セクション:

- サマリー（OK / Warning / Error の件数）
- 詳細（上記 5 観点ごとの結果）
- 推奨アクション（修正すべきタスクとスキル参照）

### 4. 結果の報告と修正提案

- レポート内容を要約してユーザーに伝える。
- 重大なエラー（Error）がある場合は優先修正を提案。
- 「修正作業を開始しますか？それともレポートを Git に保存して終了しますか？」

### 5. Git への追加（任意）

```bash
git add docs/project/DESIGN-REVIEW-REPORT-*.md
git commit -m "docs: 設計整合性レビューレポートの作成"
```

## 完了条件

- `docs/project/DESIGN-REVIEW-REPORT-YYYYMMDDHHMMSS.md` が作成されている。
- 全設計ドキュメント間の整合性がチェックされ、結果（OK/Warning/Error）が記録されている。
- 具体的な修正アクションが提案されている。

## エスカレーション

- **致命的な不整合がある**: 「データモデルと API 仕様の間に大きな乖離があります。実装手戻りを防ぐため、設計の見直しを強く推奨します。」
- **ドメインモデルとの乖離**: 「設計がドメインモデルの意図を反映していません。ビジネスロジックの破綻につながる恐れがあります。」
- 判断基準は [reference/consistency-checks.md](reference/consistency-checks.md#エスカレーション判断基準) を参照。

## 参考

- [examples/review-report-template.md](examples/review-report-template.md) — レビュー結果レポートのフォーマット例、重大度記号
- [reference/consistency-checks.md](reference/consistency-checks.md) — 5 観点の詳細なチェック項目、grep コマンド例、エスカレーション基準
