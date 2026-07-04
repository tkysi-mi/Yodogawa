---
name: a-002-initialize-project
description: プロジェクトの問題定義(Why)を Product Brief（誰のどの課題を・なぜ今・どう解き・どう成功を測るか）として対話形式で作成し、要件定義の起点とする。MVP スコープ・ユーザーストーリーは後続スキルが担う。新規（greenfield）/ 既存（existing）の2モードに対応し、既定は新規。新規プロジェクト開始時、または要件が未整備の場合に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# InitializeProject (a-002)

## 目的

- Product Brief を中核に、誰のどの課題を・なぜ今・どう解き・どう成功を測るかをステークホルダーと合意できる形で言語化する。
- 新規（greenfield）/ 既存（existing）の2モードに分岐し、既定は新規プロダクト。
- Product Brief を起点に後続スキルへ展開する: Parking Lot（アイデア backlog）と MVP スコープは `/a-002a-slice-mvp-scope`、ユーザーストーリーは `/a-002b-define-user-stories` が担う（実装済み機能の棚卸しは existing モードのみ本スキルが扱う）。
- 詳細な非機能要件（応答時間・稼働率・スケーラビリティ等の定量値）は初期フェーズでは扱わない。MVP の作り方を変えるほど重要な制約のみを Product Brief の「クリティカル制約」に集約し、定量 NFR は設計フェーズ `/a-014-define-infrastructure` が所有する。
- 抽象的・曖昧な表現を避け、対話を通じて具体的な数値・期限・制約・優先度を明確化する。

## 前提

- `docs/` 配下への書き込み権限があること（必要なディレクトリ構造は本スキルが自動作成するため、`/a-001-setup-doc-structure` の事前実行は不要）
- ユーザーがプロジェクトの課題・対象ユーザー・期待価値の基本情報を提供できること

## 手順

### 1. ドキュメント基盤の確保

要件定義に必要なディレクトリ構造を確保する。`mkdir -p` なので冪等で、明示的な `/a-001-setup-doc-structure` 実行は不要（必要時に本手順が自動で初期化する）。

```bash
mkdir -p docs/project/01-requirements docs/project/02-behavior docs/project/03-domain docs/project/04-design docs/tasks
```

`docs/README.md` が無ければ、[../a-001-setup-doc-structure/reference/directory-structure.md](../a-001-setup-doc-structure/reference/directory-structure.md#docsreadmemd-テンプレート) の「docs/README.md テンプレート」を Write する（既存の場合は上書きしない）。

### 2. モード判定（greenfield / existing）

このスキルは新規プロダクト（**greenfield**）と既存プロダクト（**existing / brownfield**）の2モードに対応する。後続手順（テンプレート選定・コード分析・実装済み機能の棚卸し）の分岐に影響するため、最初にモードを確定する。

判定ロジック:

- ユーザーがモードを明示した場合はそれを優先する。
- 明示がない場合は、軽量シグナルから推定する。

  ```bash
  ls -F
  cat package.json 2>/dev/null
  cat README.md 2>/dev/null
  find src app lib -maxdepth 2 2>/dev/null
  ```

  - ソースコード・`package.json`・既存ドキュメントが揃い相応の規模があれば **existing** を候補にする。
  - ファイルがほとんど無い／ソースコードが無い場合は **greenfield** を候補にする。
- 推定が曖昧な場合の**既定は greenfield**（Yodogawa の主目的は新規プロダクトの仕様駆動立ち上げのため）。
- 「このプロジェクトを greenfield（新規）/ existing（既存）として進めます。よろしいですか？」とユーザーに提示し、確認を取る。

確定したモードを以降の手順で参照する。

### 3. テンプレートのコピー（モード別）

このスキルの配置ディレクトリ（`skills/a-002-initialize-project/`）を起点に、`docs/project/01-requirements/` へテンプレートを Read→Write する（FOR EACH）。出力先に既に存在するファイルは上書きせずスキップして報告する（冪等）。出力先ディレクトリが無ければ作成する。

**existing モード**（2 ファイル）:

- `../../templates/project/01-requirements/01-product-brief.md` → `docs/project/01-requirements/01-product-brief.md`
- `../../templates/project/01-requirements/06-features-implemented.md` → `docs/project/01-requirements/06-features-implemented.md`

**greenfield モード**（必須 1 ファイル）: `01-product-brief.md` のみ。新規プロダクトでは実装済み機能がまだ存在しないため、`06-features-implemented.md` は**任意**扱いとし、ユーザーが棚卸しを希望した場合のみ「空の任意資料」としてコピーする。

> `03-parking-lot.md` / `02-mvp-scope.md` は本スキルでは生成しない。次スキル `/a-002a-slice-mvp-scope` が作成する。
> `05-user-stories.md` は `/a-002b-define-user-stories` が作成する。
>
> `04-non-functional-requirements.md`（詳細な定量 NFR）は初期フェーズでは生成しない。クリティカル制約は Product Brief（手順5）に集約し、詳細 NFR は設計フェーズ `/a-014-define-infrastructure` が扱う（採番上 04 は欠番）。

### 4. コードベースの自動分析と提案（existing モードのみ）

> greenfield モードではこの手順をスキップする。

**詳細調査**:

```bash
cat package.json 2>/dev/null
cat README.md 2>/dev/null
find src app lib -maxdepth 2 2>/dev/null
```

結果から以下を推測・提示: Product Brief の下書き（課題・目的・技術スタック）、実装済み機能（ファイル構造からの推測）、想定ユーザー像。

### 5. Product Brief の記入（中核）

`01-product-brief.md` を開き、深掘りヒアリングで埋める。**これがこのスキルの中核成果物**で、後続スキル（MVP Scope / Core Scenarios / PM Gate）が参照する。

- 記入対象: 背景/解く課題（証拠・規模つき）、ターゲットユーザー / 主要ペルソナ、ステークホルダー、現在の代替手段・競合スキャン、価値提案/差別化、Why now、成功指標（North Star / KPI / Guardrail ＋計測方法）、クリティカル制約、非ゴール、未確定事項。
- **メタヘッダ**: 冒頭の Owner / Status / Last-updated を記入する。Owner（文書責任者。決裁者と同一でなくてよい）はヒアリングで確認し、Status は `draft`、Last-updated は当日日付とする。
- **ペルソナ表**: 主要 1〜2 ペルソナを ID（P-XXX）付きで記入する（ゴール / 課題・ペイン / 利用文脈、任意でニーズの強さ）。この ID は後続の User Story（`/a-002b`）が「役割」を参照解決する SSoT になるため、過剰にせず・空欄にせず埋める。
- **代替手段・競合スキャン**: 主要な数件（2〜4 件）を表で軽量にスキャンする（手作業/Workaround・既製ツール・競合プロダクト）。各代替の「弱み・不満」が価値提案の起点になる。網羅・深追いはしない（YAGNI）。
- **価値提案 / 差別化**: バリュープロポジションを1文（誰の・どの課題を・どう解き・なぜ既存より良いか）に凝縮し、差別化ポイント（Why us、最大3点）をスキャン表の「弱み」と対応づける。
- 「課題 → なぜ → なぜ」と3段以上掘り下げ、表層の要望ではなく本質的な課題に到達する。
- 「この課題を作らずに放置したら何が起きるか」「既存の代替手段で十分ではないか」を必ず確認する。

質問例は [reference/hearing-questions.md](reference/hearing-questions.md#手順5-product-brief) を参照。

### 6. 実装済み機能一覧の記入（existing モードのみ）

> greenfield モードではこの手順をスキップする（`06-features-implemented.md` は任意の空資料）。

`06-features-implemented.md` に、コードベース調査で検出したディレクトリ/ファイル名から機能を提案し、ヒアリング結果をテーブルに記入する（Category 1/2、機能名、説明、機能 ID）。

コード調査コマンドとヒアリング項目は [reference/hearing-questions.md](reference/hearing-questions.md#手順6-実装済み機能一覧) を参照。

### 7. 全体レビュー

- 作成した全ドキュメントをユーザーに提示し、以下を確認:
  - 「記載内容に誤りや漏れはありませんか？」
  - 「抽象的すぎる記述や、解釈が分かれそうな表現はありますか？」
  - 「テンプレートのコメントや不要な例示は適切に処理されていますか？」

### 8. 完了条件と構造の確認

- ファイルの存在と主要セクション/テーブル構造を検証。
- 検証コマンド・チェックリスト・Git コミット手順は [reference/structure-check.md](reference/structure-check.md) を参照。

### 9. Git への追加（オプション）

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加オプション) を参照。

## 完了条件

- `docs/project/01-requirements/01-product-brief.md` が作成され、課題・ターゲット・代替手段・価値提案・Why now・成功指標・クリティカル制約・非ゴールが具体的に埋まっている（**中核成果物**）
- あわせて要件定義ドキュメントが作成されている
  - existing モード: `01`, `06` の 2 ドキュメント
  - greenfield モード: `01`。`06-features-implemented.md` は任意
  - `04`（詳細 NFR）は初期フェーズでは生成しない（設計フェーズ `/a-014` が所有）
- Parking Lot（`03-parking-lot.md`）・MVP スコープ（`02-mvp-scope.md`）は次スキル `/a-002a-slice-mvp-scope` で、ユーザーストーリー（`05-user-stories.md`）は `/a-002b-define-user-stories` で作成する
- すべてのドキュメントで抽象的表現が最小化され、具体的な数値・期限・制約が記載されている
- ユーザーがドキュメント内容を確認し、承認またはフィードバックを提供している

## エスカレーション

- **ユーザーが重要な情報を提供できない**: 「この情報は後続の設計・実装で必須です。確認できる担当者や資料はありますか？」と確認し、TODO として記録。
- **競合する要件や矛盾**: 「以下の要件が競合しています: [詳細]。優先順位や調整方針を確認させてください。」と報告。
- **想定工数が非現実的に大きい**: 「現在の計画では実現が困難です。スコープ縮小や優先度調整を検討しませんか？」と提案。

## 参考

- [reference/hearing-questions.md](reference/hearing-questions.md) — Product Brief（手順5）・実装済み機能（手順6）のヒアリング質問集。末尾に深掘りフレーム集（5 Whys / Pre-mortem / 代替手段・競合 / Day 1 MVP / 検証仮説 / Inversion）。深掘りフレーム集は `/a-002a-slice-mvp-scope` からも参照される
- [reference/structure-check.md](reference/structure-check.md) — 手順8の構造チェックコマンドと Git コミット手順（手順9）
