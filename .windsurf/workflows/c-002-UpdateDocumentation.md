---
description: 実装完了後にタスクドキュメントとプロジェクトドキュメントを実装内容に合わせて更新するワークフロー
auto_execution_mode: 1
---

# UpdateDocumentation (c-002)

## 目的

- 実装完了後にタスクレベルのドキュメント（a-definition.md, b-research.md, c-implementation.md）を実装内容に合わせて更新する。
- プロジェクトレベルのドキュメント（要件、ドメインモデル、API仕様、データモデルなど）を実装済み機能に合わせて更新する。
- 計画時と実装時の差異を記録し、次のタスクへのフィードバックとする。
- コードとドキュメントの一貫性を保ち、ドキュメント腐敗を防止する。
- チームメンバーや将来の開発者が正確な情報を得られるようにする。

## 前提

- タスクの実装が完了していること（`/c-001-ImplementTask` で実装済み）
- タスクディレクトリが存在すること（`docs/tasks/task000001-{スラッグ}/`）
- タスクドキュメント（a-definition.md, b-research.md, c-implementation.md）が存在すること
- 実装タスクリスト（c-implementation.md）の全ステップが完了していること
- プロジェクトドキュメント構造が存在すること（docs/01-requirements/, docs/03-domain/, docs/04-design/ など）
- Git リポジトリが初期化されていること

## 手順

### 1. 実装完了の確認

#### 1.1. タスクディレクトリの特定

**タスクIDの確認**:

- 更新対象のタスクIDを確認（例: task000001-email-verification）
- タスクディレクトリパス: `docs/tasks/task000001-{スラッグ}/`

#### 1.2. 実装完了状態の検証

**検証項目**:

- [ ] 実装タスクリスト（c-implementation.md）の全ステップが完了している（全チェックボックスが `[x]`）
- [ ] 全フェーズの受け入れ基準が満たされている
- [ ] テストが全て通っている
- [ ] PR/MRが作成されている（該当する場合）

**未完了の場合**:

- 「タスク {task-id} の実装がまだ完了していません。先に `/c-001-ImplementTask` を実行してください。」

**推奨**:

- `/c-001-ImplementTask` の最後に表示される推奨アクションから続けて実行することが最も効率的です。

### 2. 実装内容の確認

#### 2.1. 実装ファイルの特定

**変更されたファイルの確認**:

```bash
# タスク用ブランチの変更を確認
git diff main..HEAD --name-only

# または
git log --name-only --oneline main..HEAD
```

**確認すべき項目**:

- [ ] 新規作成されたファイル
- [ ] 変更されたファイル
- [ ] 削除されたファイル
- [ ] 追加された依存関係（package.json, requirements.txt など）
- [ ] データベーススキーマの変更（マイグレーションファイル）
- [ ] 環境変数の追加（.env.example）

#### 2.2. 計画との差異の確認

**実装タスクリスト（c-implementation.md）と実際の実装を比較**:

- [ ] 計画通りに実装されたステップ
- [ ] 計画から変更されたステップ（技術的決定の変更）
- [ ] 追加で実装したステップ（計画にない追加実装）
- [ ] スキップしたステップ（不要と判断）

**差異の記録**:
実装中に判明した変更点をリストアップ:

- 技術スタックの変更（例: Prisma → TypeORM）
- アーキテクチャの変更（例: REST → GraphQL）
- データモデルの変更（例: カラム追加・削除）
- API仕様の変更（例: エンドポイント追加・削除）
- 画面遷移の変更（例: 新規画面追加）

### 3. タスクドキュメントの更新

#### 3.1. a-definition.md の更新

**タスク定義ドキュメント**（`docs/tasks/task{id}-{スラッグ}/a-definition.md`）を開く。

**更新すべきセクション**:

**1. 実装内容の更新**:

- 計画時の想定と実際の実装が異なる場合、実際の実装内容を記載
- 追加で実装した機能があれば追記

**2. 受け入れ基準の更新**:

- 計画時の受け入れ基準がすべて満たされているか確認
- 実装中に追加した受け入れ基準があれば追記
- 満たせなかった基準があれば、理由と今後の対応を記載

**3. 技術的決定の記録**:
新しいセクション「## 実装時の技術的決定」を追加（必要に応じて）:

```markdown
## 実装時の技術的決定

- **決定**: TypeORM から Prisma に変更
- **理由**: マイグレーション管理が容易、型安全性が高い
- **影響**: データアクセス層のコード変更、マイグレーションファイルの再作成

- **決定**: JWT トークンの有効期限を 24h から 1h に変更
- **理由**: セキュリティ向上
- **影響**: リフレッシュトークン機能の追加実装
```

**4. 実装結果の記録**:
新しいセクション「## 実装結果」を追加:

```markdown
## 実装結果

- **実装日**: 2024-01-15
- **実装者**: {名前}
- **ブランチ**: task/task000001-email-verification
- **PR/MR**: #123
- **テスト結果**:
  - ユニットテスト: 100% 通過 (カバレッジ 85%)
  - 統合テスト: 100% 通過
  - E2E テスト: 100% 通過
- **デプロイ**: staging 環境にデプロイ済み
```

#### 3.2. b-research.md の更新

**リサーチドキュメント**（`docs/tasks/task{id}-{スラッグ}/b-research.md`）を開く。

**更新すべきセクション**:

**1. 技術選定の更新**:

- 計画時に選定した技術と実際に使用した技術が異なる場合、理由を追記
- 新たに採用したライブラリ・ツールがあれば追記

**2. ベストプラクティスの追記**:
実装中に発見したベストプラクティスを追記:

```markdown
## 実装時に発見したベストプラクティス

- **Email 検証**: SendGrid の Webhook を使用して配信状態を追跡
- **トークン管理**: Redis にトークンを保存し、自動期限切れを利用
- **エラーハンドリング**: Zod を使用してバリデーションエラーを統一
```

**3. 技術的リスクの結果**:
計画時に挙げた技術的リスクの結果を記録:

```markdown
## 技術的リスクの結果

- **リスク**: Email 送信の遅延
  - **結果**: SendGrid の非同期処理で解決、平均送信時間 2 秒
  - **軽減策**: ジョブキューによる非同期処理を実装

- **リスク**: トークンの衝突
  - **結果**: UUID v4 使用により衝突なし
  - **軽減策**: 不要
```

#### 3.3. c-implementation.md の更新

**実装タスクリスト**（`docs/tasks/task{id}-{スラッグ}/c-implementation.md`）を開く。

**更新すべきセクション**:

**1. 完了マークの確認**:

- 全ステップのチェックボックスが `[x]` になっているか確認
- 未完了のステップがあれば理由を記載

**2. 実装メモの追記**:
各ステップに実装時のメモを追記（必要に応じて）:

```markdown
- [x] **ステップ 1:** データベーススキーマの定義
  - **成果物:** `migrations/001_create_users_table.sql`
  - **詳細:** User テーブルに `email_verified`, `email_verification_token`, `email_verification_expires_at` カラムを追加
  - **実装メモ**:
    - Prisma migrate を使用
    - 既存ユーザーには email_verified = false をデフォルト設定
    - インデックスを email_verification_token に追加（検索高速化）
```

**3. 実装時間の記録**:
各フェーズの実装時間を記録:

```markdown
## フェーズ 1: データモデルと API の実装

**実装時間**: 4 時間（見積もり: 3 時間）

### ステップ
...
```

**4. 振り返りセクションの追加**:
新しいセクション「## 振り返り」を追加:

```markdown
## 振り返り

### うまくいったこと
- Prisma の型安全性により、コンパイル時にエラーを検出できた
- TDD アプローチで品質を担保できた
- ステップを小さく分けたことで、進捗管理が容易だった

### 改善すべきこと
- Email 送信のテストが複雑だった（モックの設定に時間がかかった）
- トークン生成ロジックの設計に予想以上に時間がかかった

### 次のタスクへのフィードバック
- Email 送信のモックユーティリティを共通化する
- トークン生成ロジックを再利用可能なライブラリとして抽出する
```

### 4. プロジェクトドキュメントの更新

#### 4.1. 更新が必要なドキュメントの特定

実装内容に応じて、以下のドキュメントの更新が必要か確認:

**要件ドキュメント**（`docs/01-requirements/`）:

- [ ] **02-features-implemented.md**: 実装済み機能リストに追加
- [ ] **03-features-planned.md**: 計画中機能リストから削除（実装済みに移動）
- [ ] **05-user-stories.md**: ユーザーストーリーのステータスを更新

**ドメインドキュメント**（`docs/03-domain/`）:

- [ ] **01-domain-model.md**: 新しいエンティティ・値オブジェクトを追加
- [ ] **02-ubiquitous-language.md**: 新しいドメイン用語を追加

**設計ドキュメント**（`docs/04-design/`）:

- [ ] **03-screen-design.md**: 新しい画面・UI コンポーネントを追加
- [ ] **04-data-model.md**: 新しいテーブル・カラムを追加
- [ ] **05-api-spec.md**: 新しい API エンドポイントを追加
- [ ] **06-architecture.md**: アーキテクチャ変更を反映

**その他**:

- [ ] **README.md**: セットアップ手順、使い方を更新
- [ ] **CHANGELOG.md**: 変更履歴を追加
- [ ] **.env.example**: 新しい環境変数を追加

#### 4.2. features-implemented.md の更新

**実装済み機能リスト**（`docs/01-requirements/02-features-implemented.md`）を開く。

**新機能の追加**:

```markdown
## ユーザー認証・認可

### メール認証機能（新規追加）

**概要**: ユーザー登録時にメールアドレスを検証する機能

**実装内容**:
- ユーザー登録時にメール認証トークンを生成し、メールを送信
- ユーザーがメール内のリンクをクリックすると、メールアドレスが検証される
- 検証済みユーザーのみが特定の機能にアクセスできる

**主要な機能**:
- メール認証トークン生成（UUID v4、有効期限 24 時間）
- メール送信（SendGrid 経由）
- メール検証エンドポイント（`POST /api/auth/verify-email`）
- 検証済みフラグ管理（`email_verified` カラム）

**関連タスク**: task000001-email-verification

**実装日**: 2024-01-15

**PR/MR**: #123
```

#### 4.3. features-planned.md の更新

**計画中機能リスト**（`docs/01-requirements/03-features-planned.md`）を開く。

**実装済み機能の削除**:

- 実装完了した機能をリストから削除
- または、ステータスを「実装済み」に変更し、`02-features-implemented.md` への参照を追加

#### 4.4. domain-model.md の更新

**ドメインモデル**（`docs/03-domain/01-domain-model.md`）を開く。

**エンティティの追加・更新**:

```markdown
## User（ユーザー）

**概要**: システムのユーザーアカウント

**属性**:
- id: ユーザーID（UUID）
- email: メールアドレス（必須、一意）
- password_hash: パスワードハッシュ（必須）
- email_verified: メール検証済みフラグ（新規追加）
- email_verification_token: メール検証トークン（新規追加）
- email_verification_expires_at: トークン有効期限（新規追加）
- created_at: 作成日時
- updated_at: 更新日時

**振る舞い**:
- register(): ユーザー登録
- sendVerificationEmail(): 検証メール送信（新規追加）
- verifyEmail(token): メール検証（新規追加）
- login(): ログイン
- logout(): ログアウト

**制約**:
- メールアドレスは一意である必要がある
- 検証トークンは24時間で期限切れとなる（新規追加）
- パスワードは最低8文字以上である必要がある
```

#### 4.5. ubiquitous-language.md の更新

**ユビキタス言語**（`docs/03-domain/02-ubiquitous-language.md`）を開く。

**新しい用語の追加**:

```markdown
## メール検証（Email Verification）

**定義**: ユーザーが登録したメールアドレスが有効であることを確認するプロセス

**コンテキスト**: ユーザー認証・認可

**使用例**:
- 「ユーザー登録後、メール検証を実施する」
- 「メール検証が完了していないユーザーは、一部機能にアクセスできない」

**関連用語**:
- メール検証トークン（Email Verification Token）
- 検証済みフラグ（Email Verified Flag）

---

## メール検証トークン（Email Verification Token）

**定義**: メールアドレスの所有権を確認するための一時的なトークン

**コンテキスト**: ユーザー認証・認可

**技術的詳細**:
- UUID v4 形式
- 有効期限: 24 時間
- 一度使用したら無効化

**使用例**:
- 「メール検証トークンを生成し、ユーザーにメール送信する」
- 「トークンが有効期限内であれば、メール検証を完了する」
```

#### 4.6. data-model.md の更新

**データモデル**（`docs/04-design/04-data-model.md`）を開く。

**テーブルの追加・更新**:

```markdown
## users テーブル

**概要**: ユーザーアカウント情報

| カラム名 | データ型 | NULL | デフォルト値 | 説明 | 追加日 |
|---------|---------|------|------------|------|--------|
| id | UUID | NOT NULL | gen_random_uuid() | ユーザーID（主キー） | 2024-01-10 |
| email | VARCHAR(255) | NOT NULL | - | メールアドレス（一意） | 2024-01-10 |
| password_hash | VARCHAR(255) | NOT NULL | - | パスワードハッシュ | 2024-01-10 |
| email_verified | BOOLEAN | NOT NULL | false | メール検証済みフラグ | 2024-01-15（新規追加） |
| email_verification_token | UUID | NULL | - | メール検証トークン | 2024-01-15（新規追加） |
| email_verification_expires_at | TIMESTAMP | NULL | - | トークン有効期限 | 2024-01-15（新規追加） |
| created_at | TIMESTAMP | NOT NULL | now() | 作成日時 | 2024-01-10 |
| updated_at | TIMESTAMP | NOT NULL | now() | 更新日時 | 2024-01-10 |

**インデックス**:
- PRIMARY KEY: id
- UNIQUE: email
- INDEX: email_verification_token（新規追加、2024-01-15）

**制約**:
- email: 一意制約
- email_verification_expires_at: トークン設定時は必須
```

#### 4.7. api-spec.md の更新

**API 仕様**（`docs/04-design/05-api-spec.md`）を開く。

**新しいエンドポイントの追加**:

```markdown
## POST /api/auth/send-verification-email

**概要**: メール検証用のメールを送信する

**認証**: 必須（JWT）

**リクエスト**:
```json
{
  // リクエストボディなし
}
```

**レスポンス（成功）**:

```json
{
  "message": "Verification email sent successfully",
  "expiresAt": "2024-01-16T12:00:00Z"
}
```

**レスポンス（エラー）**:

- 401 Unauthorized: 認証トークンが無効
- 400 Bad Request: メールが既に検証済み

---

## POST /api/auth/verify-email

**概要**: メール検証トークンを使用してメールアドレスを検証する

**認証**: 不要

**リクエスト**:

```json
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**レスポンス（成功）**:

```json
{
  "message": "Email verified successfully",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**レスポンス（エラー）**:

- 400 Bad Request: トークンが無効または期限切れ
- 404 Not Found: ユーザーが見つからない

```

#### 4.8. screen-design.md の更新（該当する場合）

**画面設計**（`docs/04-design/03-screen-design.md`）を開く。

**新しい画面の追加**:
```markdown
## メール検証完了画面

**パス**: `/verify-email?token={token}`

**概要**: メール検証リンクをクリックした際に表示される画面

**UI コンポーネント**:
- ヘッダー（アプリ名、ロゴ）
- メッセージエリア
  - 成功時: 「メールアドレスが検証されました。ログインしてください。」
  - 失敗時: 「トークンが無効または期限切れです。再度検証メールを送信してください。」
- アクションボタン
  - 成功時: 「ログインする」ボタン（→ /login）
  - 失敗時: 「検証メール再送信」ボタン（→ /resend-verification）

**画面遷移**:
- 成功時: 「ログインする」クリック → ログイン画面（/login）
- 失敗時: 「検証メール再送信」クリック → ログイン画面（/login）

**実装ファイル**: `src/pages/VerifyEmail.tsx`

**スクリーンショット**: （該当する場合）
```

#### 4.9. architecture.md の更新（該当する場合）

**アーキテクチャ**（`docs/04-design/06-architecture.md`）を開く。

**アーキテクチャ変更の記録**:

- 新しいレイヤー・コンポーネントを追加した場合
- アーキテクチャパターンを変更した場合
- 新しい依存関係を追加した場合

#### 4.10. README.md の更新

**README.md** を開く。

**更新すべきセクション**:

**1. セットアップ手順**:
新しい環境変数が追加された場合:

```markdown
## 環境変数設定

`.env.example` をコピーして `.env` ファイルを作成:

```bash
cp .env.example .env
```

以下の環境変数を設定:

- `DATABASE_URL`: データベース接続URL
- `JWT_SECRET`: JWT トークンの秘密鍵
- `SENDGRID_API_KEY`: SendGrid API キー（新規追加）
- `SENDGRID_FROM_EMAIL`: 送信元メールアドレス（新規追加）

```

**2. 機能一覧**:
新機能を追加:
```markdown
## 主な機能

- ユーザー登録・ログイン
- **メール認証（新規追加）**
- パスワードリセット
- プロフィール管理
```

**3. API ドキュメント**:
新しいエンドポイントへのリンク:

```markdown
## API ドキュメント

詳細は [API 仕様書](docs/04-design/05-api-spec.md) を参照してください。

主要なエンドポイント:
- `POST /api/auth/register`: ユーザー登録
- `POST /api/auth/login`: ログイン
- `POST /api/auth/send-verification-email`: メール検証メール送信（新規追加）
- `POST /api/auth/verify-email`: メール検証（新規追加）
```

#### 4.11. CHANGELOG.md の更新

**CHANGELOG.md** を開く。

**変更履歴の追加**:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- メール認証機能を実装（task000001-email-verification）
  - ユーザー登録時にメール検証メールを送信
  - メール検証用のエンドポイント（`POST /api/auth/verify-email`）
  - メール検証トークン管理（有効期限 24 時間）
  - SendGrid 統合によるメール送信

### Changed
- User テーブルに `email_verified`, `email_verification_token`, `email_verification_expires_at` カラムを追加

### Fixed
- （該当する場合）

## [1.0.0] - 2024-01-10

### Added
- 初期リリース
- ユーザー登録・ログイン機能
```

#### 4.12. .env.example の更新

**.env.example** を開く。

**新しい環境変数の追加**:

```bash
# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# JWT
JWT_SECRET=your-jwt-secret-key

# メール送信（新規追加）
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@example.com

# アプリケーション
APP_URL=http://localhost:3000
```

### 5. ドキュメント整合性の検証

#### 5.1. クロスリファレンスの確認

**ドキュメント間の一貫性を確認**:

- [ ] **要件 ↔ ドメインモデル**: features-implemented.md に記載された機能が domain-model.md に反映されているか
- [ ] **ドメインモデル ↔ データモデル**: domain-model.md のエンティティが data-model.md のテーブルに対応しているか
- [ ] **ドメインモデル ↔ API 仕様**: domain-model.md の振る舞いが api-spec.md のエンドポイントに対応しているか
- [ ] **API 仕様 ↔ 実装**: api-spec.md のエンドポイントが実際に実装されているか
- [ ] **データモデル ↔ 実装**: data-model.md のテーブル定義が実際のマイグレーションファイルと一致しているか

#### 5.2. 用語の一貫性確認

**ユビキタス言語の一貫性**:

- [ ] ドキュメント全体で同じ用語を使用しているか
- [ ] ubiquitous-language.md に記載された用語が各ドキュメントで使用されているか
- [ ] コード内のクラス名・変数名がドメイン用語と一致しているか

#### 5.3. リンク切れの確認

**ドキュメント間のリンクを確認**:

- [ ] 内部リンクが正しいパスを指しているか
- [ ] 参照先のドキュメント・セクションが存在するか

### 6. Git コミット

#### 6.1. 変更されたドキュメントの確認

```bash
# 変更されたドキュメントを確認
git status

# 差分を確認
git diff docs/
```

#### 6.2. ドキュメント更新のコミット

**ステージング**:

```bash
# タスクドキュメントをステージング
git add docs/tasks/task{task-id}-{スラッグ}/

# プロジェクトドキュメントをステージング
git add docs/01-requirements/
git add docs/03-domain/
git add docs/04-design/

# その他のドキュメント
git add README.md
git add CHANGELOG.md
git add .env.example
```

**コミット**:

```bash
git commit -m "docs(task-{task-id}): update documentation for {機能名}

Task-level documentation:
- Update a-definition.md with implementation results
- Update b-research.md with discovered best practices
- Update c-implementation.md with implementation notes and retrospective

Project-level documentation:
- Add {機能名} to features-implemented.md
- Update domain-model.md
- Add terms to ubiquitous-language.md
- Update data-model.md
- Update api-spec.md
- Update README.md with setup instructions
- Add changelog entry

Related: task{task-id}-{スラッグ}"
```

### 7. PRへの反映とレビュー依頼

#### 7.1. PRの更新（該当する場合）

既にPRが作成されている場合、ドキュメントの更新をプッシュします。

```bash
git push origin task/{task-id}-{スラッグ}
```

#### 7.2. PR作成（まだ作成していない場合）

もし `/c-001-ImplementTask` でPRを作成していない場合は、ここで作成します。

**GitHub CLI を使用する場合**:

```bash
gh pr create --title "feat(task-{id}): {タスク概要}" --body-file docs/tasks/task{id}-{スラッグ}/pr-description.md
```

※ `pr-description.md` がない場合は、`c-implementation.md` の内容を参考に作成してください。

#### 7.3. レビュー観点

**ドキュメント品質の確認**:

- [ ] **正確性**: 実装内容と一致しているか
- [ ] **完全性**: すべての変更が記載されているか
- [ ] **明確性**: 第三者が理解できる内容か
- [ ] **一貫性**: ドキュメント間で用語・形式が統一されているか
- [ ] **最新性**: 古い情報が削除されているか

#### 7.4. チームレビューの依頼（オプション）

**レビュー依頼**:

- ドキュメント更新が大規模な場合、チームレビューを依頼
- PR/MR のレビューコメントで「ドキュメント更新を確認してください」と依頼

### 8. 次のタスクへのフィードバック

#### 8.1. 振り返り内容の共有

**c-implementation.md の振り返りセクション**を確認:

- うまくいったこと
- 改善すべきこと
- 次のタスクへのフィードバック

**フィードバックの適用**:

- [ ] 共通化すべきコンポーネント・ライブラリを特定
- [ ] 次のタスクのリサーチ時に活用すべきベストプラクティスを記録
- [ ] プロジェクト全体のプロセス改善項目を記録

#### 8.2. テンプレートの更新（必要に応じて）

**タスクテンプレート**（`.windsurf/templates/tasks/task-template/`）の更新:

- 今回のタスクで有効だった形式・セクションをテンプレートに反映
- 次回のタスクで使いやすいテンプレートに改善

## 自動化のヒント

将来的に、以下のスクリプトを作成してドキュメント更新を一部自動化することを検討してください：

- `scripts/update-docs.sh`: コミットログから変更内容を抽出してドラフトを作成
- `scripts/generate-api-docs.sh`: コードからAPI仕様書を生成

## 完了条件

- [ ] 実装完了が確認されている（全ステップ完了、全テスト通過）
- [ ] 実装内容と計画の差異が特定されている
- [ ] タスクドキュメント（a-definition.md, b-research.md, c-implementation.md）が更新されている
- [ ] プロジェクトドキュメント（features-implemented.md, domain-model.md, data-model.md, api-spec.md など）が更新されている
- [ ] README.md, CHANGELOG.md, .env.example が更新されている
- [ ] ドキュメント間の整合性が確認されている
- [ ] ドキュメント更新がコミットされている
- [ ] 次のタスクへのフィードバックが記録されている

## エスカレーション

- **実装が完了していない場合**:
  - 「タスクの実装がまだ完了していません。先に `/c-001-ImplementTask` を実行してください。」
  - 未完了のステップを確認し、実装を完了させる

- **計画との差異が大きい場合**:
  - 「計画時の想定と実装内容に大きな差異があります。関係者に共有してください。」
  - 差異の理由と影響範囲を明確にする
  - 必要に応じてアーキテクチャレビューを実施

- **ドキュメント更新が複雑な場合**:
  - 「ドキュメント更新が複雑です。段階的に更新することを推奨します。」
  - タスクドキュメント → プロジェクトドキュメント の順に更新
  - 一度にすべて更新せず、重要度の高いものから優先

- **用語の不一致が見つかった場合**:
  - 「ドキュメント間で用語の不一致が見つかりました。ubiquitous-language.md を確認してください。」
  - チームで用語を統一
  - 既存ドキュメントを一括修正

- **実装コードとドキュメントの乖離が大きい場合**:
  - 「コードとドキュメントの乖離が大きいです。コードレビューで指摘された可能性があります。」
  - コードとドキュメントのどちらが正しいか確認
  - 必要に応じてコードまたはドキュメントを修正

## ベストプラクティス

- **実装直後に更新**: 実装完了後すぐにドキュメントを更新し、記憶が新しいうちに記録する
- **差異を記録**: 計画と実装の差異は必ず記録し、次のタスクへのフィードバックとする
- **スクリーンショット活用**: UI 変更の場合、スクリーンショットを添付して視覚的に記録
- **リンクを活用**: ドキュメント間でリンクを張り、関連情報にすぐアクセスできるようにする
- **バージョン管理**: ドキュメントもコードと同様に Git で管理し、変更履歴を追跡
- **段階的更新**: 大規模なドキュメント更新は段階的に行い、一度に全てを更新しない
- **レビューを受ける**: 重要なドキュメント更新はチームレビューを受け、正確性を担保
- **テンプレート活用**: 繰り返し更新するドキュメントはテンプレート化し、効率化
- **自動化**: 可能な部分は自動化（API ドキュメント生成、データモデル図生成など）
- **定期的な棚卸し**: ドキュメント全体を定期的にレビューし、古い情報を削除

## 参考: ドキュメント構造

**タスクレベル**（`docs/tasks/task{id}-{スラッグ}/`）:

- `a-definition.md`: タスク定義（目的、ユーザーストーリー、受け入れ基準）
- `b-research.md`: リサーチ（ベストプラクティス、技術選定）
- `c-implementation.md`: 実装タスクリスト（フェーズ、ステップ）

**プロジェクトレベル**（`docs/`）:

- `01-requirements/`: 要件定義
  - `02-features-implemented.md`: 実装済み機能
  - `03-features-planned.md`: 計画中機能
  - `05-user-stories.md`: ユーザーストーリー
- `03-domain/`: ドメイン
  - `01-domain-model.md`: ドメインモデル
  - `02-ubiquitous-language.md`: ユビキタス言語
- `04-design/`: 設計
  - `03-screen-design.md`: 画面設計
  - `04-data-model.md`: データモデル
  - `05-api-spec.md`: API 仕様
  - `06-architecture.md`: アーキテクチャ

**その他**:

- `README.md`: プロジェクト概要、セットアップ手順
- `CHANGELOG.md`: 変更履歴
- `.env.example`: 環境変数テンプレート
