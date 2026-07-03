# 一貫性チェック項目詳細

SKILL.md 手順2 で実施する各チェック項目の詳細。doctor が機械的に検出する部分は findings の転記、doctor 非対応の意味内容の判断は Read/Grep による手動確認＋file:line 引用の組み合わせで検証する。

## doctor findings の観点マッピング

`yodogawa doctor --json`（手順1）の `findings[]` は `docs/project` 配下のみを検査対象とし、`{check, severity, file, line, message}` を返す。以下の対応表に従い、該当する観点へ**そのまま転記**する（grep での再実装はしない）。file:line は Read で開いて実際の行を引用すること（message は合成文のため、原文の引用を別途添える）。

| doctor check | finding 条件 | severity | 対応観点 | 備考 |
|---|---|---|---|---|
| `id-trace` | `id` が `US-` の finding（trace切れ） | error | 2.1 | US 側の片方向 trace 切れのみ検出。逆方向（Core Scenario→US の対応漏れ）とストーリーの「価値」↔シナリオ「Then」の整合は非対応（Read で確認） |
| `id-trace` | `id` が `P-` の finding（trace切れ） | error | 2.1（役割↔ペルソナ） | `05-user-stories.md` が参照する未定義ペルソナ |
| `id-trace` | `id` が `P-` の finding（孤児＝`05-user-stories.md`から未参照） | warning | 2.7（傍証） | 孤児ペルソナの検出のみ。Must の trace 判断そのものの代替にはならない |
| `id-trace` | `id` が `FN-` の finding（trace切れ） | error | 2.2 | |
| `id-trace` | `id` が `FN-` の finding（`02-behavior/01-core-scenarios.md` から未参照） | warning | 2.2 | Must機能のシナリオカバレッジ。doctor が最も強くカバーする部分 |
| `structure` | `file` が `01-requirements/`〜`03-domain/` 配下 | error/warning | 手順1（前提） | 観点表には含めない。存在確認・必須見出しの欠落シグナル |
| `placeholder` | 同上 | warning | 参考情報 | どの観点にも一対一対応しない。未記入セクションの兆候として補足に使う程度 |

**doctor が対応しない観点（2.3〜2.6、2.7の大半）は、上記マッピングに現れない。エージェントが Read/Grep で内容を確認し、判定には file:line の引用を必須とする。**

## 2.1 ユーザーストーリー ↔ Core Scenario

- **カバレッジ**: MVP Scope の Must 機能に対応する Core Scenario（Day 1 Happy Path）が存在するか。User Story は要約 AC、Core Scenario は実行時の主要行動という SSoT の住み分けを保つ（全 US を逐一シナリオ化しない）。doctor 非対応（上記マッピング表参照）。Read で `05-user-stories.md` と `02-behavior/01-core-scenarios.md` を確認する。
- **整合性**: ストーリーの「価値」と Core Scenario の「結果（Then）」が一致しているか。doctor 非対応。

### ユーザーストーリーの役割 ↔ ペルソナ（trace）

- **役割が宙に浮かない**: `05-user-stories.md` の各ストーリーの「ペルソナ」列が、`01-product-brief.md` のペルソナ表で定義済みの ID（P-XXX）を参照しているか。**未定義のペルソナを参照する US はフラグ**する（役割の trace 切れ）。doctor の `id-trace`（P族 trace切れ、上記マッピング表）をそのまま転記する。
- **逆方向（任意）**: どの US からも参照されない主要ペルソナがあれば、スコープ漏れか過剰ペルソナのどちらかとして確認する。doctor の `id-trace`（P族 孤児、severity=warning）で検出できる。

## 2.2 MVP スコープ・実装済み機能 ↔ シナリオ

- **MVP スコープ**: `02-mvp-scope.md` の Must 機能にシナリオが存在するか。doctor の `id-trace`（FN族、上記マッピング表）がそのまま使える。
- **実装済み機能**: `06-features-implemented.md`（existing モード）の機能にリグレッション用シナリオが存在するか。同じく FN 族で検出される。
- **Parking Lot**: `03-parking-lot.md` は backlog のためシナリオ必須ではない（MVP 昇格時に MVP スコープ側で扱う）。doctor 非対応（この除外判断自体は Read で確認）。

## 2.3 クリティカル制約 ↔ スコープ/ドメイン

初期フェーズでは定量 NFR ではなく、Product Brief の「クリティカル制約」を確認する（詳細な定量 NFR は設計フェーズ `/a-014-define-infrastructure` の責務）。**doctor 非対応。** doctor は制約の「反映」という意味内容を判断できないため、Read で確認し file:line を引用する。

- **制約の反映**: `01-product-brief.md` のクリティカル制約（法務・セキュリティ・期限・予算・外部 API 等）が `02-mvp-scope.md` の Must 判断やドメインモデルに反映されているか。
- **セキュリティ・権限**: 制約に挙げた認証・権限要件が Policy や Guard としてドメインモデルに含まれているか。

## 2.4 Core Scenario ↔ Domain Sketch

**doctor 非対応。** Core Scenario ↔ Domain Sketch の対応関係を機械検査する ID 族は存在しない。Read で確認し file:line を引用する。

- **アクター**: Core Scenario のアクターが Domain Sketch の「アクター / 外部システム」に存在するか。
- **中核エンティティ**: Core Scenario が扱う対象が Domain Sketch の「中核エンティティ」に定義されているか。
- **重要ルール**: Critical Failure を防ぐルールが「重要なビジネスルール」に反映されているか。
- **Full DDD 採用時**: `01-domain-model.md` がある場合は、When→Command / Then→Event / Actor の対応も確認する。

## 2.5 ユビキタス言語の遵守

**doctor 非対応。**

- **用語定義**: Domain Sketch の主要用語・中核エンティティ（Full DDD 採用時は Aggregate / Command / Event）がユビキタス言語一覧にあるか。
- **禁止用語**: 各ドキュメントに禁止用語（Data, Process, Manager 等）が使われていないか。**用語の意味判断は doctor では担保できないため、以下の grep は補助検索として引き続き手動実行する（doctor で代替できない）。**

```bash
# 禁止用語の簡易検索
grep -rn "Data" docs/project/03-domain/ || echo "No 'Data' found"
grep -rn "Process" docs/project/03-domain/ || echo "No 'Process' found"
grep -rn "Manager" docs/project/03-domain/ || echo "No 'Manager' found"
```

## 2.6 目的との整合性

**doctor 非対応。**

- Product Brief（`01-product-brief.md`）の「価値提案 / 差別化」が Domain Sketch の「中核エンティティ」「重要なビジネスルール」に反映されているか。
- **価値提案の充足**: 「価値提案 / 差別化」のバリュープロポジション（1文）と差別化ポイント（Why us）が埋まり、Why us が「現在の代替手段・競合スキャン」表の各「弱み」と対応づいているか（漠然と「使いやすい」で済ませていないか）。
- **目的 ↔ 成功指標**: Product Brief の成功指標（North Star / KPI / Guardrail）が「価値提案 / 解く課題」と整合しているか（目的と無関係な指標を測っていないか）。
- **計測可能性**: 各成功指標に計測方法（どこで・どう取得）が記載され、計測可能か。今すぐ取れない指標が代理指標に置き換えられているか（MVP 段階は仮説値で可）。
- Full DDD（`01-domain-model.md`）採用時は、ビジネス価値の提供元が Core Domain に寄っているか（Generic に偏っていないか）も確認する。

## 2.7 MVP 正当化 / 過剰作り込み（YAGNI / PM Gate）

「要らないものを作らない」を守るためのスコープ妥当性検査。**大半が doctor 非対応。** 孤児ペルソナ（doctor `id-trace` P族 warning、上記マッピング表）は過剰作り込みの傍証になるが、Must の trace 判断そのものの代替にはならない。以下は Read で確認し file:line を引用する。

- **Must の trace**: `02-mvp-scope.md` の各 Must 機能が、Product Brief の 課題 / ターゲット（ペルソナ）/ 成功指標 / 検証仮説 のいずれかに紐づくか。**いずれにも trace しない Must は過剰作り込み候補としてフラグ**する。
- **Out of Scope の矛盾**: `02-mvp-scope.md` の Won't / Out of Scope に挙げた機能が、他ドキュメント（シナリオ・ドメインモデル・`05-user-stories.md`）で実装対象として記述されていないか。doctor では代替できないため、以下の grep は補助検索として引き続き手動実行する。
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
