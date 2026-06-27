---
name: a-002a-slice-mvp-scope
description: 候補機能を Must / Not Now / Won't に切り分けて MVP スコープを確定し、各 Must 機能を課題・仮説・成功指標に紐づけて正当化する。やらないこと（Out of Scope）も明示する。Product Brief 作成後（a-002 の後）に実行。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# SliceMvpScope (a-002a)

## 目的

- 「本当に必要なものだけ作る」ため、候補機能を **Must / Not Now / Won't** に切り分けて MVP スコープを確定する。
- 各 Must 機能を Product Brief の**課題・検証仮説・成功指標**に紐づけて正当化し、過剰作り込みを排除する。
- **やらないこと（Out of Scope / Won't）**を理由付きで明示し、ステークホルダーと合意できる状態にする。
- 実行順は a-002（Product Brief）の後、a-003（シナリオ）の前。

## 前提

- `docs/project/01-requirements/01-product-brief.md` が作成されていること（なければ先に `/a-002-initialize-project` を実行）。
- 課題・ターゲット・成功指標・非ゴールが Product Brief に記載されていること。
- アイデアの backlog は `03-parking-lot.md`（a-002 が生成）を入力として利用できる。

## 手順

### 1. 前提の確認

```bash
ls -l docs/project/01-requirements/01-product-brief.md 2>/dev/null || echo "MISSING: 01-product-brief.md"
```

存在しない場合: 「`01-product-brief.md` がありません。先に `/a-002-initialize-project` で Product Brief を作成してください。」と促して中断。

### 2. テンプレートの準備

このスキルの配置ディレクトリ（`skills/a-002a-slice-mvp-scope/`）を起点に、`../../templates/project/01-requirements/02-mvp-scope.md` を Read→Write で `docs/project/01-requirements/02-mvp-scope.md` へコピーする。出力先に既に存在する場合は上書きせずスキップして報告する（冪等）。

### 3. 候補機能の洗い出し

`01-product-brief.md`（課題・価値提案・成功指標）と `03-parking-lot.md`（アイデア backlog）を読み込み、候補機能を列挙する。Product Brief の課題・価値提案から、それを満たすのに必要な機能を逆算する。

### 4. MVP 判定（Must / Not Now / Won't）

FOR EACH 候補機能: `02-mvp-scope.md` のテーブルに記入する。

- **MVP判定**を Must / Not Now / Won't のいずれかに決める。
  - Must: この MVP の仮説検証に不可欠。これが無いと価値が成立しない。
  - Not Now: 価値はあるが今回は不要（→ Parking Lot へ）。
  - Won't: 明示的に作らない（→ Out of Scope へ）。
- 各 Must は**課題 / 検証仮説 / 成功指標のいずれかに必ず紐づける**（同じ言葉で参照）。紐づかない Must は過剰作り込み候補として Not Now / Won't に倒す。
- **「より安い代替手段（手作業・既存ツール・外部サービス）で足りるか」を必ず問う**。足りるなら Must にしない。

検証する仮説は 1〜3 個に絞る。多すぎる場合は MVP が大きすぎる兆候として再検討する。

### 5. やらないこと（Out of Scope）の明示

`02-mvp-scope.md` の「Out of Scope」セクションに、Won't 機能と**作らない理由**を記入する。Product Brief の「非ゴール」と整合させる。

### 6. Parking Lot の整理

Not Now / Won't と判定したアイデアを `03-parking-lot.md` に移動・整理する。Parking Lot は優先度を厳密に決めない backlog として維持し、MVP Scope（優先度必須）と役割を分ける。

### 7. レビュー

- ユーザーに MVP Scope を提示し、以下を確認:
  - 「Must が多すぎませんか？削れる Must はありませんか？」
  - 「各 Must は仮説・指標に紐づいていますか？」
  - 「やらないこと（Won't）に合意できますか？」

## 完了条件

- `docs/project/01-requirements/02-mvp-scope.md` が作成され、各候補機能に Must / Not Now / Won't 判定が入っている。
- すべての Must 機能が課題 / 検証仮説 / 成功指標のいずれかに紐づいている。
- Out of Scope（Won't）が理由付きで記入されている。
- 検証する仮説が 1〜3 個に絞られている。
- ユーザーがスコープに合意またはフィードバックを提供している。

## エスカレーション

- **Must が多すぎて削れない**: 「すべてを Day 1 に作ると MVP の意味が薄れます。最も検証したい仮説1つに絞ると、どれが Must ですか？」と問い直す。
- **代替手段で足りる機能が Must になっている**: 「これは手作業/既存ツールで代替できそうです。まず代替手段で検証しませんか？」と提案。
- **やらないことに合意が得られない**: 決裁者・関心事（Product Brief のステークホルダー）に立ち戻り、合意形成の論点として記録する。

## 参考

- [../../templates/project/01-requirements/02-mvp-scope.md](../../templates/project/01-requirements/02-mvp-scope.md) — MVP Scope テンプレート（判定基準・列定義）
- [../a-002-initialize-project/reference/hearing-questions.md](../a-002-initialize-project/reference/hearing-questions.md) — 深掘りフレーム集（より安い代替手段・競合 / Day 1 MVP / 1ヶ月後に検証したい仮説 / Inversion）。手順4・5 のスコープ判定で活用する
- `01-product-brief.md` — 課題・成功指標・非ゴールの参照元
- `03-parking-lot.md` — Not Now / Won't アイデアの backlog
