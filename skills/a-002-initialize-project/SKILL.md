---
name: a-002-initialize-project
description: プロジェクトの要件を対話形式で収集し、システム概要・機能要件・非機能要件・ユーザーストーリーのドキュメントを生成する。新規プロジェクト開始時、または要件が未整備の場合に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# InitializeProject (a-002)

## 目的

- プロジェクトの目的・背景・機能要件を詳細にヒアリングし、具体的で実装可能なドキュメントを作成する。
- システム概要・実装済み機能・予定機能・非機能要件・ユーザーストーリーを網羅する。
- 抽象的・曖昧な表現を避け、対話を通じて具体的な数値・期限・制約・優先度を明確化する。

## 前提

- `docs/project/01-requirements/` ディレクトリが存在すること（なければ先に `/a-001-setup-doc-structure` を実行）
- `docs/` に書き込み権限があること
- ユーザーがプロジェクト概要と主要機能の基本情報を提供できること

## 手順

### 1. ドキュメントディレクトリの確認

```bash
ls -la docs/project/01-requirements/ 2>/dev/null || echo "ディレクトリが存在しません"
```

存在しない場合: 「`docs/project/01-requirements/` がありません。先に `/a-001-setup-doc-structure` を実行してください。」

### 2. テンプレート一括コピー

要件定義に必要な 5 ファイルのテンプレートを `docs/project/01-requirements/` に一括コピーする。既存ファイルはスキップされる（冪等）。

```bash
SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
bash "$SCRIPT_DIR/scripts/init-project-docs.sh" requirements
```

コピーされるファイル:

- `01-system-overview.md`
- `02-features-implemented.md`
- `03-features-planned.md`
- `04-non-functional-requirements.md`
- `05-user-stories.md`

### 3. コードベースの自動分析と提案

**規模確認**:

```bash
ls -F
```

ファイルがほとんど無い／ソースコードが無い場合はスキップし、ユーザーへ通知。

**詳細調査**（コードがある場合）:

```bash
cat package.json 2>/dev/null
cat README.md 2>/dev/null
find src app lib -maxdepth 2 2>/dev/null
```

結果から以下を推測・提示: システム概要（目的・技術スタック）、実装済み機能（ファイル構造からの推測）、想定ユーザー像。

### 4. システム概要の記入

`01-system-overview.md` を開き、「背景」「目的」をヒアリングして記入する。質問例は [reference/hearing-questions.md](reference/hearing-questions.md) を参照。

### 5. 実装済み機能一覧の記入

`02-features-implemented.md` に、コードベース調査で検出したディレクトリ/ファイル名から機能を提案し、ヒアリング結果をテーブルに記入する（Category 1/2、機能名、説明、機能 ID）。

コード調査コマンドとヒアリング項目は [reference/hearing-questions.md](reference/hearing-questions.md#手順4-実装済み機能一覧) を参照。

### 6. 予定機能一覧の記入

`03-features-planned.md` に、システム概要と実装済み機能のギャップを分析して未実装機能を提案し、ヒアリング結果をテーブルに記入する（機能 ID・優先度は未確定のまま）。

### 7. 非機能要件の記入

`04-non-functional-requirements.md` に、詳細定義が必要か確認の上、パフォーマンス/セキュリティ/可用性/スケーラビリティ/ユーザビリティ・保守性の観点で**定量的な目標**をヒアリングして記入する。不要なら標準ベースライン（[examples/nfr-baseline.md](examples/nfr-baseline.md)）で仮置きする。

### 8. ユーザーストーリーの記入

`05-user-stories.md` に、作成済みドキュメントから主要ユーザージャーニーを抽出してストーリー案を提示し、ヒアリング結果をテーブルに記入する（優先度・受け入れ基準含む）。

ストーリーテンプレート: 「[役割]として、[〇〇機能]を使いたい、なぜなら[価値]だから」

### 9. 全体レビュー

- 作成した全ドキュメントをユーザーに提示し、以下を確認:
  - 「記載内容に誤りや漏れはありませんか？」
  - 「抽象的すぎる記述や、解釈が分かれそうな表現はありますか？」
  - 「テンプレートのコメントや不要な例示は適切に処理されていますか？」

### 10. 完了条件と構造の確認

- ファイルの存在と主要セクション/テーブル構造を検証。
- 検証コマンド・チェックリスト・Git コミット手順は [reference/structure-check.md](reference/structure-check.md) を参照。

### 11. Git への追加（オプション）

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加オプション) を参照。

## 完了条件

- `docs/project/01-requirements/` に 5 つの要件定義ドキュメントが作成されている
- すべてのドキュメントで抽象的表現が最小化され、具体的な数値・期限・制約が記載されている
- ユーザーがドキュメント内容を確認し、承認またはフィードバックを提供している

## エスカレーション

- **ユーザーが重要な情報を提供できない**: 「この情報は後続の設計・実装で必須です。確認できる担当者や資料はありますか？」と確認し、TODO として記録。
- **競合する要件や矛盾**: 「以下の要件が競合しています: [詳細]。優先順位や調整方針を確認させてください。」と報告。
- **想定工数が非現実的に大きい**: 「現在の計画では実現が困難です。スコープ縮小や優先度調整を検討しませんか？」と提案。

## 参考

- [reference/hearing-questions.md](reference/hearing-questions.md) — 手順4〜8のヒアリング質問集
- [reference/structure-check.md](reference/structure-check.md) — 手順10の構造チェックコマンドと Git コミット手順
- [examples/nfr-baseline.md](examples/nfr-baseline.md) — 非機能要件の標準ベースライン提案値
