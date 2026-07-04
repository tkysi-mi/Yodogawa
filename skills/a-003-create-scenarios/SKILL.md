---
name: a-003-create-scenarios
description: MVP Scope の Must 機能から「価値提供が成立する最小行動（Core Scenarios）」を定義する。Day 1 の成功体験・価値を壊す重大失敗・MVP で対応しない範囲を固定する。詳細な Gherkin は任意。要件定義後、ドメイン設計前の振る舞い明確化に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# CreateScenarios (a-003)

## 目的

- MVP Scope の Must 機能から、価値提供が成立する**最小の主要行動**を Core Scenarios として定義する。
- Day 1 に必ず通る成功体験（Happy Path 1〜3 本）と、価値を壊す重大失敗（Critical Failure）を固定する。
- MVP で対応しない行動・エラー（Not Covered in MVP）を明示し、スコープ膨張を防ぐ。
- 全ケース網羅の BDD（ハッピー / エラー / 境界値）は目的としない。詳細 Gherkin は実装直前・テスト設計時の任意作業に降格する。

## 前提

- `docs/project/01-requirements/01-product-brief.md` / `02-mvp-scope.md` / `05-user-stories.md` が作成されていること（`/a-002-initialize-project` → `/a-002a-slice-mvp-scope` → `/a-002b-define-user-stories` 実行済み）。
- `docs/project/02-behavior/` ディレクトリが存在すること（未作成なら本スキルが作成する）。
- ユーザーが Must 機能の主要な利用シーンを説明できること。

## 手順

### 1. 前提ドキュメントの確認

```bash
ls -la docs/project/02-behavior/ 2>/dev/null || echo "ディレクトリが存在しません"
```

`02-mvp-scope.md` の **Must 機能**と `01-product-brief.md` の成功指標・クリティカル制約を読み込み、Core Scenario 化の対象（Must のみ）を把握する。Not Now / Won't は対象にしない。

### 2. テンプレートの準備

このスキルの配置ディレクトリ（`skills/a-003-create-scenarios/`）を起点に、相対パス `../../templates/project/02-behavior/01-core-scenarios.md` を Read で読み込み、その内容を `docs/project/02-behavior/01-core-scenarios.md` へ Write する。出力先が既に存在する場合は上書きせずスキップして報告する（冪等）。出力先ディレクトリ（`docs/project/02-behavior/`）が無ければ作成する。

コピー直後に、ドキュメント冒頭のメタヘッダを記入する（Owner は文書責任者。未確認ならユーザーに確認し、既存 docs があればその Owner を引き継ぐ / Status は `draft` / Last-updated は当日日付）。

### 3. Core Flow の抽出と提案

Must 機能から、価値が成立する中核行動の流れ（Core Flow）を 1〜3 本提案する。各フローは「主アクター / 提供価値（So that）/ 対応 Must」で一覧化する。

- 「フロー: [フロー名]（対応 Must: FN-XXX）」
- 「主アクター: [誰] / 提供価値: [So that ...]」

### 4. Day 1 Happy Path と Critical Failure の記入

`01-core-scenarios.md` を更新する。ユーザーの意図を Given-When-Then で簡潔に書き、UI 操作の詳細には踏み込まない。

- **Day 1 Happy Path**（CS-XXX, 1〜3 本）: リリース初日に必ず通る成功シナリオ。
- **Critical Failure**（CF-XXX）: 起きると MVP の価値が崩れる失敗だけ（法務・課金・権限・データ消失など）。各失敗に「MVP での扱い」を書く。
- 網羅したくなったら止める。詳細な境界値・エラー網羅は任意で [reference/detailed-gherkin-template.md](reference/detailed-gherkin-template.md) を使う。

### 5. Not Covered in MVP と SSoT の整合

- **Not Covered in MVP**: MVP で対応しない行動・エラーを明示し、`02-mvp-scope.md` の Not Now / Won't と整合させる。
- **SSoT の住み分け**: User Story（`05-user-stories.md`）は要約レベルの受け入れ基準（AC）、Core Scenario は実行時の主要行動。同じ振る舞いを二重に詳細化しない。

### 6. レビューと確認

ユーザーに提示し、(1) Day 1 の成功体験が正しいか、(2) Critical Failure に漏れがないか、(3) Not Covered が MVP Scope と矛盾しないかを確認する。質問例は [reference/structure-check.md](reference/structure-check.md#レビュー確認質問) を参照。

### 7. 構造チェック

```bash
grep "## Day 1 Happy Path" docs/project/02-behavior/01-core-scenarios.md \
  && grep "## Critical Failure" docs/project/02-behavior/01-core-scenarios.md \
  && grep "## Not Covered in MVP" docs/project/02-behavior/01-core-scenarios.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細なチェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 8. Git への追加（任意）

```bash
git add docs/project/02-behavior/
git commit -m "docs: Core Scenarios（MVP 主要行動）の作成"
```

## 完了条件

- `docs/project/02-behavior/01-core-scenarios.md` が作成されている。
- Must 機能に対する Day 1 Happy Path（1〜3 本）と Critical Failure が記述されている。
- Not Covered in MVP が明示され、`02-mvp-scope.md` の Not Now / Won't と整合している。
- User Story と Core Scenario の二重管理が避けられている（要約 AC ↔ 実行時主要行動）。
- ユーザーが内容を承認している。

## エスカレーション

- **MVP Scope が未確定でシナリオ化できない**: 「`/a-002a-slice-mvp-scope` に戻って Must 機能を確定しましょう。」
- **全ケースを網羅したくなる**: 「MVP 初期は網羅不要です。価値を壊す Critical Failure に限定し、残りは Not Covered in MVP へ逃がしましょう。詳細 Gherkin はテスト設計時に任意で作成できます。」
- **実装詳細への依存が強すぎる**: 「UI 操作（ボタンクリック等）ではなくユーザーの意図（登録する等）に焦点を当てた記述に変更しましょう。」

## 参考

- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー観点、Git 追加例
- [reference/detailed-gherkin-template.md](reference/detailed-gherkin-template.md) — （任意）詳細な Gherkin / Scenario Outline / タグ運用テンプレート。実装直前・テスト設計時に使用
- [examples/gherkin-templates.md](examples/gherkin-templates.md) — （任意）Feature / Scenario / Scenario Outline の記述例、タグ付けガイド
