# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリの目的

Windsurfで活用するスラッシュコマンドとワークフローの保管庫。開発ライフサイクル全般（調査・要件定義・設計・実装・テスト・Git運用）を対象としたMarkdownベースのワークフロー定義を蓄積し、他プロジェクトでも即座に呼び出せるナレッジベースを構築する。

## アーキテクチャ概要

### ディレクトリ構造

- `.windsurf/workflows/` — Windsurfスラッシュコマンドの実体。各Markdownファイルがコマンド定義になる
  - `a-NNN-*.md` — プロジェクト設計ワークフロー（要件定義、設計、アーキテクチャ）
  - `b-NNN-*.md` — タスク管理ワークフロー（タスク作成、リサーチ、実装計画）
  - `c-NNN-*.md` — 実装実行ワークフロー（ステップバイステップ実装）
  - `x-Object-Action.md` — 補助的なワークフロー（例: `x-Code-Refactor`, `x-Repository-PushToGithub`, `x-CI-Setup`）
  - `z-*.md` — メタワークフロー（ワークフロー作成支援など）
- `.windsurf/templates/` — 再利用可能なテンプレート
  - `project/` — プロジェクトレベルのテンプレート
  - `tasks/task-template/` — タスクレベルのテンプレート（a-definition.md, b-research.md, c-implementation.md）
- `docs/tasks/` — 実プロジェクトでのタスク管理ディレクトリ（各プロジェクトで作成）
  - `task000001-{スラッグ}/` — 個別タスクディレクトリ（定義、リサーチ、実装タスクリスト）
- `slash-commands-best-practices.md` — ワークフロー作成の設計原則・セキュリティ・運用ガイドライン

### ワークフロー体系

**A系列：プロジェクト設計ワークフロー**

- `/a-001-SetupDocStructure` — プロジェクトドキュメント構造のセットアップ
- `/a-002-InitializeProject` — プロジェクト初期化（課題、解決策、スコープ）
- `/a-003-CreateScenarios` — BDD形式でのシナリオ定義（Gherkin）
- `/a-004-DefineDomainModel` — ドメインモデル定義（Event Storming）
- `/a-005-CreateDomainDiagram` — DDD設計（Bounded Context、Aggregate）
- `/a-006-ReviewRequirementsDomain` — 要件とドメインモデルのレビュー
- `/a-007-DefineTechStack` — 技術スタック選定
- `/a-008-DefineRepositoryStructure` — リポジトリ構造定義
- `/a-009-DefineScreenDesign` — 画面設計（Empty State重視）
- `/a-010-DefineDataModel` — データモデル設計（ERD）
- `/a-011-DefineAPISpec` — API仕様定義
- `/a-012-DefineArchitecture` — アーキテクチャ設計（ADR）
- `/a-013-DefineInfrastructure` — インフラ設計（RPO/RTO）
- `/a-014-ReviewDesign` — 設計ドキュメントの一貫性レビュー

**B系列：タスク管理ワークフロー**

- `/b-000-CreateTaskDirectory` — タスクディレクトリ作成（task000001-xxx形式）
- `/b-001-CreateTaskDefinition` — タスク定義（目的、ユーザーストーリー、受け入れ基準）
- `/b-002-CreateTaskResearch` — リサーチ（ベストプラクティス、既存コード調査）
- `/b-003-CreateTaskImplementation` — 実装計画（フェーズ、ステップ、受け入れ基準）
- `/b-004-ReviewTask` — タスクドキュメントの一貫性レビュー

**C系列：実装実行ワークフロー**

- `/c-001-ImplementTask` — タスク実装実行（speckit.implementスタイル）
- `/c-002-UpdateDocumentation` — 実装完了後のドキュメント更新（タスク・プロジェクトレベル）

**X系列：補助的なワークフロー（Object-Action形式）**

- `/x-Context-CatchUp` — プロジェクト状況の把握
- `/x-Requirements-Clarify` — 要件の明確化
- `/x-Repository-PushToGithub` — GitHub へのプッシュ
- `/x-Code-Refactor` — リファクタリング支援
- `/x-Code-ResearchAndReview` — コードレビュー
- `/x-Problem-RootCauseAnalysis` — 根本原因分析
- `/x-CI-Setup` — CI/CD セットアップ
- `/x-CI-FixFailure` — CI 失敗修正
- `/x-Logging-Add` — ログ実装
- `/x-Dependencies-Update` — 依存関係更新
- `/x-DevEnvironment-Setup` — 開発環境セットアップ
- `/x-Component-Create` — コンポーネント生成
- `/x-Migration-Create` — マイグレーション作成
- `/x-Database-Seed` — データベースシード
- `/x-Bundle-Optimize` — バンドル最適化
- `/x-Accessibility-Check` — アクセシビリティ監査

**Z系列：メタワークフロー**

- `/z-CreateWorkflow` — 新規ワークフロー作成支援

### タスク管理ワークフローの詳細

タスクの計画から実装まで、spec-kit（GitHub）にインスパイアされた体系的なワークフローを提供：

**ディレクトリ構造**: `docs/tasks/task000001-{スラッグ}/`

- タスクIDは6桁ゼロパディング（task000001, task000002, ...）
- 各タスクに3つのドキュメント（a-definition.md, b-research.md, c-implementation.md）

**実行フロー**:

1. **b-000**: タスクディレクトリ作成とテンプレートコピー
2. **b-001**: タスク定義（目的、ユーザーストーリー、受け入れ基準を明確化）
3. **b-002**: リサーチ（ベストプラクティス調査、既存コード分析、技術選定、リスク評価）
4. **b-003**: 実装計画（フェーズ分割、ステップ定義、受け入れ基準）
5. **b-004**: タスクレビュー（実装開始前の品質保証）
   - タスク定義 ↔ 実装計画の一貫性チェック
   - リサーチ ↔ 実装計画の整合性検証
   - 変更内容カバレッジ、ユーザーストーリーカバレッジ確認
   - 技術選定の反映、リスク軽減策の確認
   - TASK-REVIEW-REPORT.md 生成、実装開始可否の判定
6. **c-001**: 実装実行（speckit.implementスタイル）
   - ステップバイステップ実行
   - 依存関係の尊重、並列実行の最適化（`[P]`マーク）
   - 各ステップでテスト実行、チェックボックス自動更新
   - フェーズごとの受け入れ基準確認
   - 最終テスト、コミット、PR作成
7. **c-002**: ドキュメント更新（実装完了後）
   - タスクドキュメント更新（a-definition.md, b-research.md, c-implementation.md）
   - プロジェクトドキュメント更新（features-implemented, domain-model, api-spec, data-model）
   - 計画と実装の差異記録、振り返り
   - README, CHANGELOG, .env.example 更新
   - ドキュメント整合性確認、コミット

**speckit.implement との対応**:

- constitution → タスク定義（a-definition.md）
- specification → タスク定義+リサーチ（a-definition.md + b-research.md）
- implementation plan → 実装タスクリスト（c-implementation.md）
- tasks.md 解析 → c-implementation.md のフェーズ/ステップ解析
- 依存関係の尊重 → ステップの順序確認
- 並列実行の最適化 → `[P]` マーク識別
- TDD アプローチ → 各ステップでのテスト実行
- ローカル CLI コマンド実行 → Bash ツールでコマンド実行

### 設計哲学

- **Markdown中心**: 実行可能コードは含めず、Windsurfのコマンド参照に特化
- **コンテキスト最適化**: 12,000文字制限を意識し、長文資料は`@path/to/file.md`形式で参照
- **チェイン構築**: ワークフロー間で`Call /workflow-name`により連携可能な粒度で分割
- **Spec-Driven Development**: spec-kitの思想を取り入れ、仕様が実行可能なブループリントとして機能
- **BMAD Method適用**: Analyst/PM/Architect/Devなど多層エージェント計画の考え方を反映
- **Claude-Flowスキル活用**: pair-programming、agentdb-vector-searchなど外部スキルの組み込み前提

## ワークフロー作成の基本手順

新規ワークフローを追加する際は、`@slash-commands-best-practices.md`の原則に従う：

1. **命名規約**: `.windsurf/workflows/`配下に用途が即座に想起できる短いスラッグ（例: `build-and-test.md`）
2. **セクション構成**: 目的 / 前提 / 手順 / 完了条件 / エスカレーション
3. **YAML frontmatterは使用しない**: Markdown本文のみで完結
4. **ステップ記法**: 番号付きまたは箇条書きで明示、分岐は「IF ... THEN ...」、反復は「FOR EACH ...」
5. **依存ワークフロー**: 他ワークフローを呼ぶ場合は`Call /workflow-name`と明記
6. **コンテキスト節約**: 長文は`@path/to/doc.md`参照、ワークフロー本文は必要最小限に

詳細は `/create-workflow` を実行するか `@slash-commands-best-practices.md` を参照。

## ワークフロー実行の前提条件

- Windsurfの`code_search`/`read_file`権限が適切に設定されていること
- 関連ドキュメント（PRD、設計書、チケット）が最新であること
- Git環境およびローカルテスト環境が整備されていること
- Memories/Rulesで危険なコマンド実行権限が適切に制限されていること

## 主要ファイルの役割

- `README.md` — リポジトリの使い方、ディレクトリ構成、タスク管理の使い方、更新ポリシー
- `CLAUDE.md` — Claude Code向けプロジェクト説明（ワークフロー体系、設計哲学）
- `slash-commands-best-practices.md` — ワークフロー設計のベストプラクティス集。公式ドキュメントとCursor/Claude Codeの知見を統合
- `.windsurf/templates/project/` — プロジェクトレベルのテンプレート（システム概要、PRDなど）
- `.windsurf/templates/tasks/task-template/` — タスクレベルのテンプレート
  - `a-definition.md` — タスク定義テンプレート
  - `b-research.md` — リサーチテンプレート
  - `c-implementation.md` — 実装タスクリストテンプレート

## 運用方針

- **DRY原則**: 重複・冗長な情報は統合し、参照形式で再利用
- **継続改善**: 実行後のフィードバックを定期的に反映し、ワークフロー品質を向上
- **セキュリティ**: Memories/Rulesで権限管理、監査ログ記録、レート制御を徹底
- **ドキュメント整備**: READMEに新規ワークフロー概要を追記し、チームへ周知

## Git運用

- ブランチ戦略は各プロジェクトのポリシーに従う（trunk-based推奨）
- コミットメッセージにはStory IDまたは課題番号を含める
- PR作成時はテンプレートを利用し、変更概要/テスト結果/影響範囲を明記

## クイックリファレンス

### プロジェクト開始時

1. `/a-001-SetupDocStructure` — ドキュメント構造セットアップ
2. `/a-002-InitializeProject` — プロジェクト初期化
3. `/a-003-CreateScenarios` → `/a-004-DefineDomainModel` — 要件定義とドメインモデル
4. `/a-007-DefineTechStack` → `/a-008-DefineRepositoryStructure` — 技術選定とリポジトリ構造

### タスク実装時

1. `/b-000-CreateTaskDirectory` — タスクディレクトリ作成
2. `/b-001-CreateTaskDefinition` — タスク定義
3. `/b-002-CreateTaskResearch` — リサーチ
4. `/b-003-CreateTaskImplementation` — 実装計画
5. `/c-001-ImplementTask` — 実装実行

### 日常作業

- `/x-Context-CatchUp` — プロジェクト状況把握
- `/x-Requirements-Clarify` — 要件明確化
- `/x-Code-ResearchAndReview` — コードレビュー
- `/x-Repository-PushToGithub` — GitHub プッシュ
- `/x-CI-Setup` — CI/CD セットアップ
- `/x-CI-FixFailure` — CI 失敗修正
- `/x-Dependencies-Update` — 依存関係更新

### 新規ワークフロー作成

- `/z-CreateWorkflow` — ワークフロー作成支援

## 参考リンク

- Windsurf公式: <https://docs.windsurf.com/windsurf/cascade/workflows>
- Claude Code公式: <https://docs.claude.com/en/docs/claude-code/slash-commands>
- spec-kit (GitHub): <https://github.com/github/spec-kit>
- BMAD Method / Claude-Flow関連資料は各ワークフロー内で適宜参照
