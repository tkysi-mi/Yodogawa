# 一貫性チェック項目詳細

SKILL.md 手順2 で実施する各チェック項目の詳細。自動検索（grep 等）と手動確認を組み合わせる。

## 2.1 ユーザーストーリー ↔ シナリオ

- **カバレッジ**: すべての US-XXX に対応する SC-XXX が存在するか。
- **整合性**: ストーリーの「価値」とシナリオの「結果（Then）」が一致しているか。

```bash
# 全ユーザーストーリーの ID 抽出
grep -oE "US-[0-9]+" docs/project/requirements/05-user-stories.md | sort -u
# シナリオ側の参照
grep -oE "US-[0-9]+" docs/project/behavior/01-scenarios.md | sort -u
```

## 2.2 実装済み機能・予定機能 ↔ シナリオ

- **実装済み機能**: `02-features-implemented.md` の機能にリグレッション用シナリオが存在するか。
- **予定機能**: `03-features-planned.md` の優先度 High 機能にシナリオが存在するか。

## 2.3 非機能要件 ↔ ドメインモデル

- **パフォーマンス**: `04-non-functional-requirements.md` の要件（読み込み速度、スループット等）に対し、Read Model や CQRS が検討されているか。
- **セキュリティ**: 認証・権限要件が Policy や Guard としてドメインモデルに含まれているか。

## 2.4 シナリオ ↔ ドメインモデル

- **Command**: シナリオの When（アクション）がドメインモデルの Command として定義されているか。
- **Event**: シナリオの Then（結果）が Domain Event として定義されているか。
- **Actor**: シナリオの Actor がドメインモデルに存在するか。

## 2.5 ユビキタス言語の遵守

- **用語定義**: ドメインモデルの主要要素（Aggregate, Command, Event）がユビキタス言語一覧にあるか。
- **禁止用語**: 各ドキュメントに禁止用語（Data, Process, Manager 等）が使われていないか。

```bash
# 禁止用語の簡易検索
grep -rn "Data" docs/project/domain/ || echo "No 'Data' found"
grep -rn "Process" docs/project/domain/ || echo "No 'Process' found"
grep -rn "Manager" docs/project/domain/ || echo "No 'Manager' found"
```

## 2.6 目的との整合性

- システム概要（`01-system-overview.md`）の「目的」とドメインモデルの「Core Domain」が一致しているか。
- ビジネス価値の提供元が Core に寄っているか（Generic に偏っていないか）。

## エスカレーションの判断材料

- **多数の Error が検出された場合**: ドキュメント信頼性が低い → 関係者を集めた大規模レビュー会議を推奨。
- **Core Domain での不整合**: リスクが高い → 実装前に必ず解消。

## Git への追加（任意）

```bash
git add docs/project/REVIEW-REPORT-*.md
git commit -m "docs: 要件・ドメイン整合性レビューレポートの作成"
```
