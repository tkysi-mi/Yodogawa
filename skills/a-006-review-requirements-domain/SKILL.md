---
name: a-006-review-requirements-domain
description: 要件定義からドメインモデルまでのドキュメント間の一貫性をチェックし、不整合や漏れを検出するレビューワークフロー
auto_execution_mode: 1
---

# ReviewRequirementsDomain (a-006)

## 目的

- ここまでに作成されたすべてのドキュメント間の一貫性を体系的にチェックする。
- ドキュメント間の不整合、漏れ、矛盾を検出し、修正提案を提供する。
- ユビキタス言語の遵守状況を確認し、用語の一貫性を保証する。
- レビュー結果レポートを作成し、修正すべき項目を優先度付きでリストアップする。

## 前提

- 以下のドキュメントが作成されていること：
  - `docs/project/requirements/01-system-overview.md`
  - `docs/project/requirements/02-features-implemented.md`
  - `docs/project/requirements/03-features-planned.md`
  - `docs/project/requirements/04-non-functional-requirements.md`
  - `docs/project/requirements/05-user-stories.md`
  - `docs/project/behavior/01-scenarios.md`
  - `docs/project/domain/01-domain-model.md`
  - `docs/project/domain/02-ubiquitous-language.md`

## 手順

### 1. ドキュメント存在確認

- 必要なすべてのドキュメントが存在するか確認する：

  ```bash
  ls -l docs/project/requirements/*.md docs/project/behavior/*.md docs/project/domain/*.md
  ```

- 不足しているドキュメントがある場合、対応するワークフロー（a-002, a-003, a-004）の実行を促す。

### 2. 一貫性チェックの実行

以下の項目について、自動検索（grep等）と手動確認を組み合わせて検証する。

#### 2.1 ユーザーストーリー ↔ シナリオ

- **カバレッジ**: すべてのユーザーストーリー（US-XXX）に対応するシナリオ（SC-XXX）が存在するか。
- **整合性**: ストーリーの「価値」とシナリオの「結果」が一致しているか。

#### 2.2 実装済み機能・予定機能 ↔ シナリオ

- **実装済み機能**: `02-features-implemented.md` に記載の機能に、リグレッションテスト用のシナリオが存在するか。
- **予定機能**: `03-features-planned.md` の優先度High機能にシナリオが存在するか。

#### 2.3 非機能要件 ↔ ドメインモデル

- **パフォーマンス**: `04-non-functional-requirements.md` の要件（読み込み速度など）に対し、Read ModelやCQRSが検討されているか。
- **セキュリティ**: 認証・権限要件が Policy や Guard としてドメインモデルに含まれているか。

#### 2.4 シナリオ ↔ ドメインモデル

- **Command**: シナリオのWhen（アクション）がドメインモデルのCommandとして定義されているか。
- **Event**: シナリオのThen（結果）がドメインモデルのDomain Eventとして定義されているか。
- **Actor**: シナリオのActorがドメインモデルに存在するか。

#### 2.5 ユビキタス言語の遵守

- **用語定義**: ドメインモデルの主要要素（Aggregate, Command, Event）がユビキタス言語一覧にあるか。
- **禁止用語**: 各ドキュメントに禁止用語（Data, Process等）が使われていないか。

  ```bash
  # 禁止用語の簡易検索（例）
  grep -r "Data" docs/project/domain/ || echo "No 'Data' found"
  grep -r "Process" docs/project/domain/ || echo "No 'Process' found"
  ```

#### 2.6 目的との整合性

- システム概要の「目的」と、ドメインモデルの「Core Domain」が一致しているか。

### 3. レビュー結果レポートの作成

- 検出された問題（Error/Warning）をまとめ、`docs/project/REVIEW-REPORT.md` を作成する。

**レポートフォーマット例**:

```markdown
# ドキュメント一貫性レビュー結果
**実施日**: YYYY-MM-DD

## サマリー
- ✅ OK: X項目
- ⚠️ Warning: X項目
- ❌ Error: X項目

## 詳細

### 1. ユーザーストーリー ↔ シナリオ
- ❌ **Error**: US-005 に対応するシナリオが見つかりません。
- ✅ OK: 優先度Highのストーリーはすべてカバーされています。

### 2. 機能要件・非機能要件
- ⚠️ **Warning**: 実装済み機能「決済」のシナリオが不足しています。
- ✅ OK: パフォーマンス要件に対応するRead Modelが定義されています。

### 3. シナリオ ↔ ドメインモデル
- ⚠️ **Warning**: シナリオSC-003のCommand「在庫を引き当てる」がドメインモデルに未定義です。

### 4. ユビキタス言語
- ❌ **Error**: 用語「ShippingAddress」がユビキタス言語一覧にありません。
- ⚠️ **Warning**: 禁止用語「User Data」が `01-domain-model.md` で使用されています。

## 推奨アクション
1. `CreateScenarios` (a-003) で US-005 のシナリオを追加する。
2. `DefineDomainModel` (a-004) で「在庫を引き当てる」コマンドを定義する。
3. `01-domain-model.md` の「User Data」を「User Profile」に修正する。
```

### 4. 結果の報告と修正提案

- ユーザーにレポートの内容を要約して伝える。
- 重大なエラー（❌）がある場合は、優先的に修正することを提案する。
- 「修正作業を開始しますか？それともレポートをGitに保存して終了しますか？」

### 5. Git への追加（オプション）

- ユーザーが希望する場合、レポートをコミットする。

  ```bash
  git add docs/project/REVIEW-REPORT--YYYYMMDDHHMMSS.md
  git commit -m "docs: 要件・ドメイン整合性レビューレポートの作成"
  ```

## 完了条件

- `docs/project/REVIEW-REPORT.md` が作成されている。
- 全ドキュメント間の整合性がチェックされ、結果（OK/Warning/Error）が記録されている。
- 具体的な修正アクションが提案されている。

## エスカレーション

- 多数のエラーが検出された場合：
  - 「不整合が多いため、ドキュメントの信頼性が低くなっています。関係者を集めて大規模なレビュー会議を行うことを推奨します。」
- 重要機能（Core Domain）で不整合がある場合：
  - 「Core Domainにおける不整合はリスクが高いです。実装前に必ず解消してください。」
