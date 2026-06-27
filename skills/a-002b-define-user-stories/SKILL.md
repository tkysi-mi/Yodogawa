---
name: a-002b-define-user-stories
description: Product Brief と MVP スコープ確定後に、Must 機能を起点としたユーザーストーリー（役割・目的・価値）を作成し、要約レベルの受け入れ基準と優先度を付与する。a-002a（MVP スコープ）の後、a-003（シナリオ）の前に実行。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineUserStories (a-002b)

## 目的

- MVP スコープで Must と判定した機能を、ユーザー視点のストーリー（[役割]として[目的]がしたい、なぜなら[価値]だから）に翻訳する。
- 各ストーリーに要約レベルの受け入れ基準（AC）と優先度を付与し、後続の Core Scenarios（a-003）の入力にする。
- 実行順は a-002a（MVP スコープ）の後、a-003（シナリオ）の前。

## 前提

- `docs/project/01-requirements/01-product-brief.md` と `02-mvp-scope.md` が作成されていること（なければ先に `/a-002-initialize-project` → `/a-002a-slice-mvp-scope` を実行）。
- Must 機能が `02-mvp-scope.md` に確定していること。

## 手順

### 1. 前提の確認

```bash
ls -l docs/project/01-requirements/01-product-brief.md docs/project/01-requirements/02-mvp-scope.md 2>/dev/null \
  || echo "MISSING: 01-product-brief.md または 02-mvp-scope.md"
```

不足時: 「先に `/a-002-initialize-project`（Product Brief）→ `/a-002a-slice-mvp-scope`（MVP スコープ）を実行してください。」と促して中断。

### 2. テンプレートの準備

このスキルの配置ディレクトリ（`skills/a-002b-define-user-stories/`）を起点に、`../../templates/project/01-requirements/05-user-stories.md` を Read→Write で `docs/project/01-requirements/05-user-stories.md` へコピーする。出力先に既に存在する場合は上書きせずスキップして報告する（冪等）。

### 3. ストーリーの抽出と記入

`01-product-brief.md`（ターゲットユーザー・価値提案）と `02-mvp-scope.md`（Must 機能）を読み込み、Must 機能ごとに主要ユーザージャーニーを抽出する。

FOR EACH 主要ジャーニー: `05-user-stories.md` のテーブルに記入する。

- テンプレート: 「[役割]として、[〇〇機能]を使いたい、なぜなら[価値]だから」
- **ペルソナ列を必ず埋める**: `01-product-brief.md` の「ターゲットユーザー / 主要ペルソナ」表の ID（P-XXX）を「ペルソナ」列に記入し、ストーリーの `[役割]` を**その ID のペルソナと一致**させる（役割が宙に浮かないようにする）。
- **役割が既存ペルソナに無い場合**: 勝手に新しい役割を増やさず、`01-product-brief.md` のペルソナ表に追加してから参照する（ペルソナの SSoT は Product Brief）。
- ヒアリング: 「他に主要なユーザージャーニーがあれば教えてください」「各ストーリーの優先度・受け入れ基準は？」
- **Must 機能に紐づかないストーリーは作らない**（スコープ外。Parking Lot / Won't に倒す）。

> ストーリーの書き方・INVEST・受け入れ基準（AC）・優先度付け・3C の詳細は [reference/user-stories-guide.md](reference/user-stories-guide.md) を参照。

### 4. SSoT の住み分け確認

User Story は**要約レベルの受け入れ基準（AC）**を担い、実行時の主要行動は次スキル `/a-003-create-scenarios` の Core Scenario が担う。同じ振る舞いを二重に Gherkin 化しない。

### 5. レビューと構造チェック

ユーザーにストーリー一覧を提示し、INVEST（独立・交渉可能・価値・見積可能・小さい・テスト可能）の観点で確認する。

```bash
grep "| ストーリーID | ペルソナ | ストーリー |" docs/project/01-requirements/05-user-stories.md \
  && echo "OK" || echo "MISSING: Table Header"
```

## 完了条件

- `docs/project/01-requirements/05-user-stories.md` が作成され、各ストーリーに役割・目的・価値・優先度・受け入れ基準が記入されている。
- 各ストーリーの「ペルソナ」列が `01-product-brief.md` のペルソナ表の ID（P-XXX）を参照し、`[役割]` がその記載と一致している（役割が宙に浮いていない）。
- すべてのストーリーが `02-mvp-scope.md` の Must 機能に紐づいている。
- ユーザーがストーリー内容を確認し、承認またはフィードバックを提供している。

## エスカレーション

- **Must に紐づかないストーリーが出る**: 「このストーリーは MVP の Must 機能に対応しません。Parking Lot へ回すか、スコープを見直しますか？」と確認。
- **役割に対応するペルソナが Product Brief に無い**: 「この役割は `01-product-brief.md` のペルソナ表にありません。新しいペルソナとして追加しますか？それとも既存ペルソナに寄せますか？」と確認し、ストーリー側で役割を勝手に増やさない。
- **AC が曖昧**: 「『正しく動く』では検証できません。観測可能な条件（〜が表示される / 〜が保存される）で書けますか？」と促す。

## 参考

- [reference/user-stories-guide.md](reference/user-stories-guide.md) — INVEST・受け入れ基準・優先度付け・3C の詳しい考え方
- `01-product-brief.md` — ターゲットユーザー・価値提案の参照元
- `02-mvp-scope.md` — Must 機能の参照元
