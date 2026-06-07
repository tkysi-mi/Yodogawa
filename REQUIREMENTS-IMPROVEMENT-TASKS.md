# 要件定義プロセス改善タスク一覧

`skills/a-001` ～ `a-006` および `templates/project/01-requirements/` の分析結果に基づく改善タスク。
要件定義書（`docs/project/01-requirements/`）の品質を上げることを目的とする。

優先度の凡例: **P1** = 最優先 / **P2** = 高 / **P3** = 中 / **P4** = 低

---

## A. 上流情報の欠落を埋める（最優先）

要件の「Why」を支えるセクションが現状コメント内に埋もれている。独立化することで上流情報の抜けを防ぐ。

- [ ] **[P1]** `templates/project/01-requirements/01-system-overview.md` に **ステークホルダーマップ**テーブルを追加
  - 列: 役割・責任・決裁権限・関心事
  - `a-002-initialize-project/reference/hearing-questions.md` 手順 3 にヒアリング質問を追加
- [ ] **[P1]** `templates/project/01-requirements/01-system-overview.md` に **対象範囲 / 対象外（Out of Scope）** セクションを追加
  - スコープクリープ防止、a-002 で「想定外に大きい」を指摘する根拠になる
- [ ] **[P1]** `templates/project/01-requirements/06-constraints.md` を新設（**制約条件**: 予算・期限・法務・技術）
  - NFR とは別物として独立させる
  - `a-002-initialize-project/SKILL.md` の手順とコピーファイル一覧に追加
- [ ] **[P1]** `templates/project/01-requirements/07-assumptions-risks.md` を新設（**前提・仮説・リスク**）
  - 列: 仮説 / 検証方法 / リスク / 影響度 / 緩和策
  - `a-002-initialize-project/SKILL.md` に手順を追加
- [ ] **[P2]** `templates/project/01-requirements/08-personas.md` を新設（**ペルソナ定義**）
  - US-XXX の「[役割]として」を参照解決可能にする
  - 同名役割の別解釈を防ぐ
- [ ] **[P2]** `01-system-overview.md` の「目的」セクション内の KPI を独立セクション化
  - **ビジネスゴール / KPI 表**: 指標名・現状値・目標値・測定方法
  - 後続フェーズの測定基準として再利用しやすくする

---

## B. トレーサビリティの構造化（a-006 の検証精度向上）

現状 a-006 は `grep` でカバレッジ確認しているため、入力構造が崩れると検出が弱い。

- [ ] **[P1]** `templates/project/01-requirements/02-features-implemented.md` のテーブルに `US-XXX` 参照列・`依存機能` 列を追加
- [ ] **[P1]** `templates/project/01-requirements/03-features-planned.md` のテーブルに `US-XXX` 参照列・`依存機能` 列を追加
- [ ] **[P1]** `templates/project/01-requirements/09-traceability.md`（仮）を新設し、**FN × US × SC × NFR のマトリクス**を集約
  - a-006 はマトリクスの空セルを検出する形に簡略化
- [ ] **[P2]** `04-non-functional-requirements.md` に **NFR-XXX の ID 列**を追加（現状 NFR は ID 無し）
  - a-006 のチェック対象として参照可能になる
- [ ] **[P2]** すべての要件テンプレートに **YAML frontmatter** を追加
  - `status: draft|approved|implemented|deprecated`
  - `approver`、`approved_at`、`updated_at`
  - Living document の鮮度を可視化
- [ ] **[P3]** `skills/a-006-review-requirements-domain/reference/consistency-checks.md` の grep ベースのチェックを、トレーサビリティマトリクスベースに書き換え

---

## C. 機能要件テーブルの表現を厚くする

判断材料が後段ドキュメントに散らばっており、機能テーブル単体で意思決定できない。

- [ ] **[P2]** `02-features-implemented.md` `03-features-planned.md` に **状態列**を追加
  - 値: 提案 / 承認 / 実装中 / 完了 / 廃止
- [ ] **[P2]** `02-features-implemented.md` `03-features-planned.md` に **依存機能列**を追加
- [ ] **[P2]** **優先度フレームワーク**を High/Medium/Low から MoSCoW（Must/Should/Could/Won't）または WSJF に変更
  - 客観基準（コスト・価値・リスク）の評価軸を持たせる
  - `templates/project/01-requirements/03-features-planned.md` のコメントを更新
- [ ] **[P3]** `02-features-implemented.md:1-15` のコメントに **エピック / フィーチャー / ストーリーの粒度感**の定義を追加
  - 現状「ユーザーが認識できる単位」だけで運用がブレる

---

## D. 非機能要件テンプレートの掘り下げ

ISO/IEC 25010 の網羅チェックが薄く、測定方法と違反時影響が記録されない。

- [ ] **[P1]** `templates/project/01-requirements/04-non-functional-requirements.md` のテーブルに以下の列を追加
  - **測定方法**（環境・負荷条件・パーセンタイル）
  - **優先度**
  - **違反時の影響**
  - **検証フェーズ**（開発 / ステージング / 本番）
- [ ] **[P2]** `skills/a-002-initialize-project/examples/iso25010-checklist.md` を新設
  - ISO 25010 の 8 特性（機能適合性・性能効率・互換性・使用性・信頼性・セキュリティ・保守性・移植性）に対する網羅チェック
  - a-002 手順 7 で「未記入の特性」を必ず確認する手順に組み込む
- [ ] **[P3]** `skills/a-002-initialize-project/examples/nfr-baseline.md` を **ドメイン別**に分岐
  - 社内ツール / 公開 SaaS / 決済 / ヘルスケア / モバイルなど
  - 初期値の質を上げる

---

## E. ユーザーストーリー周辺の二重化解消

US の AC（Given-When-Then）と a-003 の `01-scenarios.md` の Scenario が二重に Gherkin 化される問題。

- [ ] **[P2]** US と Scenario の SSoT 関係を明文化
  - 推奨: US は **要約 AC**、Scenarios は **実行可能な詳細**
  - `templates/project/01-requirements/05-user-stories.md` のコメントに記載
  - `skills/a-003-create-scenarios/SKILL.md` の前提に明記
- [ ] **[P2]** US テーブルに `Scenarios:` 列（SC-XXX のリスト）を追加し、参照を一方向化
- [ ] **[P3]** `skills/a-002-initialize-project/SKILL.md` 手順 8 に **INVEST 原則のチェックリスト**を組み込む
  - 現状はテンプレートのコメント記載のみで運用チェックが無い

---

## F. ヒアリング質問の深掘り

`reference/hearing-questions.md` が表面的で、深掘りテクニックが入っていない。

- [ ] **[P1]** `skills/a-002-initialize-project/reference/hearing-questions.md` 手順 3 に **5 Whys（3 段以上の Why-chain）** を導入
  - 「なぜ重要ですか？」を最低 3 段掘り下げる対話パターン
- [ ] **[P2]** ヒアリング質問に **Pre-mortem** を追加
  - 「半年後にこのプロジェクトが失敗していたとしたら、何が原因だったと思いますか？」
- [ ] **[P2]** ヒアリング質問に **競合・代替手段の質問**を追加
  - 「このシステムを作らない場合、ユーザーは何で代替しますか？」
  - 「既存ツール X との差別化点は？」
- [ ] **[P2]** ヒアリング質問に **MVP 切り出し質問**を追加
  - 「Day 1 で出す最小の価値は何ですか？」
  - 「リリース後 1 ヶ月で検証したい仮説は何ですか？」
- [ ] **[P3]** ヒアリング質問に **Inversion / 制約逆転**の質問を追加
  - 「このシステムが絶対にやってはいけないことは何ですか？」

---

## G. 視覚化の追加

要件段階で図が無く、テーブルだけで関係性を表現している。

- [ ] **[P2]** `templates/project/01-requirements/01-system-overview.md` に **C4 モデル Level 1（System Context Diagram）** の Mermaid テンプレートを埋め込み
  - 外部システム・アクターを 1 枚で表現
- [ ] **[P3]** `templates/project/01-requirements/10-user-story-map.md` を新設
  - Jeff Patton 流ストーリーマップ（バックボーン × ウォーキングスケルトン）の Markdown テーブル表現
- [ ] **[P4]** `templates/project/01-requirements/11-journey-map.md` を新設
  - 主要シナリオの感情曲線・タッチポイント

---

## H. 完成例の不足

各テンプレートに断片的な「例:」はあるが、5 ファイルが埋まった完成例が無い。

- [ ] **[P2]** `skills/a-002-initialize-project/examples/sample-project/` を新設
  - 5 ファイル全てが連続した形で記入された完成プロジェクト 1 セット（例: タスク管理 SaaS）
  - 新規ユーザーの品質ばらつきが減る
- [ ] **[P3]** `skills/a-003-create-scenarios/examples/` にも同サンプルプロジェクトの Gherkin 完成例を追加
  - サンプルが a-002 → a-003 で連続するように

---

## I. AI ハーネス側の自動チェック（要件 lint）

a-002 のヒアリング中に曖昧表現や数値欠落を機械的に検出する仕組みが無い。

- [ ] **[P1]** `scripts/lint-requirements.sh` を新設
  - 禁止語パターン検出（「使いやすい」「高速」「スムーズに」「良い感じ」など主観表現）
  - 数値欠落検出（NFR で `[0-9]+(ms|秒|%|GB)` が 0 件のカテゴリを Warning）
  - ID 連番欠番検出（FN-XXX、US-XXX、SC-XXX、NFR-XXX）
- [ ] **[P1]** `skills/a-002-initialize-project/SKILL.md` 手順 9（全体レビュー）に lint 実行を組み込む
- [ ] **[P2]** `skills/a-006-review-requirements-domain/SKILL.md` から同 lint を呼び出して二重チェック
- [ ] **[P3]** `package.json` の `scripts` に `lint:requirements` を追加し、pre-commit フックに連結（リポジトリ自身のドッグフード）

---

## J. 変更管理（要件レベル ADR）

要件は living document だが、なぜ変えたかの意思決定記録が Git の commit message 任せになっている。

- [ ] **[P3]** `templates/project/01-requirements/decisions/ADR-template.md` を新設
  - 列 / 項目: 背景 / 選択肢 / 決定 / 帰結 / 承認者
- [ ] **[P3]** `skills/a-006-review-requirements-domain/SKILL.md` に「重大な変更検出時に ADR の作成を促す」ステップを追加

---

## 推奨実装順

最も ROI が高い順に着手する場合の推奨フロー。

1. **A の P1 タスク**（スコープ / 前提・リスク / ステークホルダー / 制約 4 セクション追加）
2. **B の P1 タスク**（トレーサビリティ列追加・マトリクス新設）
3. **F の P1 タスク**（5 Whys 導入）
4. **I の P1 タスク**（要件 lint スクリプト）
5. **D の P1 タスク**（NFR の測定方法・影響列追加）
6. **H の P2 タスク**（完成例 1 セット）

---

## 進捗メモ

<!-- 着手時に記録する -->
