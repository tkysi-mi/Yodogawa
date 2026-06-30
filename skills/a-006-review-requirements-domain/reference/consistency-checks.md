# 一貫性チェック項目詳細

SKILL.md 手順2 で実施する各チェック項目の詳細。自動検索（grep 等）と手動確認を組み合わせる。

## 2.1 ユーザーストーリー ↔ Core Scenario

- **カバレッジ**: MVP Scope の Must 機能に対応する Core Scenario（Day 1 Happy Path）が存在するか。User Story は要約 AC、Core Scenario は実行時の主要行動という SSoT の住み分けを保つ（全 US を逐一シナリオ化しない）。
- **整合性**: ストーリーの「価値」と Core Scenario の「結果（Then）」が一致しているか。

```bash
# 全ユーザーストーリーの ID 抽出
grep -oE "US-[0-9]+" docs/project/01-requirements/05-user-stories.md | sort -u
# Core Scenario 側の対応 Must / フロー参照
grep -oE "FN-[0-9]+|CS-[0-9]+" docs/project/02-behavior/01-core-scenarios.md | sort -u
```

### ユーザーストーリーの役割 ↔ ペルソナ（trace）

- **役割が宙に浮かない**: `05-user-stories.md` の各ストーリーの「ペルソナ」列が、`01-product-brief.md` のペルソナ表で定義済みの ID（P-XXX）を参照しているか。**未定義のペルソナを参照する US はフラグ**する（役割の trace 切れ）。
- **逆方向（任意）**: どの US からも参照されない主要ペルソナがあれば、スコープ漏れか過剰ペルソナのどちらかとして確認する。

```bash
# US が参照するペルソナ ID のうち、Product Brief に未定義のもの（出力があれば trace 切れ）
comm -23 \
  <(grep -oE "P-[0-9]+" docs/project/01-requirements/05-user-stories.md | sort -u) \
  <(grep -oE "P-[0-9]+" docs/project/01-requirements/01-product-brief.md | sort -u)
```

## 2.2 MVP スコープ・実装済み機能 ↔ シナリオ

- **MVP スコープ**: `02-mvp-scope.md` の Must 機能にシナリオが存在するか。
- **実装済み機能**: `06-features-implemented.md`（existing モード）の機能にリグレッション用シナリオが存在するか。
- **Parking Lot**: `03-parking-lot.md` は backlog のためシナリオ必須ではない（MVP 昇格時に MVP スコープ側で扱う）。

## 2.3 クリティカル制約 ↔ スコープ/ドメイン

初期フェーズでは定量 NFR ではなく、Product Brief の「クリティカル制約」を確認する（詳細な定量 NFR は設計フェーズ `/a-014-define-infrastructure` の責務）。

- **制約の反映**: `01-product-brief.md` のクリティカル制約（法務・セキュリティ・期限・予算・外部 API 等）が `02-mvp-scope.md` の Must 判断やドメインモデルに反映されているか。
- **セキュリティ・権限**: 制約に挙げた認証・権限要件が Policy や Guard としてドメインモデルに含まれているか。

## 2.4 Core Scenario ↔ Domain Sketch

- **アクター**: Core Scenario のアクターが Domain Sketch の「アクター / 外部システム」に存在するか。
- **中核エンティティ**: Core Scenario が扱う対象が Domain Sketch の「中核エンティティ」に定義されているか。
- **重要ルール**: Critical Failure を防ぐルールが「重要なビジネスルール」に反映されているか。
- **Full DDD 採用時**: `01-domain-model.md` がある場合は、When→Command / Then→Event / Actor の対応も確認する。

## 2.5 ユビキタス言語の遵守

- **用語定義**: Domain Sketch の主要用語・中核エンティティ（Full DDD 採用時は Aggregate / Command / Event）がユビキタス言語一覧にあるか。
- **禁止用語**: 各ドキュメントに禁止用語（Data, Process, Manager 等）が使われていないか。

```bash
# 禁止用語の簡易検索
grep -rn "Data" docs/project/03-domain/ || echo "No 'Data' found"
grep -rn "Process" docs/project/03-domain/ || echo "No 'Process' found"
grep -rn "Manager" docs/project/03-domain/ || echo "No 'Manager' found"
```

## 2.6 目的との整合性

- Product Brief（`01-product-brief.md`）の「価値提案 / 差別化」が Domain Sketch の「中核エンティティ」「重要なビジネスルール」に反映されているか。
- **価値提案の充足**: 「価値提案 / 差別化」のバリュープロポジション（1文）と差別化ポイント（Why us）が埋まり、Why us が「現在の代替手段・競合スキャン」表の各「弱み」と対応づいているか（漠然と「使いやすい」で済ませていないか）。
- **目的 ↔ 成功指標**: Product Brief の成功指標（North Star / KPI / Guardrail）が「価値提案 / 解く課題」と整合しているか（目的と無関係な指標を測っていないか）。
- **計測可能性**: 各成功指標に計測方法（どこで・どう取得）が記載され、計測可能か。今すぐ取れない指標が代理指標に置き換えられているか（MVP 段階は仮説値で可）。
- Full DDD（`01-domain-model.md`）採用時は、ビジネス価値の提供元が Core Domain に寄っているか（Generic に偏っていないか）も確認する。

## 2.7 MVP 正当化 / 過剰作り込み（YAGNI / PM Gate）

「要らないものを作らない」を守るためのスコープ妥当性検査。

- **Must の trace**: `02-mvp-scope.md` の各 Must 機能が、Product Brief の 課題 / ターゲット（ペルソナ）/ 成功指標 / 検証仮説 のいずれかに紐づくか。**いずれにも trace しない Must は過剰作り込み候補としてフラグ**する。
- **Out of Scope の矛盾**: `02-mvp-scope.md` の Won't / Out of Scope に挙げた機能が、他ドキュメント（シナリオ・ドメインモデル・`05-user-stories.md`）で実装対象として記述されていないか。
- **安い代替手段**: 手作業・既存ツール・外部サービスで足りるものが Must になっていないか（`02-mvp-scope.md` の「より安い代替手段」列を確認）。
- **仮説の数**: 検証する仮説が 1〜3 個に絞れているか（多すぎる＝MVP が過大）。

> 成功指標と目的の整合（目的 ↔ 成功指標）・計測可能性は [2.6 目的との整合性](#26-目的との整合性)で検査する。

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
