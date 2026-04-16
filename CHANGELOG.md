# 変更履歴

このプロジェクトのすべての重要な変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/spec/v2.0.0.html) に準拠しています。

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
