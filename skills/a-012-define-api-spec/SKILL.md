---
name: a-012-define-api-spec
description: データモデルと画面設計から API 仕様（認証方式・エンドポイント一覧・共通レスポンス形式）を定義する。データモデル確定後、フロント/バック間のインターフェースを固める際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineAPISpec (a-012)

## 目的

- データモデルと画面設計を基に、API 仕様の基本設計を定義する。
- API 設計スタイル（REST、GraphQL、gRPC、tRPC）を決定する。
- 認証・認可方式を明確化する。
- エンドポイント一覧（メソッド、パス、説明、認証要否）を定義する。
- 共通レスポンス形式（成功/エラー）を定義する。

## 前提

- `docs/project/design/01-tech-stack.md` が作成されていること（API スタイル選定済み）。
- `docs/project/design/05-data-model.md` が作成されていること。
- `docs/project/design/03-screen-design.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

以下を読み込む:

- `docs/project/design/01-tech-stack.md`
- `docs/project/design/05-data-model.md`
- `docs/project/design/03-screen-design.md`

不足があれば対応スキルの実行を促す。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/06-api-spec.md" "docs/project/design/06-api-spec.md"
```

### 3. API スタイルの確認と提案

技術スタックで選定された API スタイル（REST, GraphQL 等）を確認し、データモデルと画面設計から必要なリソースと操作を抽出する。スタイル別の特徴は [examples/api-templates.md](examples/api-templates.md#api-スタイル別の特徴) を参照。

- 「Users: 一覧, 詳細, 作成, 更新, 削除」
- 「Auth: ログイン, 登録, リフレッシュ」

### 4. 詳細定義（インタビュー）

#### 4.1 認証・認可

認証方式（JWT / OAuth 等）、トークンの保存先（Cookie vs Header）、ロール・スコープ定義。テンプレートは [examples/api-templates.md](examples/api-templates.md#認証認可仕様のテンプレート) を参照。

#### 4.2 エンドポイント詳細

各リソースのパス設計（RESTful 原則）、認証の要否、特殊アクション（`/cancel`, `/publish` 等）。一覧テーブルとパス設計原則は [examples/api-templates.md](examples/api-templates.md#エンドポイント一覧テーブル) を参照。

#### 4.3 共通レスポンス形式

成功・エラー構造、ページネーション、エラーコード体系。JSON サンプルは [examples/api-templates.md](examples/api-templates.md#共通レスポンス形式) を参照。

### 5. ドキュメント作成

`docs/project/design/06-api-spec.md` に以下を記入する:

- 認証・認可仕様
- エンドポイント一覧（リソース別）
- 共通レスポンス形式
- エラーコード体系

### 6. 構造チェック

```bash
grep "## 認証・認可" docs/project/design/06-api-spec.md \
  && grep "## エンドポイント一覧" docs/project/design/06-api-spec.md \
  && grep "## 共通レスポンス形式" docs/project/design/06-api-spec.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/project/design/06-api-spec.md
git commit -m "docs: API 仕様（基本設計）の作成"
```

## 完了条件

- `docs/project/design/06-api-spec.md` が作成されている。
- 認証・認可の仕組みが定義されている。
- エンドポイント一覧（メソッド、パス、認証要否）が定義されている。
- 共通レスポンス形式（成功/エラー）が定義されている。
- ユーザーが内容を承認している。

## エスカレーション

- **API スタイルが未定**: 「`/a-007-define-tech-stack` に戻って選定してください。」
- **データモデルとの不整合**: 「データモデルに存在しないリソースのエンドポイントが要求されています。データモデルを見直すか、API だけの概念として定義するか確認してください。」

## 参考

- [examples/api-templates.md](examples/api-templates.md) — API スタイル比較、認証・認可テンプレート、エンドポイント一覧、共通レスポンス、エラーコード体系
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー質問、Git 追加例
