---
name: a-003-create-scenarios
description: ユーザーストーリーから Gherkin 形式のシナリオを生成し、BDD で振る舞いを定義する。要件定義後、ドメインモデル設計前の振る舞い明確化に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# CreateScenarios (a-003)

## 目的

- ユーザーストーリーから具体的なシナリオ（振る舞い）を抽出し、Gherkin 形式で記述する。
- Given-When-Then 構造で、開発者・QA・ステークホルダーが共通理解できる実行可能なドキュメントを作成する。
- ハッピーパス（正常系）からエラーケース、境界値テストまでを網羅的に定義する。

## 前提

- `docs/project/01-requirements/05-user-stories.md` が作成されていること（`/a-002-initialize-project` 実行済み）。
- `docs/project/02-behavior/` ディレクトリが存在すること（未作成なら `/a-001-setup-doc-structure`）。
- ユーザーが各機能の具体的な動作例を説明できること。

## 手順

### 1. ディレクトリと前提条件の確認

```bash
ls -la docs/project/02-behavior/ 2>/dev/null || echo "ディレクトリが存在しません"
```

`docs/project/01-requirements/05-user-stories.md` を読み込み、シナリオ化対象を把握する。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/02-behavior/01-scenarios.md" "docs/project/02-behavior/01-scenarios.md"
```

### 3. 分析と提案

ユーザーストーリーを機能（Feature）単位にグルーピングし、ハッピーパスと代表的なエラーケースの案を提示。

- 「機能: [機能名] (US-XXX)」
- 「シナリオ案1: [ハッピーパス] / シナリオ案2: [エラーケース]」

### 4. ヒアリングと記入

機能ごとに以下を詰めて `docs/project/02-behavior/01-scenarios.md` を更新する。Gherkin 記述例は [examples/gherkin-templates.md](examples/gherkin-templates.md) を参照。

- **Feature 情報**: 機能名、As a/I want/So that、Background（共通前提）
- **ハッピーパス**: Given-When-Then で最も基本的な成功シナリオ
- **エラーケース・境界値**: 必要に応じて Scenario Outline（Examples テーブル）を使用
- **タグ付け**: `@SC-XXX` ID 採番、`@smoke` `@happy-path` `@error-handling` 等

UI 操作の詳細ではなく、ユーザーの意図を記述するよう注意する。

### 5. シナリオ一覧テーブルの更新

ドキュメント冒頭の一覧テーブルに、全シナリオの ID・機能・シナリオ名・優先度を記載する。テーブル例は [examples/gherkin-templates.md](examples/gherkin-templates.md#シナリオ一覧テーブル例) を参照。

### 6. レビューと確認

ユーザーに提示し、実際の動作の正確性、抜け漏れ、非技術者への理解可能性を確認する。質問例は [reference/structure-check.md](reference/structure-check.md#レビュー確認質問) を参照。

### 7. 構造チェック

```bash
grep "Feature:" docs/project/02-behavior/01-scenarios.md \
  && grep "Scenario:" docs/project/02-behavior/01-scenarios.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細なチェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 8. Git への追加（任意）

```bash
git add docs/project/02-behavior/
git commit -m "docs: 振る舞い仕様（シナリオ）の作成"
```

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加任意) を参照。

## 完了条件

- `docs/project/02-behavior/01-scenarios.md` が作成されている。
- ユーザーストーリーに対応する具体的なシナリオ（Given-When-Then）が記述されている。
- シナリオ一覧テーブルがメンテナンスされている。
- ユーザーが内容を承認している。

## エスカレーション

- **ユーザーストーリーが不明確でシナリオ化できない**: 「`/a-002-initialize-project` に戻って要件を明確にしましょう。」
- **実装詳細への依存が強すぎる**: 「UI 操作（ボタンクリック等）ではなく、ユーザーの意図（登録する等）に焦点を当てた記述に変更しましょう。」

## 参考

- [examples/gherkin-templates.md](examples/gherkin-templates.md) — Feature / Scenario / Scenario Outline の記述例、タグ付けガイド、一覧テーブル例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー観点、Git 追加例
