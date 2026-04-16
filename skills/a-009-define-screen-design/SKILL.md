---
name: a-009-define-screen-design
description: ユーザーストーリーとシナリオから画面一覧・遷移フロー・レスポンシブポリシーを定義する。技術選定後、UI/UX 設計を開始する際に使用。
disable-model-invocation: true
---

# DefineScreenDesign (a-009)

## 目的

- ユーザーストーリーとシナリオを基に、必要な画面を網羅的に抽出する。
- 各画面の役割、アクセス権限、考慮すべき状態（Empty State 含む）を明確化する。
- 画面遷移フローを Mermaid 図で可視化し、ユーザーの導線を明確にする。
- レスポンシブデザインポリシー（ブレークポイント、デバイス対応方針）を定義する。

## 前提

- `docs/project/requirements/05-user-stories.md` が作成されていること。
- `docs/project/behavior/01-scenarios.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

以下を読み込む:

- `docs/project/requirements/05-user-stories.md`
- `docs/project/behavior/01-scenarios.md`
- `docs/project/design/01-tech-stack.md`（存在する場合）

不足があれば対応スキル（`/a-002`, `/a-003`, `/a-007`）の実行を促す。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/03-screen-design.md" "docs/project/design/03-screen-design.md"
```

### 3. 画面の抽出と提案

- シナリオの Given/When/Then から必要な画面を抽出。
- 標準画面（ログイン、404、設定等）を追加提案。
- 「[画面名] (役割: [説明])」の形式で一覧化。

画面一覧のテーブル例は [examples/screen-templates.md](examples/screen-templates.md#画面一覧テーブル) を参照。

### 4. 詳細定義と遷移フロー

#### 4.1 各画面の詳細

画面 ID、名称、URL パス、アクセス権限、重要な状態（Empty / Loading / Error / Success）。状態観点は [examples/screen-templates.md](examples/screen-templates.md#重要な状態の観点) を参照。

#### 4.2 画面遷移フロー

主要なユーザーフロー（認証、メイン機能、エラー）を Mermaid 図で表現する。デッドエンドがないか確認する。記述例は [examples/screen-templates.md](examples/screen-templates.md#画面遷移図mermaid) を参照。

### 5. レスポンシブデザインポリシー

技術スタック（Tailwind 等）に合わせたブレークポイントと方針を定義する。ブレークポイント表と方針例は [examples/screen-templates.md](examples/screen-templates.md#レスポンシブデザインポリシー) を参照。

### 6. ドキュメント作成

`docs/project/design/03-screen-design.md` に以下を記入する:

- 画面一覧テーブル
- 画面遷移図（Mermaid）
- レスポンシブデザインポリシー

### 7. 構造チェック

```bash
grep "## 画面一覧" docs/project/design/03-screen-design.md \
  && grep "\`\`\`mermaid" docs/project/design/03-screen-design.md \
  && grep "## レスポンシブデザインポリシー" docs/project/design/03-screen-design.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 8. Git への追加（任意）

```bash
git add docs/project/design/03-screen-design.md
git commit -m "docs: 画面設計ドキュメントの作成"
```

## 完了条件

- `docs/project/design/03-screen-design.md` が作成されている。
- 全画面のリストと役割が定義されている。
- 画面遷移が可視化されている。
- レスポンシブ対応方針が明確になっている。
- ユーザーが内容を承認している。

## エスカレーション

- **シナリオ不足で画面が特定できない**: 「`/a-003-create-scenarios` に戻ってユーザーフローを明確にしましょう。」
- **画面数が多すぎる**: 「初期リリースには多すぎる可能性があります。MVP に必要な画面に絞り込みませんか？」

## 参考

- [examples/screen-templates.md](examples/screen-templates.md) — 画面一覧テーブル、状態観点、Mermaid 遷移図、レスポンシブ方針
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー質問、Git 追加例
