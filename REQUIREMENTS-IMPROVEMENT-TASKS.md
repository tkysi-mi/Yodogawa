# 要件定義プロセス改善タスク一覧

`skills/a-001` ～ `a-006` および `templates/project/01-requirements/` の分析結果に基づく改善タスク。
要件定義書（`docs/project/01-requirements/`）の品質を上げることを目的とする。

優先度の凡例: **P1** = 最優先 / **P2** = 高 / **P3** = 中 / **P4** = 低

> ⚠️ **このリストは A-Series 再設計（#33）より前に作成された。** PM/MVP 中心への再設計（P1-P3, マージ済み）で要件定義の構造が変わったため、以下は再設計後の構造へ整合済み。各タスクに状態タグを付し、旧ファイル参照を新ファイル名へ更新した。
>
> 再設計後の `01-requirements/` 構造: `01-product-brief.md`（a-002 が所有）/ `02-mvp-scope.md` ＋ `03-parking-lot.md`（a-002a が所有）/ `05-user-stories.md`（a-002b が所有）/ `06-features-implemented.md`（existing のみ、a-002）。`04` は欠番（詳細 NFR は設計フェーズ `a-014-define-infrastructure` が所有）。振る舞いは `02-behavior/01-core-scenarios.md`、ドメインは `03-domain/01-domain-sketch.md`（軽量・標準）＋ `01-domain-model.md`（Full DDD・任意）。
>
> #36（a-002 単一責任分割）対応: a-002 を問題定義(Why)専任に縮小、Parking Lot を a-002a へ統合、User Stories を新規 `a-002b-define-user-stories` へ分離（英字 suffix 採番）。
>
> 状態タグ凡例: **✅完了**（再設計 P1-P3 で対応済み）/ **🟡一部**（別手段で概ね対応・残りは任意）/ **🔁再ターゲット**（パス・所有者変更、未対応）/ **⛔再設計で不要**（再設計の方針と矛盾するため取り下げ）/ **⬜未対応**（再設計後も有効な未着手タスク）。

---

## A. 上流情報の欠落を埋める（最優先）

要件の「Why」を支えるセクションが現状コメント内に埋もれている。独立化することで上流情報の抜けを防ぐ。

- [x] **[P1] ✅完了** **ステークホルダーマップ** → `01-product-brief.md` の「ステークホルダー / 決裁者 / 関心事」テーブル（役割・関心事）として実装。`hearing-questions.md` 手順3 にもヒアリング質問あり。
- [x] **[P1] ✅完了** **対象範囲 / 対象外（Out of Scope）** → `02-mvp-scope.md` の Won't / Out of Scope と `01-product-brief.md` の「非ゴール」に分離して実装。a-006 PM Gate の過剰作り込みチェックの根拠になる。
- [x] **[P1] ✅完了** **制約条件**（予算・期限・法務・技術） → 新ファイルではなく `01-product-brief.md` の「クリティカル制約」テーブルに SSoT として集約（MVP の作り方を変える制約に限定）。定量 NFR は a-014 が所有。
- [ ] **[P1] 🟡一部** **前提・仮説・リスク** → 検証仮説は `02-mvp-scope.md`、リスク・未決事項は `STAKEHOLDER-SUMMARY.md`（主要リスク / 未決事項）と `01-product-brief.md`（未確定事項）に分散して対応済み。独立した仮説検証マトリクス（仮説/検証方法/影響度/緩和策の表）が必要なら任意で追加。
- [ ] **[P2] 🟡一部** **ペルソナ定義** → `01-product-brief.md` の「ターゲットユーザー / 主要ペルソナ」に 1〜2 ペルソナを内包（MVP 軽量方針）。US-XXX の役割を厳密に参照解決する専用 `08-personas.md` は任意（規模が大きい場合のみ）。
- [x] **[P2] ✅完了** **ビジネスゴール / KPI** → `01-product-brief.md` の「成功指標（North Star / KPI / Guardrail）」テーブルとして独立。後続の MVP Scope・PM Gate が参照する。

---

## B. トレーサビリティの構造化（a-006 の検証精度向上）

現状 a-006 は `grep` でカバレッジ確認しているため、入力構造が崩れると検出が弱い。

> 再設計メモ: #33 は「トレーサビリティ強化より先に MVP を削る構造を入れる」方針。a-006 は現状 Must↔課題/仮説/指標/シナリオの紐づけを軽量に検証する。重量級マトリクスは優先度低。

- [ ] **[P2] 🔁再ターゲット** `06-features-implemented.md`（旧 `02-features-implemented.md`、existing のみ）のテーブルに `US-XXX` 参照列・`依存機能` 列を追加。
- [x] **[—] ⛔再設計で不要** ~~`03-features-planned.md` のテーブルに `US-XXX` 参照列・依存機能列を追加~~ → `03-features-planned.md` は `03-parking-lot.md` へ降格。Parking Lot は機能 ID・優先度を持たない設計（取捨選択と紐づけは `02-mvp-scope.md` が担う）ため、本タスクは矛盾。トレーサビリティは MVP Scope（Must↔仮説/指標/シナリオ）と a-006 が担当。
- [ ] **[P3] ⬜未対応** `09-traceability.md`（仮）を新設し **FN × US × SC × NFR のマトリクス**を集約。a-006 はマトリクスの空セル検出に簡略化。※ #33 方針により優先度低（a-006 の軽量紐づけで当面代替）。
- [ ] **[P2] 🔁再ターゲット** **NFR-XXX の ID 列** → 詳細 NFR は `04-non-functional-requirements.md` ではなく a-014（`skills/a-014-define-infrastructure/`）が所有。ID 列は a-014 の NFR 成果物側で扱う。
- [ ] **[P2] ⬜未対応** すべての要件テンプレートに **YAML frontmatter** を追加（`status: draft|approved|implemented|deprecated`、`approver` / `approved_at` / `updated_at`）。Living document の鮮度を可視化。※構造非依存・引き続き有効。
- [ ] **[P3] ⬜未対応** `a-006` の `reference/consistency-checks.md` の grep ベースチェックをトレーサビリティマトリクスベースに書き換え（B の マトリクス新設に依存）。

---

## C. 機能要件テーブルの表現を厚くする

判断材料が後段ドキュメントに散らばっており、機能テーブル単体で意思決定できない。

- [ ] **[P3] 🔁再ターゲット** **状態列** → `06-features-implemented.md`（existing）に追加可能。`03-parking-lot.md` は確定スコープでなく状態を持たない設計のため対象外（状態管理は `02-mvp-scope.md`）。
- [ ] **[P3] 🔁再ターゲット** **依存機能列** → 同上。`06-features-implemented.md` に追加可能。Parking Lot は対象外。
- [x] **[P2] ✅完了** **優先度フレームワーク** → `02-mvp-scope.md` で High/Medium/Low ではなく **Must / Not Now / Won't**（MoSCoW 相当）を採用し、各 Must を課題・仮説・指標・より安い代替手段で正当化する評価軸を持たせた。
- [ ] **[P3] 🟡一部** **エピック / フィーチャー / ストーリーの粒度感**の定義 → P3 の `user-stories-guide.md` に Epic 分割・INVEST の記載あり。`06-features-implemented.md` 側の粒度定義が必要なら追記。

---

## D. 非機能要件テンプレートの掘り下げ

ISO/IEC 25010 の網羅チェックが薄く、測定方法と違反時影響が記録されない。

> 再設計メモ: 詳細・定量 NFR は初期フェーズ（a-002）から外し、設計フェーズ `a-014-define-infrastructure` が所有する方針（P2 #48）。以下は a-014 側のタスクへ再ターゲット。

- [ ] **[P2] 🔁再ターゲット** NFR テーブルに **測定方法 / 優先度 / 違反時の影響 / 検証フェーズ** 列を追加 → 対象は a-014 の NFR 成果物（`skills/a-014-define-infrastructure/examples/` 配下の nfr テンプレート）。
- [ ] **[P3] 🔁再ターゲット** **ISO 25010 チェックリスト** → a-002 ではなく **a-014** に新設（8 特性の網羅チェック）。NFR は a-014 の責務。
- [x] **[P3] ✅完了（移設）** `nfr-baseline.md` の **ドメイン別**分岐 → P2 #48 で `skills/a-002` から `skills/a-014-define-infrastructure/examples/nfr-baseline.md` へ移設済み。ドメイン別の初期値拡充は a-014 側の継続タスク。

---

## E. ユーザーストーリー周辺の二重化解消

US の AC（Given-When-Then）と `01-core-scenarios.md`（旧 `01-scenarios.md`）の Scenario が二重に Gherkin 化される問題。

- [x] **[P2] ✅完了** US と Scenario の **SSoT 関係を明文化** → P2 で確立: **User Story = 要約レベルの AC / Core Scenario = 実行時の主要行動**。`05-user-stories.md` コメント・`01-core-scenarios.md`・a-002b SKILL（#36 で a-002 から分離）・a-003 SKILL 前提に記載済み。
- [ ] **[P2] ⬜未対応** US テーブルに `Scenarios:` 列（SC-XXX のリスト）を追加し参照を一方向化。※SSoT は明文化済みだが明示的な相互参照列は未追加。
- [ ] **[P3] 🟡一部** ユーザーストーリー作成スキル（a-002b）に **INVEST 原則のチェック**を組み込む → P3 で `user-stories-guide.md`（INVEST・受け入れ基準・優先度）を新設し a-002b SKILL から参照（#36 で a-002 から a-002b へ移設）。実行時チェックリスト化が必要なら追加。

---

## F. ヒアリング質問の深掘り

`reference/hearing-questions.md` が表面的で、深掘りテクニックが入っていない。

> ✅ **カテゴリ F は P3（#49）で全項目解消済み。** `a-002/reference/hearing-questions.md` 末尾に「深掘りフレーム集（Product Brief / MVP Scope 共通）」を追加し、a-002a からも参照。

- [x] **[P1] ✅完了** **5 Whys（3 段以上の Why-chain）** → 深掘りフレーム集「5 Whys（最低3段）」＋手順3 背景に導入済み。
- [x] **[P2] ✅完了** **Pre-mortem** → 「Pre-mortem（事前検死）」を追加（「失敗したとしたら原因は？」）。
- [x] **[P2] ✅完了** **競合・代替手段の質問** → 「より安い代替手段 / 競合分析」を追加（代替手段で足りるなら作らない判断）。
- [x] **[P2] ✅完了** **MVP 切り出し質問** → 「Day 1 MVP の切り出し」「1ヶ月後に検証したい仮説」を追加。
- [x] **[P3] ✅完了** **Inversion / 制約逆転** → 「絶対にやらないこと（Inversion）」を追加。

---

## G. 視覚化の追加

要件段階で図が無く、テーブルだけで関係性を表現している。

- [ ] **[P3] 🟡一部** **C4 モデル Level 1（System Context Diagram）** → `03-domain/01-domain-sketch.md` の「簡易ドメイン図」（アクター・システム境界・外部システムの Mermaid）で軽量に代替済み。厳密な C4 図が必要なら任意で追加。
- [ ] **[P3] ⬜未対応** `10-user-story-map.md` を新設（Jeff Patton 流ストーリーマップ）。※MVP 軽量方針のため優先度低。
- [ ] **[P4] ⬜未対応** `11-journey-map.md` を新設（主要シナリオの感情曲線・タッチポイント）。

---

## H. 完成例の不足

各テンプレートに断片的な「例:」はあるが、各ファイルが埋まった完成例が無い。

> #49（P3）で sample-project の追加は明示的に見送り（スコープ集中）。本カテゴリは独立タスクとして残置。

- [ ] **[P2] ⬜未対応（保留）** `skills/a-002-initialize-project/examples/sample-project/` を新設。再設計後の全成果物（Product Brief → MVP Scope → Core Scenarios → Domain Sketch → PM Gate）が連続して埋まった完成プロジェクト 1 セット。
- [ ] **[P3] ⬜未対応** `skills/a-003-create-scenarios/examples/` にも同サンプルの Gherkin 完成例を追加（a-002 → a-003 で連続するように）。

---

## I. AI ハーネス側の自動チェック（要件 lint）

a-002 のヒアリング中に曖昧表現や数値欠落を機械的に検出する仕組みが無い。

> ⬜ カテゴリ I は再設計の影響を受けず、引き続き有効（構造非依存）。ID 連番検出は再設計後の ID 体系（FN/US/SC、NFR は a-014）に合わせる。

- [ ] **[P2] ⬜未対応** `scripts/lint-requirements.sh` を新設（禁止語パターン検出 / 数値欠落検出 / ID 連番欠番検出）。
- [ ] **[P2] ⬜未対応** a-002 SKILL 手順9（全体レビュー）に lint 実行を組み込む。
- [ ] **[P3] ⬜未対応** a-006 SKILL から同 lint を呼び出して二重チェック。
- [ ] **[P3] ⬜未対応** `package.json` の `scripts` に `lint:requirements` を追加し pre-commit に連結（ドッグフード）。

---

## J. 変更管理（要件レベル ADR）

要件は living document だが、なぜ変えたかの意思決定記録が Git の commit message 任せになっている。

> ⬜ カテゴリ J は再設計の影響を受けず有効。要件レベル ADR は設計の `a-013`（ADR）とは別レイヤー。

- [ ] **[P3] ⬜未対応** `templates/project/01-requirements/decisions/ADR-template.md` を新設（背景 / 選択肢 / 決定 / 帰結 / 承認者）。
- [ ] **[P3] ⬜未対応** a-006 SKILL に「重大な変更検出時に ADR 作成を促す」ステップを追加。

---

## 推奨実装順（再設計後）

A-Series 再設計（#33, P1-P3）で **A の大半・C3・E1・F 全項目・D の移設は完了済み**。残タスクで ROI が高い順:

1. **I の P1/P2 タスク**（要件 lint スクリプト）— 構造非依存で効果が大きく、ドッグフード可能。
2. **B の P2 タスク**（`06-features-implemented` の US 参照列、YAML frontmatter）。
3. **H の P2 タスク**（再設計後フローの完成例 1 セット）。
4. **D の再ターゲット**（a-014 側の NFR 測定列・ISO 25010 チェック）。
5. **G/J/B3**（ストーリーマップ・要件 ADR・トレーサビリティマトリクス）— MVP 軽量方針のため優先度低。

---

## 進捗メモ

- A-Series 再設計（#33）: P1（#42-45, PR#50）/ P2（#46-48, PR#51）/ P3（#49, PR#52）すべてマージ済み。本リストを再設計後の構造へ整合（PR で本ファイル更新）。
