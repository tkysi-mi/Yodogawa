---
name: a-011-define-data-model
description: ドメインモデルと画面設計からデータベース構造（ERD）を定義し、エンティティ、属性、リレーションシップ、制約を明確化するワークフロー
---

# DefineDataModel (a-011)

## 目的

- ドメインモデル（Aggregates）と画面設計を基に、データベース構造を定義する。
- エンティティ（テーブル）、属性（カラム）、リレーションシップを明確化する。
- データ型、制約（NOT NULL、UNIQUE、CHECK）、インデックス戦略を決定する。
- Mermaid ERD（Entity Relationship Diagram）で視覚化し、開発者間の認識を統一する。

## 前提

- `docs/project/domain/01-domain-model.md` が作成されていること。
- `docs/project/design/01-tech-stack.md` が作成されていること（DB選定済み）。
- `docs/project/design/03-screen-design.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

- 必要なドキュメントを読み込む：
  - `docs/project/domain/01-domain-model.md`
  - `docs/project/design/01-tech-stack.md`
  - `docs/project/design/03-screen-design.md`

- ドキュメントが不足している場合、対応するワークフローの実行を促す。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/04-design/05-data-model.md" "docs/project/design/05-data-model.md"
  ```

### 3. エンティティの抽出と提案

- **ドメインモデルから**: Aggregate Rootおよび内部エンティティを抽出。
- **画面設計から**: 表示・入力項目から必要なデータ構造（履歴、設定、ログ等）を抽出。
- **エンティティ一覧案を提示**:
  - 「以下のエンティティを定義します：」
  - 「[エンティティ名] (対応するAggregate: [名前])」

### 4. 詳細定義（インタビュー）

ユーザーからのフィードバックを受け、各エンティティの詳細を定義する。

#### 4.1 基本定義

- テーブル名（物理名）、論理名、説明
- 主キー（ID）の戦略（Auto Increment / UUID / CUID）

#### 4.2 属性（カラム）

- カラム名、データ型（DB製品に合わせて具体的に）
- 制約（NOT NULL, UNIQUE, DEFAULT）
- 監査カラム（created_at, updated_at）の有無

#### 4.3 リレーションシップ

- 関連するエンティティ（1:1, 1:N, N:M）
- 外部キー制約（ON DELETE CASCADE / SET NULL / RESTRICT）

### 5. ERDの作成と正規化

- 抽出したエンティティとリレーションシップを Mermaid ERD 形式で記述する。
- 正規化（1NF-3NF）を確認し、意図的な非正規化があれば理由を記録する。
- インデックス戦略（検索頻度の高いカラム、ユニーク制約）を定義する。

### 6. ドキュメント作成

- `docs/project/design/05-data-model.md` に決定事項を記入する。
- **必須項目**:
  - エンティティ一覧
  - リレーションシップ定義
  - ERD (Mermaid)

### 7. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：
  1. **構造確認**:

     ```bash
     # エンティティ一覧の確認
     grep "## エンティティ一覧" docs/project/design/05-data-model.md && echo "OK" || echo "MISSING: Entities"
     # ERDの確認
     grep "\`\`\`mermaid" docs/project/design/05-data-model.md && echo "OK" || echo "MISSING: ERD"
     # リレーションシップ定義の確認
     grep "## リレーションシップ" docs/project/design/05-data-model.md && echo "OK" || echo "MISSING: Relationships"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/05-data-model.md` が作成されている
     - [ ] 全エンティティの物理名・論理名が定義されている
     - [ ] ERDが正しくレンダリングされる

### 8. Git への追加（オプション）

- ユーザーに確認：「作成したデータモデルドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/05-data-model.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: データモデル（ERD）の定義

  - エンティティ、属性、リレーションシップを定義
  - MermaidによるER図を追加
  ```

## 完了条件

- `docs/project/design/05-data-model.md` が作成されている。
- データベーススキーマ（テーブル、カラム、型、制約）が定義されている。
- エンティティ間の関係性が可視化（ERD）されている。
- ユーザーが内容を承認している。

## エスカレーション

- ドメインモデルとの不整合がある場合：
  - 「ドメインモデルのAggregate構造とデータモデルが乖離しています。ORMのマッピング戦略を確認するか、ドメインモデルを見直してください。」
- パフォーマンス懸念がある場合：
  - 「正規化によりJOINが多発する可能性があります。Read Model（参照用テーブル）の導入や、意図的な非正規化を検討しませんか？」
