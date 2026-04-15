---
name: a-003-create-scenarios
description: ユーザーストーリーから具体的なGherkinシナリオを作成し、BDD形式で振る舞いを定義するワークフロー
---

# CreateScenarios (a-003)

## 目的

- ユーザーストーリーから具体的なシナリオ（振る舞い）を抽出し、Gherkin形式で記述する。
- Given-When-Then構造で、開発者・QA・ステークホルダーが共通理解できる実行可能なドキュメントを作成する。
- ハッピーパス（正常系）からエラーケース、境界値テストまでを網羅的に定義する。

## 前提

- `docs/project/requirements/05-user-stories.md` が作成されていること（先に `InitializeProject` (a-002) を実行）。
- `docs/project/behavior/` ディレクトリが存在すること（存在しない場合は先に `SetupDocStructure` (a-001) を実行）。
- ユーザーが各機能の具体的な動作例を説明できること。

## 手順

### 1. ディレクトリと前提条件の確認

- `docs/project/behavior/` ディレクトリの存在を確認：

  ```bash
  ls -la docs/project/behavior/ 2>/dev/null || echo "ディレクトリが存在しません"
  ```

- ディレクトリが存在しない場合：
  - ユーザーに通知：「`docs/project/behavior/` ディレクトリが見つかりません。先に `SetupDocStructure` (a-001) を実行してください。」

- ユーザーストーリーの確認：
  - `docs/project/requirements/05-user-stories.md` を読み込み、内容を確認する。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/02-behavior/01-scenarios.md" "docs/project/behavior/01-scenarios.md"
  ```

### 3. 分析と提案

- `docs/project/requirements/05-user-stories.md` を分析し、シナリオ作成対象の機能（Feature）をリストアップする。
- 各機能について、考えられるシナリオ案（ハッピーパスと代表的なエラーケース）をユーザーに提案する：
  - 「以下のユーザーストーリーに基づいて、シナリオを作成します：」
  - 「機能: [機能名] (US-XXX)」
    - 「シナリオ案1: [ハッピーパス]」
    - 「シナリオ案2: [エラーケース]」

### 4. ヒアリングと記入

各機能について、以下の順序でヒアリングを行い、`docs/project/behavior/01-scenarios.md` を更新する。

#### 4.1 Feature情報の定義

- 機能名、説明、対応するユーザーストーリー（As a/I want/So that）を記入する。
- **Background**（共通前提条件）がある場合は定義する。

#### 4.2 シナリオの作成（ハッピーパス）

- 「最も基本的な成功シナリオを教えてください。」
- **Given**（前提）、**When**（アクション）、**Then**（結果）を確認し、Gherkin形式で記述する。
- UI操作の詳細ではなく、ユーザーの意図を記述するよう注意する。

#### 4.3 エラーケース・境界値の作成

- 「エラーケースや境界値（エッジケース）はありますか？」
- 必要に応じて **Scenario Outline**（パラメータ化）の使用を提案し、Examplesテーブルを作成する。

#### 4.4 タグ付け

- シナリオID（`@SC-XXX`）を採番する。
- 適切なタグ（`@smoke`, `@happy-path`, `@error-handling` など）を付与する。

### 5. シナリオ一覧テーブルの更新

- ドキュメント冒頭の「シナリオ一覧」テーブルを更新し、作成した全シナリオのID、機能、シナリオ名、優先度を記載する。

### 6. レビューと確認

- 作成したシナリオをユーザーに提示し、以下を確認：
  - 「シナリオは実際の動作を正しく表現していますか？」
  - 「漏れているケースはありませんか？」
  - 「非技術者でも理解できる表現になっていますか？」

### 7. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # シナリオ一覧テーブルの確認
     grep "| シナリオID | 機能 |" docs/project/behavior/01-scenarios.md && echo "OK" || echo "MISSING: Table Header"
     # Feature定義の確認
     grep "Feature:" docs/project/behavior/01-scenarios.md && echo "OK" || echo "MISSING: Feature definition"
     # Scenario定義の確認
     grep "Scenario:" docs/project/behavior/01-scenarios.md && echo "OK" || echo "MISSING: Scenario definition"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/behavior/01-scenarios.md` が作成されている
     - [ ] シナリオ一覧テーブルが更新されている
     - [ ] 各FeatureがGherkin形式で記述されている
     - [ ] 正常系と異常系のシナリオが網羅されている

### 8. Git への追加（オプション）

- ユーザーに確認：「作成したシナリオドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/behavior/
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: 振る舞い仕様（シナリオ）の作成

  - ユーザーストーリーに基づくGherkinシナリオを追加
  - 正常系・異常系・境界値ケースを定義
  ```

## 完了条件

- `docs/project/behavior/01-scenarios.md` が作成されている。
- ユーザーストーリーに対応する具体的なシナリオ（Given-When-Then）が記述されている。
- シナリオ一覧テーブルがメンテナンスされている。
- ユーザーが内容を承認している。

## エスカレーション

- ユーザーストーリーが不明確でシナリオ化できない場合：
  - 「ユーザーストーリーの詳細化が必要です。`InitializeProject` ワークフローに戻って要件を明確にしましょう。」と提案する。
- 実装詳細への依存が強すぎる場合：
  - 「UI操作（ボタンクリック等）ではなく、ユーザーの意図（登録する等）に焦点を当てた記述に変更しましょう。」とリファクタリングを提案する。
