---
description: データモデルと画面設計からAPI仕様を定義し、認証方式、エンドポイント一覧、共通レスポンス形式を明確化するワークフロー
---

# DefineAPISpec (a-011)

## 目的

- データモデルと画面設計を基に、API仕様の基本設計を定義する。
- API設計スタイル（REST、GraphQL、gRPC、tRPC）を決定する。
- 認証・認可方式を明確化する。
- エンドポイント一覧（メソッド、パス、説明、認証要否）を定義する。
- 共通レスポンス形式（成功/エラー）を定義する。

## 前提

- `docs/project/design/01-tech-stack.md` が作成されていること（APIスタイル選定済み）。
- `docs/project/design/04-data-model.md` が作成されていること。
- `docs/project/design/03-screen-design.md` が作成されていること。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

- 必要なドキュメントを読み込む：
  - `docs/project/design/01-tech-stack.md`
  - `docs/project/design/04-data-model.md`
  - `docs/project/design/03-screen-design.md`

- ドキュメントが不足している場合、対応するワークフローの実行を促す。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  cp ".windsurf/templates/project/04-design/05-api-spec.md" "docs/project/design/05-api-spec.md"
  ```

### 3. APIスタイルの確認と提案

- 技術スタック（01-tech-stack.md）で選定されたAPIスタイル（REST, GraphQL等）を確認する。
- データモデル（04-data-model.md）と画面設計（03-screen-design.md）から、必要なリソースと操作を抽出する。
- **エンドポイント案の提示**:
  - 「以下のリソースに対するエンドポイントを定義します：」
  - 「Users: 一覧, 詳細, 作成, 更新, 削除」
  - 「Auth: ログイン, 登録, リフレッシュ」

### 4. 詳細定義（インタビュー）

ユーザーからのフィードバックを受け、詳細を定義する。

#### 4.1 認証・認可

- 認証方式（JWT, OAuth等）、トークンの扱い（Cookie vs Header）
- 認可スコープやロールの定義

#### 4.2 エンドポイント詳細

- 各リソースのパス設計（RESTful原則の適用）
- 認証の要否（Public vs Private）
- CRUD以外の特殊なアクション（`/cancel`, `/publish` 等）

#### 4.3 共通レスポンス形式

- 成功時のレスポンス構造（`{ data: ... }` ラップの有無）
- エラー時のレスポンス構造（`{ error: { code, message } }` 等）
- ページネーションの仕様

### 5. ドキュメント作成

- `docs/project/design/05-api-spec.md` に決定事項を記入する。
- **必須項目**:
  - 認証・認可仕様
  - エンドポイント一覧（リソース別）
  - 共通レスポンス形式

### 6. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # 認証セクションの確認
     grep "## 認証・認可" docs/project/design/05-api-spec.md && echo "OK" || echo "MISSING: Auth section"
     # エンドポイント一覧の確認
     grep "## エンドポイント一覧" docs/project/design/05-api-spec.md && echo "OK" || echo "MISSING: Endpoints"
     # レスポンス形式の確認
     grep "## 共通レスポンス形式" docs/project/design/05-api-spec.md && echo "OK" || echo "MISSING: Response format"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/05-api-spec.md` が作成されている
     - [ ] 認証方式が明確に定義されている
     - [ ] 主要なリソースのCRUDエンドポイントが網羅されている

### 7. Git への追加（オプション）

- ユーザーに確認：「作成したAPI仕様ドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/05-api-spec.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: API仕様（基本設計）の作成

  - 認証・認可方式の定義
  - エンドポイント一覧と共通レスポンス形式を定義
  ```

## 完了条件

- `docs/project/design/05-api-spec.md` が作成されている。
- 認証・認可の仕組みが定義されている。
- エンドポイント一覧（メソッド、パス、認証要否）が定義されている。
- 共通レスポンス形式（成功/エラー）が定義されている。
- ユーザーが内容を承認している。

## エスカレーション

- APIスタイル（REST/GraphQL）が未定の場合：
  - 「APIスタイルが未定です。`DefineTechStack` (a-007) に戻って選定してください。」
- データモデルとの不整合がある場合：
  - 「データモデルに存在しないリソースのエンドポイントが要求されています。データモデルを見直すか、APIだけの概念として定義するか確認してください。」
