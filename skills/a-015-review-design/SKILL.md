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

### 1. doctor によるドキュメント健全性検査

```bash
npx -y yodogawa doctor --json
```

`findings` から `check: "structure"` かつ `file` が `docs/project/04-design/` で始まる項目を確認し、必須ファイル・見出しの欠落があれば対応するスキル（a-007〜a-014）の実行を促す。**`id-trace` は 04-design 配下を対象にした ID 体系を持たないため、5観点すべてに直接的な機械判定は無い**（`bin/lib/project-spec.js` の `ID_FAMILIES` に 04-design 向けの族が定義されていないため）。`placeholder`/`links` の finding は前提整合性の補助シグナルとして使う（未記入セクション・リンク切れの有無）。doctor が実行できない場合のみ、代替として `ls -l docs/project/04-design/*.md` を実行する。

### 2. 一貫性チェックの実行（観点別 PASS/FAIL + 根拠引用）

以下の 5 観点を **PASS / FAIL** で判定する（判定ルール: 観点内に Error 相当の指摘が1件以上あれば FAIL、Warning 相当のみなら PASS+注記）。**doctor の id-trace は 04-design を検査対象にしないため、2.1〜2.5 のすべてがエージェント自身の Read/Grep による判断**になる。各判定には file:line の引用を必須とする（詳細は [reference/consistency-checks.md](reference/consistency-checks.md)）。

> **エージェントの役割範囲**: doctor が既に検査済みの機械的観点（手順1の存在確認）は再実装しない。一方、この手順2の5観点はすべて doctor 非対応の意味判断であり、役割は「読解判断＋証拠引用」である。Read/Grep/Glob を自由に使ってよい（むしろ必須）。判断した結果は必ず file:line の引用を伴わせる。

- **2.1 テックスタック ↔ アーキテクチャ**: 選定技術の反映、ADR の記録
- **2.2 データモデル ↔ ドメインモデル**: Aggregate のカバレッジ、用語統一
- **2.3 API 仕様 ↔ データモデル**: リソース・フィールドの整合
- **2.4 画面設計 ↔ API 仕様**: 必要なエンドポイントのカバレッジ、状態対応
- **2.5 インフラ ↔ アーキテクチャ**: 構成の網羅、非機能要件の反映

`structure`/`placeholder`/`links` の finding は各観点に一対一対応しないため、判断材料としてのみ利用する。

### 3. レビュー結果レポートの作成

観点別 PASS/FAIL の結果をまとめ、`docs/project/DESIGN-REVIEW-REPORT-YYYYMMDDHHMMSS.md` を作成する。フォーマットは [examples/review-report-template.md](examples/review-report-template.md#レポートフォーマット) を参照。

必須セクション:

- サマリー（観点別 PASS/FAIL の件数）
- 詳細（上記 5 観点ごとの PASS/FAIL・根拠(file:line引用)・コメント）
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
- 全設計ドキュメント間の整合性がチェックされ、観点ごとの判定（PASS/FAIL）と根拠（file:line引用）が記録されている。
- 具体的な修正アクションが提案されている。

## エスカレーション

- **致命的な不整合がある**: 「データモデルと API 仕様の間に大きな乖離があります。実装手戻りを防ぐため、設計の見直しを強く推奨します。」
- **ドメインモデルとの乖離**: 「設計がドメインモデルの意図を反映していません。ビジネスロジックの破綻につながる恐れがあります。」
- 判断基準は [reference/consistency-checks.md](reference/consistency-checks.md#エスカレーション判断基準) を参照。

## 参考

- [examples/review-report-template.md](examples/review-report-template.md) — レビュー結果レポートのフォーマット例、PASS/FAIL判定ルール
- [reference/consistency-checks.md](reference/consistency-checks.md) — 5 観点の詳細なチェック項目（すべてdoctor非対応）、grep補助例、エスカレーション基準
