# プロジェクトドキュメント更新の記載例

SKILL.md 手順4で使うテンプレート。要件・ドメイン・設計・README など各ドキュメントに追記するサンプル。

## features-implemented.md

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

## features-planned.md

- 実装完了した機能をリストから削除
- または、ステータスを「実装済み」に変更し `02-features-implemented.md` への参照を追加

## domain-model.md

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

**振る舞い**:
- register(): ユーザー登録
- sendVerificationEmail(): 検証メール送信（新規追加）
- verifyEmail(token): メール検証（新規追加）
- login() / logout()

**制約**:
- メールアドレスは一意
- 検証トークンは24時間で期限切れ（新規追加）
- パスワードは最低8文字
```

## ubiquitous-language.md

```markdown
## メール検証（Email Verification）

**定義**: ユーザーが登録したメールアドレスが有効であることを確認するプロセス
**コンテキスト**: ユーザー認証・認可
**関連用語**: メール検証トークン、検証済みフラグ

## メール検証トークン（Email Verification Token）

**定義**: メールアドレスの所有権を確認するための一時的なトークン
**技術的詳細**: UUID v4、有効期限 24 時間、一度使用したら無効化
```

## data-model.md

```markdown
## users テーブル

| カラム名 | データ型 | NULL | デフォルト値 | 説明 | 追加日 |
|---------|---------|------|------------|------|--------|
| id | UUID | NOT NULL | gen_random_uuid() | ユーザーID | 2024-01-10 |
| email | VARCHAR(255) | NOT NULL | - | メールアドレス（一意） | 2024-01-10 |
| password_hash | VARCHAR(255) | NOT NULL | - | パスワードハッシュ | 2024-01-10 |
| email_verified | BOOLEAN | NOT NULL | false | メール検証済みフラグ | 2024-01-15（新規） |
| email_verification_token | UUID | NULL | - | 検証トークン | 2024-01-15（新規） |
| email_verification_expires_at | TIMESTAMP | NULL | - | トークン有効期限 | 2024-01-15（新規） |

**インデックス**:
- PRIMARY KEY: id
- UNIQUE: email
- INDEX: email_verification_token（新規追加）
```

## api-spec.md

```markdown
## POST /api/auth/verify-email

**概要**: メール検証トークンを使用してメールアドレスを検証する
**認証**: 不要

**リクエスト**:
{
  "token": "550e8400-e29b-41d4-a716-446655440000"
}

**レスポンス（成功）**:
{
  "message": "Email verified successfully",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}

**レスポンス（エラー）**:
- 400 Bad Request: トークンが無効または期限切れ
- 404 Not Found: ユーザーが見つからない
```

## screen-design.md

```markdown
## メール検証完了画面

**パス**: `/verify-email?token={token}`

**UI コンポーネント**:
- ヘッダー（アプリ名、ロゴ）
- メッセージエリア（成功/失敗時のメッセージ）
- アクションボタン（ログイン / 検証メール再送信）

**画面遷移**:
- 成功時: ログイン画面（/login）へ
- 失敗時: 検証メール再送信画面へ

**実装ファイル**: `src/pages/VerifyEmail.tsx`
```

## README.md

```markdown
## 環境変数設定

`.env.example` をコピーして `.env` ファイルを作成:

- `DATABASE_URL`: データベース接続URL
- `JWT_SECRET`: JWT トークンの秘密鍵
- `SENDGRID_API_KEY`: SendGrid API キー（新規追加）
- `SENDGRID_FROM_EMAIL`: 送信元メールアドレス（新規追加）

## 主な機能

- ユーザー登録・ログイン
- **メール認証（新規追加）**
- パスワードリセット
- プロフィール管理
```

## CHANGELOG.md

```markdown
## [Unreleased]

### Added
- メール認証機能を実装（task000001-email-verification）
  - メール検証用エンドポイント（`POST /api/auth/verify-email`）
  - メール検証トークン管理（有効期限 24 時間）
  - SendGrid 統合によるメール送信

### Changed
- User テーブルに `email_verified`, `email_verification_token`, `email_verification_expires_at` カラムを追加
```

## .env.example

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
