# ドキュメント構造と整合性チェック

SKILL.md 手順5（整合性検証）とベストプラクティスで参照する詳細資料。

## ドキュメント整合性の検証項目

### クロスリファレンスの確認

- [ ] **要件 ↔ ドメインモデル**: features-implemented.md の機能が domain-model.md に反映されているか
- [ ] **ドメインモデル ↔ データモデル**: domain-model.md のエンティティが data-model.md のテーブルに対応しているか
- [ ] **ドメインモデル ↔ API 仕様**: domain-model.md の振る舞いが api-spec.md のエンドポイントに対応しているか
- [ ] **API 仕様 ↔ 実装**: api-spec.md のエンドポイントが実際に実装されているか
- [ ] **データモデル ↔ 実装**: data-model.md のテーブル定義がマイグレーションファイルと一致しているか

### 用語の一貫性確認

- [ ] ドキュメント全体で同じ用語を使用しているか
- [ ] ubiquitous-language.md に記載された用語が各ドキュメントで使用されているか
- [ ] コード内のクラス名・変数名がドメイン用語と一致しているか

### リンク切れの確認

- [ ] 内部リンクが正しいパスを指しているか
- [ ] 参照先のドキュメント・セクションが存在するか

## ドキュメント品質のレビュー観点

- [ ] **正確性**: 実装内容と一致しているか
- [ ] **完全性**: すべての変更が記載されているか
- [ ] **明確性**: 第三者が理解できる内容か
- [ ] **一貫性**: ドキュメント間で用語・形式が統一されているか
- [ ] **最新性**: 古い情報が削除されているか

## ベストプラクティス

- **実装直後に更新**: 記憶が新しいうちに記録する
- **差異を記録**: 計画と実装の差異は必ず記録し、次のタスクへのフィードバックとする
- **スクリーンショット活用**: UI 変更の場合、スクリーンショットを添付して視覚的に記録
- **リンクを活用**: ドキュメント間でリンクを張り、関連情報にすぐアクセスできるようにする
- **バージョン管理**: ドキュメントもコードと同様に Git で管理
- **段階的更新**: 大規模な更新は段階的に行い、一度に全てを更新しない
- **レビューを受ける**: 重要な更新はチームレビューで正確性を担保
- **テンプレート活用**: 繰り返し更新するドキュメントはテンプレート化
- **自動化**: 可能な部分は自動化（API ドキュメント生成、データモデル図生成など）
- **定期的な棚卸し**: ドキュメント全体を定期的にレビューし古い情報を削除

## ドキュメント構造の参考

### タスクレベル（`docs/tasks/task{id}-{スラッグ}/`）

- `a-definition.md`: タスク定義（目的、ユーザーストーリー、受け入れ基準）
- `b-research.md`: リサーチ（ベストプラクティス、技術選定）
- `c-implementation.md`: 実装タスクリスト（フェーズ、ステップ）

### プロジェクトレベル（`docs/`）

- `01-requirements/`: 要件定義
  - `02-features-implemented.md`: 実装済み機能
  - `03-features-planned.md`: 計画中機能
  - `05-user-stories.md`: ユーザーストーリー
- `03-domain/`: ドメイン
  - `01-domain-model.md`: ドメインモデル
  - `02-ubiquitous-language.md`: ユビキタス言語
- `04-design/`: 設計
  - `03-screen-design.md`: 画面設計
  - `04-data-model.md`: データモデル
  - `05-api-spec.md`: API 仕様
  - `06-architecture.md`: アーキテクチャ

### その他

- `README.md`: プロジェクト概要、セットアップ手順
- `CHANGELOG.md`: 変更履歴
- `.env.example`: 環境変数テンプレート

## 自動化のヒント

将来的に、以下のスクリプトでドキュメント更新を一部自動化することを検討：

- `scripts/update-docs.sh`: コミットログから変更内容を抽出してドラフトを作成
- `scripts/generate-api-docs.sh`: コードから API 仕様書を生成

## コミットメッセージのテンプレート

```
docs(task-{task-id}): update documentation for {機能名}

Task-level documentation:
- Update a-definition.md with implementation results
- Update b-research.md with discovered best practices
- Update c-implementation.md with implementation notes and retrospective

Project-level documentation:
- Add {機能名} to features-implemented.md
- Update domain-model.md / data-model.md / api-spec.md
- Update README.md with setup instructions
- Add changelog entry

Related: task{task-id}-{スラッグ}
```
