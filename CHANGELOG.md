# 変更履歴

このプロジェクトのすべての重要な変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/spec/v2.0.0.html) に準拠しています。

## [2.1.4] - 2026-06-23

### 修正

- **クロス IDE 互換の記述を正確化**: README / CLAUDE.md が「全 IDE が SKILL.md 標準に収束しており配置するだけで動作する」と読める断定を緩和し、中核フォーマット（`name` / `description` ＋ Markdown 本文）と Claude Code 向け拡張フィールド（`disable-model-invocation` / `allowed-tools` / `argument-hint` / `context: fork`）を区別、他 IDE での扱いは各 IDE 仕様に依存し未検証であることを明記しました。あわせて `allowed-tools` の適用範囲を正確化（22 スキル中 21、`c-001-implement-task` は未指定）し、`context: fork` をレビュー系スキルに採用した意図を README「設計上の決定」に追記しました（#12）。

## [2.1.3] - 2026-06-22

### 修正

- **スキル参照の採番ズレと旧 PascalCase 名を修正**: ドキュメント生成スキル（`c-001-implement-task` / `b-005-review-task`）と配布テンプレート（`templates/tasks/task-template/`）に残っていた、1つ手前のスキルを指す採番ズレと、kebab-case でないと解決しない旧 PascalCase スラッシュ名（`/c-001-ImplementTask` 等）を正しいスキル名・採番へ修正しました（#4）。`templates/` は利用者へ配布されるため、誤ったスキル実行への誘導が解消されます。

## [2.1.2] - 2026-06-16

### 削除

- **孤立テンプレートの削除**: どのスキルからも参照されず、内容も実構造（`templates/project/**` の各テンプレート）と乖離していた `templates/documentation-rules.md` を削除しました。各ドキュメントに記載する内容は各テンプレートファイル本体が単一の情報源（Single Source of Truth）です。

## [2.1.1] - 2026-04-19

### 追加

- **タスク/要件ドキュメント初期化のスクリプト化**: 決定論的な処理（ID 採番・形式チェック・テンプレートコピー）をシェルスクリプトに切り出し、各スキルの SKILL.md を判断ステップに集中させました。
  - `b-001-create-task-directory`: タスクディレクトリ作成（ID 採番・mkdir）を `scripts/create-task.sh` に集約。
  - `b-002/003/004`: タスク 3 ドキュメント（definition/research/implementation）の初期化を `scripts/init-task-doc.sh` に統一（既存ファイルはスキップする冪等設計）。
  - `a-002-initialize-project`: 要件定義テンプレートの一括コピーを `scripts/init-project-docs.sh` に集約（category 引数で requirements/behavior/domain/design を切り替え、冪等）。
- **MIT LICENSE の追加**: `package.json` が `npm init` 既定の ISC のままで README の想定と齟齬があったため、MIT LICENSE 本文をルートに追加し、`package.json` を MIT に修正、README にライセンス節を追記しました。

### 変更

- **`docs/project` のパス参照を番号付きディレクトリに統一**: スキル内のパス参照を `setup-docs.sh` が生成する番号付き構造（`01-requirements/` / `02-behavior/` / `03-domain/` / `04-design/`）に揃え、フェーズ順の可読性を維持しました。

### 修正

- **SKILL.md の配置先表記を `.claude`/`.agents` の 2 択に統一**: CLI リファクタで配置先が簡素化された後も旧表記（`.agent` / `.cursor` / `.codex`）が残っていた 15 スキル＋1 リファレンスを現行仕様に揃えました。
- **`create-task.sh` の非対話実行での破綻を修正**: 非 TTY 環境で単語数確認プロンプト（`read -p`）が `set -e` 下の EOF により即時 `exit 1` となる問題と、終了コード契約の矛盾を解消し、警告のみ残して続行する形にしました。
- **`c-001-implement-task` の前提スキル参照を現行名に修正**: 旧名 `/b-000-CreateTaskDirectory` を現行の `/b-001-create-task-directory` に置き換えました。

## [2.1.0] - 2026-04-16

### 変更

- **CLI の配置先を 2 択に簡素化**: Cursor / Codex / Antigravity が Claude Code の SKILL.md 標準に収束したため、インストール先ディレクトリを `.claude/`（Claude Code 用）と `.agents/`（その他 3 IDE 共通）の 2 つに統合しました。
  - 既存ユーザーへの影響: Cursor / Codex / Antigravity をお使いの場合、旧バージョンで作成された `.cursor/` / `.codex/` / `.agent/` は削除し、本バージョンで `.agents/` に再インストールしてください。
- **用語統一**: スキル本文で「ワークフロー」と「スキル」が混在していた箇所を「スキル」に統一しました（Phase 4）。
- **`c-001-implement-task` に検証ループを追加**: 各ステップ実行後に型チェック・Lint・ユニットテスト・ビルドを自動実行し、失敗時は最大 3 回まで原因分析と修正を繰り返す仕組みを明文化しました。

### 追加

- **Claude Code Skill 高度機能の活用**: 全 22 スキルに以下のフロントマターフィールドを追加しました（Phase 5）。
  - `allowed-tools`: 各スキルに必要な最小限のツール権限を明示
  - `argument-hint`: タスク系スキルでコマンド引数（`[task-id]` 等）の使い方を明示
  - `context: fork`: レビュー系スキル（`a-006` / `a-015` / `b-005`）でコンテキストを分離
- **`b-001-create-task-directory` で `$ARGUMENTS` をサポート**: `/b-001 auth-login` のように引数でスラッグを渡せるようになりました。
- **`c-001-implement-task` に検証ループの参考資料を追加**: `reference/validation-loop.md` として検証フロー・コマンド表・エスカレーション基準を整備しました。

### 内部

- `.gitignore` に Yodogawa CLI のローカルインストール出力ディレクトリ（`.agents/` / `.agent/` / `.cursor/` / `.codex/`）を追加。

## [2.0.0] - 2026-04-16

### 破壊的変更

- **スキル形式への全面移行**: 旧 `workflows/*.md` 形式を廃止し、Claude Code の SKILL.md 標準（`skills/{name}/SKILL.md`）に全面移行しました。各スキルは YAML frontmatter（`name` / `description`）と 6 セクション構成（目的 / 前提 / 手順 / 完了条件 / エスカレーション / 参考）を持ちます。
- **Windsurf のサポートを終了**: Windsurf はアクティブメンテナンスが停止しているため、公式サポート対象から外しました。
- **Progressive disclosure パターンの採用**: 長文スキルを `SKILL.md` + `examples/` + `reference/` に分割し、12,000 文字のワークフロー上限に収まるよう最適化しました。

### 追加

- **Codex のサポート**: OpenAI Codex (`.codex/`) を新たにサポート対象に追加しました。

### 変更

- **README をスキルフォーマットに合わせて全面書き換え**。
- `bin` フィールドのパスを `npm pkg fix` で修正。

## [1.0.7] - 2026-01-27

### 追加

- **CHANGELOG**: 変更履歴ファイルを追加し、npmパッケージに含めるようにしました。

## [1.0.6] - 2026-01-27

### 追加

- **新ワークフロー**: デザインシステム定義用の `a-010-DefineDesignSystem.md` を追加しました（カラー、タイポグラフィ、スペーシング等）。
- **新テンプレート**: デザインシステム定義用のテンプレート `04-design-system.md` を追加しました。

### 変更

- **ワークフロー番号の再編成**: 新しいデザインシステムワークフローに合わせて、既存の設計ワークフローの番号を更新しました：
  - `a-010-DefineDataModel` -> `a-011-DefineDataModel`
  - `a-011-DefineAPISpec` -> `a-012-DefineAPISpec`
  - `a-012-DefineArchitecture` -> `a-013-DefineArchitecture`
  - `a-013-DefineInfrastructure` -> `a-014-DefineInfrastructure`
  - `a-014-ReviewDesign` -> `a-015-ReviewDesign`
- **テンプレート参照**: 再編成に伴い、すべてのワークフローファイル内のテンプレート参照と前提ドキュメントのパスを更新しました。

## [1.0.5] - 2026-01-27

### 変更

- **メタデータ**: npmでの検索性を向上させるため、`package.json` のキーワードを更新しました（`bdd`, `ddd`, `ai-coding` 等を追加）。

## [1.0.4] - 2026-01-27

### 変更

- **ドキュメント**: README.md をリファクタリングし、より明確でシンプルなセクションタイトルに変更しました。
- **クリーンアップ**: パッケージを軽量化するため、未使用の `x-` シリーズワークフロー（`x-Dependencies-Update` 等）を削除しました。
- **パッケージ**: npmパッケージに `README.md` が含まれるように修正しました。
