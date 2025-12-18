---
description: データベーススキーマの変更を安全にマイグレーションとして作成するワークフロー
auto_execution_mode: 1
---

# Migration-Create (x-Migration-Create)

## 目的

- データベーススキーマの変更を安全かつ追跡可能な形でマイグレーションとして作成する。
- 本番環境へのデプロイ時にスキーマ変更を自動適用できるようにする。
- ロールバック可能なマイグレーションを設計し、問題発生時に迅速に戻せるようにする。
- チーム全体でスキーマ変更を共有し、環境間の一貫性を保つ。

## 前提

- データベースマイグレーションツールが設定されている（ORM内蔵またはスタンドアロン）。
- データベース接続が確立されている。
- 既存のマイグレーションがすべて適用されている（clean state）。
- Git リポジトリが初期化されている。

## 手順

### 1. スキーマ変更の要件確認

**変更の種類**:

- **テーブル操作**: 新規作成、削除、リネーム
- **カラム操作**: 追加、削除、リネーム、型変更
- **制約操作**: 主キー、外部キー、一意制約、NOT NULL、CHECK制約
- **インデックス操作**: 追加、削除、変更
- **データマイグレーション**: 既存データの変換

**影響範囲の確認**:

- どのテーブル/カラムに影響するか
- 既存データへの影響（データ損失の可能性）
- アプリケーションコードへの影響
- 破壊的変更かどうか

### 2. マイグレーション戦略の選択

**マイグレーションの種類**:

**スキーマのみのマイグレーション**:

- DDL（Data Definition Language）のみ
- データ変換なし
- 高速に実行可能

**データマイグレーション含む**:

- DDL + DML（Data Manipulation Language）
- 既存データの変換が必要
- 実行時間が長い可能性

**段階的マイグレーション**（破壊的変更の場合）:

1. 第1段階: 新しいカラム/テーブルを追加（後方互換性あり）
2. アプリケーションコードを更新
3. 第2段階: 古いカラム/テーブルを削除

### 3. マイグレーションファイルの作成

**一般的なアプローチ**:

**自動生成**:

- スキーマ定義ファイルの差分から自動生成
- ORM のモデル定義と DB の差分を検出
- 手動レビューが必要

**手動作成**:

- SQL を直接記述
- 細かい制御が可能
- エラーのリスクが高い

**マイグレーションファイルの基本構造**:

```
マイグレーションファイル:
├── バージョン番号/タイムスタンプ
├── 説明的な名前
├── up/apply メソッド（変更を適用）
└── down/revert メソッド（変更を元に戻す）
```

**命名規則**:

- タイムスタンプ + 説明: `20240101120000_add_age_to_users`
- 連番 + 説明: `001_add_age_to_users`
- 説明的で検索しやすい名前を使用

### 4. マイグレーションの設計

**安全なマイグレーションのチェックリスト**:

- [ ] ロールバック（down/revert）が実装されている
- [ ] 冪等性が保証されている（複数回実行しても安全）
- [ ] トランザクション内で実行される（可能な場合）
- [ ] データ損失のリスクが最小化されている
- [ ] パフォーマンスへの影響が考慮されている
- [ ] 環境変数や設定による制御が可能

**よくあるスキーマ変更パターン**:

**カラム追加（安全）**:

```sql
-- Up
ALTER TABLE users ADD COLUMN age INTEGER;

-- Down
ALTER TABLE users DROP COLUMN age;
```

**NOT NULL カラム追加（段階的）**:

```sql
-- 第1段階: NULL許可で追加
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- 第2段階: デフォルト値設定またはデータ投入後にNOT NULL制約追加
UPDATE users SET email = 'default@example.com' WHERE email IS NULL;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
```

**カラムリネーム（破壊的、段階的に実施）**:

```
1. 新カラム追加
2. データコピー
3. アプリケーションコード更新
4. 旧カラム削除
```

**インデックス追加（並列実行）**:

```sql
-- PostgreSQL: ロックせずにインデックス作成
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- ロールバック
DROP INDEX CONCURRENTLY idx_users_email;
```

### 5. データマイグレーションの実装

**データ変換が必要な場合**:

**基本パターン**:

```sql
-- カラム追加
ALTER TABLE users ADD COLUMN full_name VARCHAR(200);

-- 既存データの変換
UPDATE users SET full_name = first_name || ' ' || last_name;

-- NULL制約追加（オプション）
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;
```

**大量データの処理**:

- バッチ処理で分割実行
- トランザクションサイズの制御
- 進捗ログの出力

**ロールバック時のデータ復元**:

- データバックアップの作成
- 変換前のデータを一時保存
- 可逆的な変換の設計

### 6. マイグレーションのテスト

**ローカル環境でのテスト**:

**適用テスト**:

```bash
# マイグレーション適用
<migration-tool> migrate up
# または
<migration-tool> migrate apply

# スキーマ確認
<db-client> -d <database> -c "\d <table>"
```

**ロールバックテスト**:

```bash
# ロールバック実行
<migration-tool> migrate down
# または
<migration-tool> migrate revert

# スキーマが元に戻ったか確認
<db-client> -d <database> -c "\d <table>"
```

**再適用テスト（冪等性確認）**:

```bash
# 再度適用
<migration-tool> migrate up

# エラーなく完了することを確認
```

**アプリケーションの動作確認**:

- 開発サーバーを起動
- CRUD 操作が正常に動作するか確認
- 新しいカラム/テーブルが使用できるか確認

### 7. マイグレーションファイルの最終確認

**レビューチェックリスト**:

- [ ] SQL 構文が正しいか
- [ ] データ損失のリスクがないか
- [ ] パフォーマンスへの影響が許容範囲か
- [ ] ロールバックが正しく実装されているか
- [ ] コメントで変更理由が説明されているか
- [ ] 依存する他のマイグレーションが明記されているか

**破壊的変更の場合**:

- チームレビューを必須にする
- ステージング環境で先にテスト
- データバックアップの確認
- ロールバック手順の文書化

### 8. マイグレーション状態の確認

**現在の状態確認**:

```bash
# 適用済みマイグレーションの確認
<migration-tool> migrate status
# または
<migration-tool> migrate history

# 未適用マイグレーションの確認
<migration-tool> migrate pending
```

**マイグレーションログの確認**:

- いつ適用されたか
- 誰が適用したか
- どの環境で適用されたか

### 9. ドキュメント化

**マイグレーションの説明**:

- 変更の目的
- 影響範囲
- ロールバック手順
- 関連する Issue/Ticket番号

**コメント例**:

```sql
-- Migration: Add age column to users table
-- Purpose: Store user age for age-based features
-- Breaking: No (nullable column)
-- Rollback: Safe, no data loss
-- Related: TICKET-123

ALTER TABLE users ADD COLUMN age INTEGER;
```

### 10. Git コミット

```bash
git add migrations/

git commit -m "feat: add age column to users table

- Add nullable age column to users table
- Migration file: 20240101_add_age_to_users
- Supports rollback
- No breaking changes

Related: TICKET-123

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com)"
```

## 完了条件

- マイグレーションファイルが作成されている
- ローカル環境でマイグレーションが正常に適用される
- ロールバックが正常に動作する
- アプリケーションが正常に動作する
- チームレビューが完了している（破壊的変更の場合）
- ドキュメントが更新されている
- Git にコミットされている

## エスカレーション

- **マイグレーション適用が失敗する**:
  - SQL 構文エラーを確認
  - データ型の不一致を確認
  - 制約違反を確認
  - トランザクションログを確認

- **データ損失のリスクがある**:
  - バックアップを取る
  - 段階的マイグレーションに分割
  - データ変換スクリプトを別途作成
  - カラム削除前に deprecated フラグを設定

- **本番環境でのパフォーマンス影響**:
  - メンテナンスウィンドウでの実行を検討
  - オンラインスキーマ変更ツールの使用
  - インデックス作成を並列実行（CONCURRENTLY）
  - バッチ処理で分割実行

- **マイグレーションの競合**:
  - 最新の変更を pull
  - マイグレーションの順序を調整
  - タイムスタンプの重複を解決
  - マージ戦略を決定

## ベストプラクティス

- **小さく分割**: 大きなスキーマ変更は複数のマイグレーションに分割
- **後方互換性**: 可能な限り後方互換性のある変更を優先
- **段階的な削除**: カラム/テーブル削除は2段階で実施
  1. アプリケーションコードから削除
  2. 次のリリースでスキーマから削除
- **デフォルト値**: NOT NULL カラムを追加する場合はデフォルト値を設定
- **インデックス**: パフォーマンスに影響するカラムにはインデックスを追加
- **外部キー**: データ整合性のため、適切な外部キー制約を設定
- **テスト**: マイグレーション適用前にステージング環境でテスト
- **バックアップ**: 本番環境でのマイグレーション前に必ずバックアップ
- **ロールバック計画**: 問題発生時のロールバック手順を事前に準備
- **命名規則**: マイグレーションファイル名は変更内容が分かりやすいものに
- **トランザクション**: 可能な限りトランザクション内で実行
- **冪等性**: 複数回実行しても安全なマイグレーションを設計

## 参考: ツール別の実装パターン

**ORM 統合型マイグレーションツール**:

- Prisma (Node.js)
- TypeORM (Node.js)
- Sequelize (Node.js)
- Django ORM (Python)
- SQLAlchemy + Alembic (Python)
- ActiveRecord (Ruby/Rails)
- Entity Framework (C#/.NET)
- GORM (Go)

**スタンドアロンマイグレーションツール**:

- Flyway (Java/多言語)
- Liquibase (Java/多言語)
- golang-migrate (Go)
- dbmate (多言語)
- sqitch (Perl/多言語)

**マイグレーションコマンド例**:

```bash
# ORM内蔵
prisma migrate dev --name add_age_to_users
python manage.py makemigrations
rails generate migration AddAgeToUsers

# スタンドアロン
flyway migrate
liquibase update
migrate up
```
