# 一貫性チェック項目詳細

SKILL.md 手順2 で実施する各チェック項目の詳細。自動検索（grep 等）と手動確認を組み合わせる。

## 2.1 ユーザーストーリー ↔ シナリオ

- **カバレッジ**: すべての US-XXX に対応する SC-XXX が存在するか。
- **整合性**: ストーリーの「価値」とシナリオの「結果（Then）」が一致しているか。

```bash
# 全ユーザーストーリーの ID 抽出
grep -oE "US-[0-9]+" docs/project/01-requirements/05-user-stories.md | sort -u
# シナリオ側の参照
grep -oE "US-[0-9]+" docs/project/02-behavior/01-scenarios.md | sort -u
```

## 2.2 MVP スコープ・実装済み機能 ↔ シナリオ

- **MVP スコープ**: `02-mvp-scope.md` の Must 機能にシナリオが存在するか。
- **実装済み機能**: `06-features-implemented.md`（existing モード）の機能にリグレッション用シナリオが存在するか。
- **Parking Lot**: `03-parking-lot.md` は backlog のためシナリオ必須ではない（MVP 昇格時に MVP スコープ側で扱う）。

## 2.3 クリティカル制約 ↔ スコープ/ドメイン

初期フェーズでは定量 NFR ではなく、Product Brief の「クリティカル制約」を確認する（詳細な定量 NFR は設計フェーズ `/a-014-define-infrastructure` の責務）。

- **制約の反映**: `01-product-brief.md` のクリティカル制約（法務・セキュリティ・期限・予算・外部 API 等）が `02-mvp-scope.md` の Must 判断やドメインモデルに反映されているか。
- **セキュリティ・権限**: 制約に挙げた認証・権限要件が Policy や Guard としてドメインモデルに含まれているか。

## 2.4 シナリオ ↔ ドメインモデル

- **Command**: シナリオの When（アクション）がドメインモデルの Command として定義されているか。
- **Event**: シナリオの Then（結果）が Domain Event として定義されているか。
- **Actor**: シナリオの Actor がドメインモデルに存在するか。

## 2.5 ユビキタス言語の遵守

- **用語定義**: ドメインモデルの主要要素（Aggregate, Command, Event）がユビキタス言語一覧にあるか。
- **禁止用語**: 各ドキュメントに禁止用語（Data, Process, Manager 等）が使われていないか。

```bash
# 禁止用語の簡易検索
grep -rn "Data" docs/project/03-domain/ || echo "No 'Data' found"
grep -rn "Process" docs/project/03-domain/ || echo "No 'Process' found"
grep -rn "Manager" docs/project/03-domain/ || echo "No 'Manager' found"
```

## 2.6 目的との整合性

- Product Brief（`01-product-brief.md`）の「価値提案 / 差別化」とドメインモデルの「Core Domain」が一致しているか。
- ビジネス価値の提供元が Core に寄っているか（Generic に偏っていないか）。

## 2.7 MVP 正当化 / 過剰作り込み（YAGNI / PM Gate）

「要らないものを作らない」を守るためのスコープ妥当性検査。

- **Must の trace**: `02-mvp-scope.md` の各 Must 機能が、Product Brief の 課題 / ターゲット（ペルソナ）/ 成功指標 / 検証仮説 のいずれかに紐づくか。**いずれにも trace しない Must は過剰作り込み候補としてフラグ**する。
- **Out of Scope の矛盾**: `02-mvp-scope.md` の Won't / Out of Scope に挙げた機能が、他ドキュメント（シナリオ・ドメインモデル・`05-user-stories.md`）で実装対象として記述されていないか。
- **安い代替手段**: 手作業・既存ツール・外部サービスで足りるものが Must になっていないか（`02-mvp-scope.md` の「より安い代替手段」列を確認）。
- **成功指標 ↔ 目的**: `01-product-brief.md` の成功指標が「価値提案 / 解く課題」と整合しているか。
- **仮説の数**: 検証する仮説が 1〜3 個に絞れているか（多すぎる＝MVP が過大）。

```bash
# Out of Scope（Won't）に挙げた機能名が他 doc に混入していないか（例）
grep -rn "{Won't機能名}" docs/project/02-behavior/ docs/project/03-domain/
```

## エスカレーションの判断材料

- **多数の Error が検出された場合**: ドキュメント信頼性が低い → 関係者を集めた大規模レビュー会議を推奨。
- **Core Domain での不整合**: リスクが高い → 実装前に必ず解消。

## Git への追加（任意）

```bash
git add docs/project/REVIEW-REPORT-*.md
git commit -m "docs: 要件・ドメイン整合性レビューレポートの作成"
```
