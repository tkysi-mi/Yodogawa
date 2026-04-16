# API 仕様のテンプレート

SKILL.md 手順3〜5 で使用するエンドポイント・認証・共通レスポンスのサンプル。

## API スタイル別の特徴

| スタイル | 特徴 | 適合シーン |
|:--|:--|:--|
| REST | シンプル、キャッシュ活用、HTTP 標準 | CRUD 中心の Web/モバイル API |
| GraphQL | クライアント駆動、過剰取得回避 | 複雑な集約、多様なクライアント |
| gRPC | 高速、強い型、ストリーム | 内部 Microservice 通信 |
| tRPC | TS で型共有、開発高速 | TypeScript フルスタック |

## 認証・認可仕様のテンプレート

```markdown
### 認証方式

- プロトコル: JWT（HS256）
- トークン種別: Access Token（15 分）+ Refresh Token（14 日）
- 保存先: Access = Memory, Refresh = HttpOnly Secure Cookie
- ログインエンドポイント: `POST /api/auth/login`
- リフレッシュ: `POST /api/auth/refresh`

### 認可

- ロール: `admin`, `staff`, `user`
- スコープ: `orders:read`, `orders:write`, `users:admin`
- Guard 方針: ロール + 所有者確認（例: `/orders/:id` は本人 or admin のみ）
```

## エンドポイント一覧テーブル

| メソッド | パス | 説明 | 認証 | 認可 |
|:--|:--|:--|:--|:--|
| POST | `/api/auth/login` | ログイン | 不要 | - |
| POST | `/api/auth/refresh` | トークン更新 | Refresh | - |
| POST | `/api/auth/logout` | ログアウト | Access | - |
| GET | `/api/users/me` | 自身のプロフィール取得 | Access | user |
| GET | `/api/users` | ユーザー一覧 | Access | admin |
| GET | `/api/orders` | 注文一覧 | Access | user（自分の注文） |
| POST | `/api/orders` | 注文作成 | Access | user |
| GET | `/api/orders/:id` | 注文詳細 | Access | 本人 or admin |
| POST | `/api/orders/:id/cancel` | 注文取消 | Access | 本人 or admin |

### RESTful パス設計の原則

- リソースは複数形の名詞（`/users`, `/orders`）
- 動作は HTTP メソッドで表現（GET / POST / PATCH / DELETE）
- 動詞が必要な特殊アクションは `/resource/:id/action` 形式（`/orders/:id/cancel`）

## 共通レスポンス形式

### 成功レスポンス

```json
{
  "data": {
    "id": "ord_01HXXXXX",
    "status": "confirmed",
    "total": 12800
  },
  "meta": {
    "requestId": "req_01HXXXXX"
  }
}
```

### エラーレスポンス

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値に誤りがあります",
    "details": [
      { "field": "email", "message": "メール形式が不正です" }
    ]
  },
  "meta": {
    "requestId": "req_01HXXXXX"
  }
}
```

### ページネーション（Cursor 方式）

```json
{
  "data": [ { "id": "ord_01" }, { "id": "ord_02" } ],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "eyJpZCI6Im9yZF8wMiJ9"
  }
}
```

## エラーコード体系の例

| HTTP | code | 用途 |
|:--|:--|:--|
| 400 | VALIDATION_ERROR | 入力値不正 |
| 401 | UNAUTHENTICATED | 未認証 |
| 403 | FORBIDDEN | 権限不足 |
| 404 | NOT_FOUND | リソース未存在 |
| 409 | CONFLICT | 競合（重複登録等） |
| 429 | RATE_LIMITED | レート制限 |
| 500 | INTERNAL_ERROR | サーバー内部エラー |

## コミットメッセージ例

```text
docs: API 仕様（基本設計）の作成

- 認証・認可方式の定義
- エンドポイント一覧と共通レスポンス形式を定義
```
