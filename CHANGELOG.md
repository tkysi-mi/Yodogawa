# 変更履歴

このプロジェクトのすべての重要な変更はこのファイルに記録されます。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に基づいており、
このプロジェクトは [Semantic Versioning](https://semver.org/lang/ja/spec/v2.0.0.html) に準拠しています。

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
