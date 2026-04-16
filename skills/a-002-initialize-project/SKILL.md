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

- `docs/project/requirements/` ディレクトリが存在すること（なければ先に `/a-001-setup-doc-structure` を実行）
- `docs/` に書き込み権限があること
- ユーザーがプロジェクト概要と主要機能の基本情報を提供できること

## 手順

### 1. ドキュメントディレクトリの確認

```bash
ls -la docs/project/requirements/ 2>/dev/null || echo "ディレクトリが存在しません"
```

存在しない場合: 「`docs/project/requirements/` がありません。先に `/a-001-setup-doc-structure` を実行してください。」

### 2. コードベースの自動分析と提案

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

### 3. システム概要の作成

1. テンプレートをコピー:

   ```bash
   SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
   cp "$SCRIPT_DIR/templates/project/01-requirements/01-system-overview.md" \
      "docs/project/requirements/01-system-overview.md"
   ```

2. 「背景」「目的」をヒアリングして記入。質問例は [reference/hearing-questions.md](reference/hearing-questions.md) を参照。

### 4. 実装済み機能一覧

1. `02-features-implemented.md` をテンプレートからコピー。
2. コードベースを調査し、検出したディレクトリ/ファイル名から機能を提案。
3. ヒアリング結果をテーブルに記入（Category 1/2、機能名、説明、機能 ID）。

コード調査コマンドとヒアリング項目は [reference/hearing-questions.md](reference/hearing-questions.md#手順4-実装済み機能一覧) を参照。

### 5. 予定機能一覧

1. `03-features-planned.md` をテンプレートからコピー。
2. システム概要と実装済み機能のギャップを分析し、未実装機能を提案。
3. ヒアリング結果をテーブルに記入（機能 ID・優先度は未確定のまま）。

### 6. 非機能要件一覧

1. `04-non-functional-requirements.md` をテンプレートからコピー。
2. 詳細定義が必要か確認。不要なら標準ベースラインで仮置き（[examples/nfr-baseline.md](examples/nfr-baseline.md)）。
3. パフォーマンス/セキュリティ/可用性/スケーラビリティ/ユーザビリティ・保守性の観点で**定量的な目標**をヒアリング。

### 7. ユーザーストーリー

1. `05-user-stories.md` をテンプレートからコピー。
2. 作成済みドキュメントから主要ユーザージャーニーを抽出し、ストーリー案を提示。
3. ヒアリング結果をテーブルに記入（優先度・受け入れ基準含む）。

ストーリーテンプレート: 「[役割]として、[〇〇機能]を使いたい、なぜなら[価値]だから」

### 8. 全体レビュー

- 作成した全ドキュメントをユーザーに提示し、以下を確認:
  - 「記載内容に誤りや漏れはありませんか？」
  - 「抽象的すぎる記述や、解釈が分かれそうな表現はありますか？」
  - 「テンプレートのコメントや不要な例示は適切に処理されていますか？」

### 9. 完了条件と構造の確認

- ファイルの存在と主要セクション/テーブル構造を検証。
- 検証コマンド・チェックリスト・Git コミット手順は [reference/structure-check.md](reference/structure-check.md) を参照。

### 10. Git への追加（オプション）

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加オプション) を参照。

## 完了条件

- `docs/project/requirements/` に 5 つの要件定義ドキュメントが作成されている
- すべてのドキュメントで抽象的表現が最小化され、具体的な数値・期限・制約が記載されている
- ユーザーがドキュメント内容を確認し、承認またはフィードバックを提供している

## エスカレーション

- **ユーザーが重要な情報を提供できない**: 「この情報は後続の設計・実装で必須です。確認できる担当者や資料はありますか？」と確認し、TODO として記録。
- **競合する要件や矛盾**: 「以下の要件が競合しています: [詳細]。優先順位や調整方針を確認させてください。」と報告。
- **想定工数が非現実的に大きい**: 「現在の計画では実現が困難です。スコープ縮小や優先度調整を検討しませんか？」と提案。

## 参考

- [reference/hearing-questions.md](reference/hearing-questions.md) — 手順3〜7のヒアリング質問集
- [reference/structure-check.md](reference/structure-check.md) — 手順9の構造チェックコマンドと Git コミット手順
- [examples/nfr-baseline.md](examples/nfr-baseline.md) — 非機能要件の標準ベースライン提案値
