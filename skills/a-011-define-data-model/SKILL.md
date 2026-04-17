---
name: a-011-define-data-model
description: ドメインモデルと画面設計からデータベース構造（ERD・エンティティ・属性・リレーションシップ・制約）を定義する。画面設計後、永続化層を設計する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineDataModel (a-011)

## 目的

- ドメインモデル（Aggregates）と画面設計を基に、データベース構造を定義する。
- エンティティ（テーブル）、属性（カラム）、リレーションシップを明確化する。
- データ型、制約（NOT NULL、UNIQUE、CHECK）、インデックス戦略を決定する。
- Mermaid ERD（Entity Relationship Diagram）で視覚化し、開発者間の認識を統一する。

## 前提

- `docs/project/domain/01-domain-model.md` が作成されていること。
- `docs/project/design/01-tech-stack.md` が作成されていること（DB 選定済み）。
- `docs/project/design/03-screen-design.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

以下を読み込む:

- `docs/project/domain/01-domain-model.md`
- `docs/project/design/01-tech-stack.md`
- `docs/project/design/03-screen-design.md`

不足があれば対応スキルの実行を促す。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/05-data-model.md" "docs/project/design/05-data-model.md"
```

### 3. エンティティの抽出と提案

- **ドメインモデルから**: Aggregate Root および内部エンティティを抽出
- **画面設計から**: 表示・入力項目から必要なデータ構造（履歴、設定、ログ等）を抽出
- 「[エンティティ名] (対応 Aggregate: [名前])」形式で一覧化

エンティティ一覧の記述例は [examples/erd-templates.md](examples/erd-templates.md#エンティティ一覧テーブル) を参照。

### 4. 詳細定義（インタビュー）

#### 4.1 基本定義

- テーブル名（物理名）、論理名、説明
- 主キー戦略（Auto Increment / UUID / CUID）— 選択ガイドは [examples/erd-templates.md](examples/erd-templates.md#主キー戦略) を参照

#### 4.2 属性（カラム）

- カラム名、データ型（DB 製品に合わせて具体化）
- 制約（NOT NULL, UNIQUE, DEFAULT, CHECK）
- 監査カラム（created_at, updated_at）の有無

カラム定義の例は [examples/erd-templates.md](examples/erd-templates.md#カラム定義テンプレート) を参照。

#### 4.3 リレーションシップ

- 関連（1:1 / 1:N / N:M）
- 外部キー制約（ON DELETE CASCADE / SET NULL / RESTRICT）— 選択基準は [examples/erd-templates.md](examples/erd-templates.md#外部キー削除動作の選択) を参照

### 5. ERD の作成と正規化

- Mermaid ERD 形式で記述（テンプレートは [examples/erd-templates.md](examples/erd-templates.md#mermaid-erd-記述例) を参照）
- 正規化（1NF-3NF）を確認。意図的な非正規化があれば理由を記録
- インデックス戦略（検索頻度、UNIQUE、複合インデックス）を定義

正規化の目安は [reference/structure-check.md](reference/structure-check.md#正規化レベルの目安) を参照。

### 6. ドキュメント作成

`docs/project/design/05-data-model.md` に以下を記入する:

- エンティティ一覧
- リレーションシップ定義
- ERD（Mermaid）
- インデックス戦略・非正規化の記録

### 7. 構造チェック

```bash
grep "## エンティティ一覧" docs/project/design/05-data-model.md \
  && grep "\`\`\`mermaid" docs/project/design/05-data-model.md \
  && grep "## リレーションシップ" docs/project/design/05-data-model.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 8. Git への追加（任意）

```bash
git add docs/project/design/05-data-model.md
git commit -m "docs: データモデル（ERD）の定義"
```

## 完了条件

- `docs/project/design/05-data-model.md` が作成されている。
- データベーススキーマ（テーブル、カラム、型、制約）が定義されている。
- エンティティ間の関係性が可視化（ERD）されている。
- ユーザーが内容を承認している。

## エスカレーション

- **ドメインモデルとの不整合**: 「Aggregate 構造とデータモデルが乖離しています。ORM のマッピング戦略を確認するか、ドメインモデルを見直してください。」
- **パフォーマンス懸念**: 「正規化により JOIN が多発する可能性があります。Read Model や意図的な非正規化を検討しませんか？」

## 参考

- [examples/erd-templates.md](examples/erd-templates.md) — エンティティ一覧、カラム定義、主キー戦略、外部キー動作、Mermaid ERD、インデックス・非正規化の例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、正規化レベル、レビュー質問
