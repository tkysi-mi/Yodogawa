# フェーズ / ステップのテンプレート例

SKILL.md 手順2〜4で使うフェーズ設計・ステップ分解・テスト計画の記載例。

## フェーズ分割の目安

- 2〜4 フェーズに分割
- 1 フェーズ = 1〜3 日で完了できる規模
- 例: 「データモデル/マイグレーション」「API 実装」「フロントエンド」「統合テスト」

## ステップ分解のテンプレート

各ステップを 1〜3 時間で完了できる粒度に分割し、以下を定義:

```markdown
### ステップ 1: {Title}

- **Details**: 実装内容・注意点（ファイル名・関数名・ライブラリ名など）
- **Deliverables**: 成果物（PR / コミット / ファイル）
- **Verification**: 実装完了の確認方法（テストコマンド、ブラウザチェック等）
```

### 記載例

```markdown
### ステップ 1: User テーブルへのカラム追加

- **Details**: `migrations/001_add_email_verified.sql` を作成。email_verified / email_verification_token / email_verification_expires_at カラムを追加。
- **Deliverables**: マイグレーションファイル 1 本、PR にリンク
- **Verification**: `npm run db:migrate` 成功、`psql` でスキーマ確認
```

## テスト計画の記載例

フェーズ／ステップ単位で必要なテストを記載:

```markdown
## テスト計画

### フェーズ 1（データモデル）
- ユニットテスト: マイグレーションスクリプト（`npm run test:unit`）
- カバレッジ目標: 80%

### フェーズ 2（API）
- API テスト: `npm run test:integration`
- 認証系テスト: `npm run test:auth`

### フェーズ 3（フロントエンド）
- UI テスト: `playwright test`
- E2E: ログイン → メール検証 → ログアウトの一連フロー
```

## コミットメッセージ

```
docs(task): 実装計画の作成 task{ID}
```
