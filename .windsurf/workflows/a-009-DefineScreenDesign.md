---
description: ユーザーストーリーとシナリオから画面一覧を抽出し、画面遷移フローとレスポンシブデザインポリシーを定義するワークフロー
---

# DefineScreenDesign (a-009)

## 目的

- ユーザーストーリーとシナリオを基に、必要な画面を網羅的に抽出する。
- 各画面の役割、アクセス権限、考慮すべき状態（Empty State含む）を明確化する。
- 画面遷移フローをMermaid図で可視化し、ユーザーの導線を明確にする。
- レスポンシブデザインポリシー（ブレークポイント、デバイス対応方針）を定義する。

## 前提

- `docs/project/requirements/05-user-stories.md` が作成されていること。
- `docs/project/behavior/01-scenarios.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

- 必要なドキュメントを読み込む：
  - `docs/project/requirements/05-user-stories.md`
  - `docs/project/behavior/01-scenarios.md`
  - `docs/project/design/01-tech-stack.md` (存在する場合)

- ドキュメントが不足している場合、対応するワークフローの実行を促す。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  cp ".windsurf/templates/project/04-design/03-screen-design.md" "docs/project/design/03-screen-design.md"
  ```

### 3. 画面の抽出と提案

- シナリオのGiven/When/Thenステップから、必要な画面を抽出する。
- 標準的な画面（ログイン、404エラー、設定など）を追加提案する。
- **画面リスト案を提示**:
  - 「以下の画面が必要と考えられます：」
  - 「[画面名] (役割: [説明])」

### 4. 詳細定義と遷移フロー

ユーザーからのフィードバックを受け、以下を定義する。

#### 4.1 各画面の詳細

- 画面ID、名称、URLパス
- アクセス権限（誰が見れるか）
- **重要な状態**: 初回訪問(Empty State)、ロード中、エラー時など

#### 4.2 画面遷移フロー

- 主要なユーザーフロー（認証、メイン機能、エラー）をMermaid図で表現する。
- デッドエンド（戻れない画面）がないか確認する。

### 5. レスポンシブデザインポリシー

- 技術スタック（Tailwind等）に合わせたブレークポイントを定義する。
- モバイルファーストかデスクトップファーストか、方針を決定する。
- デバイスごとのレイアウトパターン（ハンバーガーメニュー、ドロワー等）を定義する。

### 6. ドキュメント作成

- `docs/project/design/03-screen-design.md` に決定事項を記入する。
- **必須項目**:
  - 画面一覧テーブル
  - 画面遷移図 (Mermaid)
  - レスポンシブデザインポリシー

### 7. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # 画面一覧セクションの確認
     grep "## 画面一覧" docs/project/design/03-screen-design.md && echo "OK" || echo "MISSING: Screen list"
     # 画面遷移図の確認
     grep "\`\`\`mermaid" docs/project/design/03-screen-design.md && echo "OK" || echo "MISSING: Flowchart"
     # レスポンシブポリシーの確認
     grep "## レスポンシブデザインポリシー" docs/project/design/03-screen-design.md && echo "OK" || echo "MISSING: Responsive policy"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/03-screen-design.md` が作成されている
     - [ ] 主要な画面がすべて網羅されている
     - [ ] Empty Stateについて考慮されている

### 8. Git への追加（オプション）

- ユーザーに確認：「作成した画面設計ドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/03-screen-design.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: 画面設計ドキュメントの作成

  - 画面一覧と遷移フロー(Mermaid)を追加
  - レスポンシブデザインポリシーを定義
  ```

## 完了条件

- `docs/project/design/03-screen-design.md` が作成されている。
- 全画面のリストと役割が定義されている。
- 画面遷移が可視化されている。
- レスポンシブ対応方針が明確になっている。
- ユーザーが内容を承認している。

## エスカレーション

- シナリオ不足で画面が特定できない場合：
  - 「シナリオが不足しています。`CreateScenarios` (a-003) に戻ってユーザーフローを明確にしましょう。」と提案する。
- 画面数が多すぎる場合：
  - 「初期リリースには多すぎる可能性があります。MVPに必要な画面に絞り込みませんか？」と提案する。
