---
description: 開発・テスト用のサンプルデータをデータストアに投入するワークフロー
auto_execution_mode: 1
---

# Database-Seed (x-Database-Seed)

## 目的

- 開発環境で動作確認するためのサンプルデータを投入する。
- テストで使用するフィクスチャデータを準備する。
- デモ環境で実際のデータに近いサンプルを表示する。
- 新規開発者が即座に開発を開始できるようデータを用意する。

## 前提

- データストア（データベース、ファイルストア等）がセットアップされている。
- スキーマ定義またはマイグレーションが完了している。
- データストアへの接続が確立されている。
- Git リポジトリが初期化されている。

## 手順

### 1. シードデータの要件定義

**目的の明確化**:

- 開発環境での動作確認
- ユニットテスト用フィクスチャ
- E2E テスト用データ
- デモ環境用サンプル
- パフォーマンステスト用大量データ

**必要なデータの特定**:

- どのエンティティ/テーブルにデータが必要か
- どのくらいのデータ量が必要か（10件 / 100件 / 10,000件）
- エンティティ間の関連性（外部キー、参照整合性）

### 2. データ投入戦略の選択

**戦略の種類**:

**Clean Seed（クリーンシード）**:

- すべての既存データを削除してから投入
- テスト環境や開発環境の初期化に適している
- 冪等性が保証される

**Incremental Seed（増分シード）**:

- 既存データに追加で投入
- データが既に存在する場合はスキップまたは更新
- 本番データとの共存が必要な場合に使用

**データソースの選択**:

- **ハードコード**: スクリプト内に直接記述（少量データ向け）
- **外部ファイル**: JSON、YAML、CSV等から読み込み（中量データ向け）
- **ランダム生成**: Faker等のライブラリで生成（大量データ向け）
- **本番データのサニタイズ**: 本番環境からエクスポートして個人情報を除去

### 3. シードスクリプトの設計

**基本的な構造**:

1. **データストア接続の確立**
2. **トランザクション開始**（サポートされている場合）
3. **既存データのクリア**（Clean Seedの場合）
   - 外部キー制約を一時的に無効化（必要に応じて）
   - 依存関係の逆順でデータ削除
4. **データ投入の実行**
   - 依存関係の順序でデータ投入（親 → 子）
   - 一意制約違反のチェック
   - 外部キー制約の検証
5. **コミットまたはロールバック**
6. **投入結果の検証**

**冪等性の確保**:

```
IF データが既に存在する THEN
  データをスキップ または 更新
ELSE
  新規作成
END
```

**実装チェックリスト**:

- [ ] データストア接続の確立
- [ ] エラーハンドリングの実装
- [ ] トランザクション管理（可能な場合）
- [ ] 依存関係の順序管理
- [ ] 冪等性の保証（既存データチェック）
- [ ] ログ出力（投入件数、エラー情報）
- [ ] 環境変数による制御（本番環境での実行を防止）

### 4. データ投入の実行

**一般的な実行パターン**:

**スクリプトの直接実行**:

```bash
# 例: Node.js
node scripts/seed.js

# 例: Python
python scripts/seed.py

# 例: Ruby
ruby db/seeds.rb
```

**タスクランナー経由**:

```bash
# package.json の scripts
npm run seed

# Makefile
make seed

# タスクランナー
rake db:seed
```

**環境別の実行制御**:

```bash
# 開発環境のみ
NODE_ENV=development npm run seed

# テスト環境のみ
RAILS_ENV=test rake db:seed
```

### 5. データ整合性の検証

**検証項目**:

- [ ] データ件数が期待通りか
- [ ] リレーション/参照が正しく設定されているか
- [ ] 一意制約が守られているか
- [ ] 外部キー制約が満たされているか
- [ ] データ型が正しいか
- [ ] NULL制約が守られているか

**検証方法**:

**データストアに直接クエリ**:

```bash
# カウント確認
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM posts;

# リレーション確認
SELECT users.name, COUNT(posts.id)
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id;
```

**アプリケーション経由での確認**:

- 開発サーバーを起動してブラウザで確認
- APIエンドポイントにリクエストして応答を確認
- 管理画面でデータを表示

### 6. 本番環境での実行防止

**環境チェックの実装**:

**環境変数による制御**:

```javascript
if (process.env.NODE_ENV === 'production') {
  throw new Error('Cannot seed production database');
}
```

**明示的な確認プロンプト**:

```bash
echo "Are you sure you want to seed? (yes/no)"
read confirmation
if [ "$confirmation" != "yes" ]; then
  exit 1
fi
```

**データベース名チェック**:

```python
if 'production' in DATABASE_URL:
    raise Exception('Cannot seed production database')
```

### 7. ドキュメント化

**README.md への記載例**:

```markdown
## Development Setup

### Seed Database

開発用サンプルデータを投入:
```bash
npm run seed
```

データをリセットして再投入:

```bash
npm run db:reset
```

### Sample Accounts

- Admin: <admin@example.com> / password123
- User: <user@example.com> / password123

```

**package.json への登録**:
```json
{
  "scripts": {
    "seed": "node scripts/seed.js",
    "db:reset": "npm run db:drop && npm run db:migrate && npm run seed"
  }
}
```

### 8. Git コミット

```bash
git add scripts/seed.js
# または db/seeds.rb, fixtures/*, etc.

git commit -m "feat: add database seed script

- Add sample users and posts
- Support clean and incremental seeding
- Add environment check to prevent production seeding
- Document seed command in README

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 完了条件

- シードスクリプトが作成されている
- データが正常に投入される
- データ整合性が保たれている（外部キー、制約など）
- 冪等性が保証されている（複数回実行しても安全）
- 本番環境での実行が防止されている
- README にシードコマンドが記載されている
- Git にコミットされている

## エスカレーション

- **一意制約違反エラー**:
  - 既存データをクリアしてから投入
  - upsert（存在すれば更新、なければ作成）を使用
  - ユニークなデータを生成（UUID、Faker など）

- **外部キー制約違反**:
  - データの投入順序を確認（親 → 子）
  - トランザクションで一括投入
  - 外部キー制約を一時的に無効化（非推奨）

- **パフォーマンス問題（大量データ）**:
  - バルクインサート（一括挿入）を使用
  - トランザクションでまとめて投入
  - インデックスを一時的に無効化

- **本番環境でシード実行のリスク**:
  - 環境変数でガード
  - データベース名チェック
  - 明示的な確認プロンプト

## ベストプラクティス

- **環境による切り替え**: 本番環境では実行しない
- **冪等性**: 何度実行しても同じ結果になるようにする
- **リアルなデータ**: 実際の使用に近いデータを用意
- **機密情報の除外**: 本番データをエクスポートする場合、個人情報を除外
- **バージョン管理**: シードファイルは Git で管理
- **ドキュメント化**: README にシードコマンドとサンプルアカウント情報を記載
- **自動化**: CI/CD でテスト前にシードを実行
- **段階的な投入**: 基本データとオプショナルデータを分離

## 参考: 技術スタック別の実装パターン

**ORM / データアクセスライブラリ**:

- Prisma, TypeORM, Sequelize (Node.js)
- SQLAlchemy, Django ORM (Python)
- ActiveRecord (Ruby)
- GORM (Go)
- Eloquent (PHP)

**データソース形式**:

- JSON/YAML ファイル
- CSV ファイル
- SQL ダンプファイル
- Faker/Factory パターン

**実行方法**:

- npm scripts / package.json
- Makefile
- rake tasks
- Django management commands
- カスタムCLIコマンド
