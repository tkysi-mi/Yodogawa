---
name: a-006-review-requirements-domain
description: 要件定義・シナリオ・ドメインモデル間の一貫性を検証し、不整合や抜け漏れを検出する。ドメイン設計完了後、技術選定フェーズへ移る前の検査として使用。
disable-model-invocation: true
context: fork
allowed-tools: Read, Grep, Glob, Write, Bash
---

# ReviewRequirementsDomain (a-006)

## 目的

- ここまでに作成されたすべてのドキュメント間の一貫性を体系的にチェックする。
- ドキュメント間の不整合、漏れ、矛盾を検出し、修正提案を提供する。
- ユビキタス言語の遵守状況を確認し、用語の一貫性を保証する。
- レビュー結果レポートを作成し、修正すべき項目を優先度付きでリストアップする。

## 前提

以下のドキュメントが作成されていること:

- `docs/project/requirements/01-system-overview.md` 〜 `05-user-stories.md`
- `docs/project/behavior/01-scenarios.md`
- `docs/project/domain/01-domain-model.md`, `02-ubiquitous-language.md`

## 手順

### 1. ドキュメント存在確認

```bash
ls -l docs/project/requirements/*.md docs/project/behavior/*.md docs/project/domain/*.md
```

不足があれば、対応する `/a-002`, `/a-003`, `/a-004` スキルの実行を促す。

### 2. 一貫性チェックの実行

以下の 6 観点を自動検索（grep 等）と手動確認で検証する。詳細な観点・コマンドは [reference/consistency-checks.md](reference/consistency-checks.md) を参照。

- **2.1 ユーザーストーリー ↔ シナリオ**: US-XXX に対応する SC-XXX の存在、価値と結果の整合
- **2.2 実装済み/予定機能 ↔ シナリオ**: リグレッション用/優先度 High のカバレッジ
- **2.3 非機能要件 ↔ ドメインモデル**: 性能要件（Read Model）、セキュリティ（Policy/Guard）
- **2.4 シナリオ ↔ ドメインモデル**: Command / Event / Actor の対応
- **2.5 ユビキタス言語**: 主要要素の登録、禁止用語の検出
- **2.6 目的との整合性**: システム目的と Core Domain の一致

### 3. レビュー結果レポートの作成

検出された問題（Error / Warning / OK）をまとめ、`docs/project/REVIEW-REPORT-YYYYMMDDHHMMSS.md` を作成する。フォーマットは [examples/review-report-template.md](examples/review-report-template.md#レポートフォーマット) を参照。

必須セクション:

- サマリー（OK / Warning / Error の件数）
- 詳細（上記 6 観点ごとの結果）
- 推奨アクション（修正すべきタスクとスキル参照）

### 4. 結果の報告と修正提案

- レポート内容を要約してユーザーに伝える。
- 重大なエラー（Error）がある場合は優先修正を提案。
- 「修正作業を開始しますか？それともレポートを Git に保存して終了しますか？」

### 5. Git への追加（任意）

```bash
git add docs/project/REVIEW-REPORT-*.md
git commit -m "docs: 要件・ドメイン整合性レビューレポートの作成"
```

## 完了条件

- `docs/project/REVIEW-REPORT-YYYYMMDDHHMMSS.md` が作成されている。
- 全ドキュメント間の整合性がチェックされ、結果（OK/Warning/Error）が記録されている。
- 具体的な修正アクションが提案されている。

## エスカレーション

- **多数のエラーが検出された**: 「不整合が多くドキュメント信頼性が低下しています。関係者を集めた大規模レビュー会議を推奨します。」
- **Core Domain で不整合**: 「Core Domain における不整合はリスクが高いです。実装前に必ず解消してください。」
- 判断材料の詳細は [reference/consistency-checks.md](reference/consistency-checks.md#エスカレーションの判断材料) を参照。

## 参考

- [examples/review-report-template.md](examples/review-report-template.md) — レビュー結果レポートのフォーマット例と重大度記号
- [reference/consistency-checks.md](reference/consistency-checks.md) — 6 観点の詳細なチェック項目、grep コマンド例、エスカレーション基準
