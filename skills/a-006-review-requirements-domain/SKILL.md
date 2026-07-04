---
name: a-006-review-requirements-domain
description: 要件定義・シナリオ・ドメインモデル間の一貫性を検証し、さらに MVP 正当化（過剰作り込み検査）と Go / Go with caveats / No-Go の PM Gate 判定を行う。ステークホルダー向け要約（STAKEHOLDER-SUMMARY.md）と AI 実装用コンテキスト（AI_CONTEXT.md）を生成する。ドメイン設計完了後、技術選定・実装フェーズへ移る前の関門として使用。
disable-model-invocation: true
context: fork
allowed-tools: Read, Grep, Glob, Write, Bash
---

# ReviewRequirementsDomain (a-006)

## 目的

- ここまでに作成されたすべてのドキュメント間の一貫性を体系的にチェックする。
- ドキュメント間の不整合、漏れ、矛盾を検出し、修正提案を提供する。
- ユビキタス言語の遵守状況を確認し、用語の一貫性を保証する。
- MVP として過剰でないか（YAGNI / 過剰作り込み）を検査し、各 Must 機能の正当性を確認する。
- **PM Gate** として実装着手の Go / Go with caveats / No-Go を判定する。
- ステークホルダー合意用の要約（`STAKEHOLDER-SUMMARY.md`）と AI 実装用の圧縮コンテキスト（`AI_CONTEXT.md`）を生成する。
- レビュー結果レポートを作成し、修正すべき項目を優先度付きでリストアップする。

## 前提

以下のドキュメントが作成されていること:

- `docs/project/01-requirements/` の各ドキュメント（`01-product-brief.md`, `02-mvp-scope.md`, `03-parking-lot.md`, `05-user-stories.md`、existing モードは加えて `06-features-implemented.md`）
- `docs/project/02-behavior/01-core-scenarios.md`
- `docs/project/03-domain/01-domain-sketch.md`, `02-ubiquitous-language.md`（Full DDD を採用した場合は加えて `01-domain-model.md`）

## 手順

### 1. doctor によるドキュメント健全性検査

```bash
npx -y yodogawa doctor --json
```

出力される JSON（`{version, ok, summary, checks[], findings[]}`）をそのまま読み込む。**この段階で `ls` や `grep` を再実装しない。** exit code 1（Error あり）は正常系であり、JSON は必ず stdout に出力される。

- `findings` のうち `check: "structure"` かつ `file` が `01-requirements/`・`02-behavior/`・`03-domain/` 配下のものを確認する。必須ファイル・見出しの欠落があれば、対応する `/a-002`, `/a-002a`, `/a-002b`, `/a-003`, `/a-004` スキルの実行を促し、手順2には進まない。
- `04-design/` 配下に関する `structure` の finding（未着手フェーズ）はこのスキルの対象外なので無視する。
- `id-trace` / `placeholder` の findings は手順2で観点別に振り分ける（対応表は [reference/consistency-checks.md](reference/consistency-checks.md#doctor-findings-の観点マッピング)）。
- doctor が実行できない場合（未導入・実行失敗）のみ、代替として `ls -l docs/project/01-requirements/*.md docs/project/02-behavior/*.md docs/project/03-domain/*.md` を実行する。

### 2. 一貫性チェックの実行（観点別 PASS/FAIL + 根拠引用）

以下の 8 観点を **PASS / FAIL** で判定する（判定ルール: 観点内に Error 相当の指摘が1件以上あれば FAIL、Warning 相当のみなら PASS+注記）。詳細な観点・doctor対応関係は [reference/consistency-checks.md](reference/consistency-checks.md) を参照。

> **エージェントの役割範囲**
>
> - **doctor 対応観点**: エージェントの役割は doctor の出力（JSON）の解釈と修正提案に限定する。`ls`/`grep`/`jq` 等で同じ検査を再実装しない。
> - **doctor 非対応観点**: エージェントの役割は「読解判断＋証拠引用」である。Read/Grep/Glob を自由に使って該当ドキュメントを確認し、判定には必ず file:line の引用を伴わせる。

- **2.1 ユーザーストーリー ↔ シナリオ**（一部 doctor 対応）: US-XXX に対応する SC-XXX の存在、価値と結果の整合
- **2.2 MVP スコープ/実装済み機能 ↔ シナリオ**（doctor 対応）: Must 機能/リグレッション用のカバレッジ
- **2.3 クリティカル制約 ↔ スコープ/ドメイン**（doctor 非対応）: Product Brief のクリティカル制約（法務・セキュリティ・期限・予算等）が MVP スコープ判断・ドメインモデルに反映されているか（初期フェーズでは定量 NFR ではなく制約を確認。詳細 NFR は a-014 の責務）
- **2.4 Core Scenario ↔ Domain Sketch**（doctor 非対応）: アクター・中核エンティティ・重要ビジネスルールの対応（Full DDD 採用時は Command / Event / Actor の対応も）
- **2.5 ユビキタス言語**（doctor 非対応）: 主要要素の登録、禁止用語の検出
- **2.6 目的との整合性**（doctor 非対応）: Product Brief の価値提案と Domain Sketch の中核エンティティ（Full DDD 採用時は Core Domain）の一致、および**目的 ↔ 成功指標**の整合・成功指標の計測可能性
- **2.7 MVP 正当化 / 過剰作り込み（YAGNI）**（大半が doctor 非対応）: 各 Must が課題/ペルソナ/指標/仮説に trace するか、Out of Scope と矛盾しないか、安い代替手段で済むものが Must になっていないか
- **2.8 ドキュメントメタ情報（Owner / Status）**（一部 doctor 対応）: 各ドキュメント冒頭のメタヘッダで Owner が記入済みか（`[Owner名]` の残置は doctor の placeholder が検出）、Status がフェーズと整合しているか。IF ヘッダ自体が無い（旧テンプレート由来） THEN FAIL にせず PASS＋注記とし、ヘッダの追補を提案する。Status の不整合も FAIL ではなく更新提案とする。

`placeholder` の finding のうち `[Owner名]` は観点 2.8 に振り分ける。それ以外はどの観点にも一対一対応しないため、判断材料としてのみ使う（必要なら該当観点のコメント欄に file:line 付きで補足する）。

### 3. PM Gate 判定（Go / Go with caveats / No-Go）

観点別 PASS/FAIL 表から次の規則で機械的に導出する（恣意的な総合判断をしない）:

- **クリティカル観点**: 2.3（クリティカル制約）/ 2.4（Core Scenario↔Domain Sketch）/ 2.7（MVP正当化）
- **No-Go**: クリティカル観点のいずれかが FAIL、または FAIL の観点数が3以上
- **Go with caveats**: FAIL が1〜2件あるが、すべて非クリティカル観点（2.1/2.2/2.5/2.6/2.8）
- **Go**: 全観点 PASS（コメント欄の Warning 注記は着手を妨げない）

補助チェックリスト（各項目は対応する観点番号の FAIL/PASS を根拠として引用する）:

- [ ] 検証する仮説が 1〜3 個に絞れている（→ 2.7）
- [ ] すべての Must 機能が 課題 / ペルソナ / 成功指標 / 検証仮説 のいずれかに紐づいている（→ 2.7）
- [ ] Not Now / Won't が明示され、理由が書かれている（→ 2.7）
- [ ] 手作業・既存ツール・外部サービスで代替できるものを Must にしていない（→ 2.7）
- [ ] ステークホルダー・決裁者・関心事が明確である（→ 2.6）
- [ ] クリティカル制約が MVP 判断に反映されている（→ 2.3）
- [ ] 未決事項が実装開始を妨げないレベルまで減っている（→ 全観点）

### 4. レビュー結果レポートの作成

観点別 PASS/FAIL の結果と PM Gate 判定をまとめ、`docs/project/REVIEW-REPORT-YYYYMMDDHHMMSS.md` を作成する。フォーマットは [examples/review-report-template.md](examples/review-report-template.md#レポートフォーマット) を参照。

必須セクション:

- サマリー（観点別 PASS/FAIL の件数。doctor summary の errors/warnings を参考値として併記）
- 詳細（8 観点ごとの PASS/FAIL・根拠(file:line引用)・コメント。2.7 では**過剰作り込み候補**を明示）
- PM Gate 判定（Go / Go with caveats / No-Go と、観点別表からの導出根拠）
- 推奨アクション（修正すべきタスクとスキル参照）

### 5. ステークホルダー要約 / AI コンテキストの生成

このスキルの配置ディレクトリ（`skills/a-006-review-requirements-domain/`）を起点に、次の 2 テンプレートを Read→Write で生成する。出力先が既に存在する場合は確認の上、最新内容で更新する。

- `../../templates/project/STAKEHOLDER-SUMMARY.md` → `docs/project/STAKEHOLDER-SUMMARY.md`
- `../../templates/project/AI_CONTEXT.md` → `docs/project/AI_CONTEXT.md`

上流ドキュメント（`01-product-brief.md` / `02-mvp-scope.md` / `02-behavior/01-core-scenarios.md` / `03-domain/`）を**要約・参照**して各テンプレートを埋める（single source of truth を複製しない）。`AI_CONTEXT.md` には **MVP must NOT build**（Won't / Out of Scope）を必ず明記する。`STAKEHOLDER-SUMMARY.md` には手順3の PM Gate 判定を転記する。

両ファイルの冒頭メタヘッダも記入する（Owner は文書責任者——未確認ならユーザーに確認。Status は PM Gate 判定に応じて `in-review` または `approved`、Last-updated は当日日付）。

### 6. 結果の報告と修正提案

- レポートと PM Gate 判定を要約してユーザーに伝える。
- 重大なエラー（Error）や No-Go がある場合は優先修正を提案。
- Go / Go with caveats の場合は「`docs/project/AI_CONTEXT.md` を実装エージェント（Vibe coding / AI 実装）へ渡してください」と案内する。
- 「修正作業を開始しますか？それともレポートを Git に保存して終了しますか？」

### 7. Git への追加（任意）

```bash
git add docs/project/REVIEW-REPORT-*.md docs/project/STAKEHOLDER-SUMMARY.md docs/project/AI_CONTEXT.md
git commit -m "docs: PM Gate レビュー（要約・AI コンテキスト含む）の作成"
```

## 完了条件

- `docs/project/REVIEW-REPORT-YYYYMMDDHHMMSS.md` が作成され、8 観点の結果と PM Gate 判定（Go / Go with caveats / No-Go）が記録されている。
- 全ドキュメント間の整合性がチェックされ、観点ごとの判定（PASS/FAIL）と根拠（file:line引用）が記録されている。doctor対応観点はfindingsの転記、非対応観点は読解判断＋引用になっている。
- 各 Must 機能の MVP 正当化が検査され、trace しない機能が**過剰作り込み候補**としてフラグされている。
- `docs/project/STAKEHOLDER-SUMMARY.md` と `docs/project/AI_CONTEXT.md` が生成され、`AI_CONTEXT.md` に「作らないもの（must NOT build）」が明記されている。
- 具体的な修正アクションが提案されている。

## エスカレーション

- **多数のエラーが検出された**: 「不整合が多くドキュメント信頼性が低下しています。関係者を集めた大規模レビュー会議を推奨します。」
- **Core Domain で不整合**: 「Core Domain における不整合はリスクが高いです。実装前に必ず解消してください。」
- 判断材料の詳細は [reference/consistency-checks.md](reference/consistency-checks.md#エスカレーションの判断材料) を参照。

## 参考

- [examples/review-report-template.md](examples/review-report-template.md) — レビュー結果レポートのフォーマット例、PASS/FAIL判定ルール、PM Gate 判定の使い方
- [reference/consistency-checks.md](reference/consistency-checks.md) — doctor findingsの観点マッピング、8 観点（MVP 正当化/YAGNI 含む）の詳細なチェック項目、doctor非対応観点のgrep補助例、エスカレーション基準
- [../../templates/project/STAKEHOLDER-SUMMARY.md](../../templates/project/STAKEHOLDER-SUMMARY.md) — ステークホルダー向け統合1枚もののテンプレート
- [../../templates/project/AI_CONTEXT.md](../../templates/project/AI_CONTEXT.md) — AI 実装用の圧縮コンテキストのテンプレート
