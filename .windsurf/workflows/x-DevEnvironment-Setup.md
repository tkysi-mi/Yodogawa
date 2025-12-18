---
description: 新規開発者やクリーン環境で開発環境を素早くセットアップするワークフロー
auto_execution_mode: 1
---

# DevEnvironment-Setup (x-DevEnvironment-Setup)

## 目的

- 新しい開発者がプロジェクトにすぐに参加できるよう、開発環境を自動的にセットアップする。
- クリーンインストールや環境リセット時に、必要な依存関係とツールを一括でインストールする。
- 環境変数、データベース、サンプルデータなどを適切に設定する。
- セットアップの手順を標準化し、環境依存の問題を減らす。

## 前提

- Git がインストールされており、リポジトリがクローン済みである。
- 必要なランタイム（Node.js, Python, など）がインストール可能である。
- インターネット接続が利用可能である（パッケージのダウンロードのため）。
- README.md に基本的なセットアップ手順が記載されている（参照用）。

## 手順

### 1. システム要件の確認

**質問1: プロジェクトタイプの確認**

- 「このプロジェクトの種類は何ですか？」
  - Node.js（React, Next.js, Express, etc.）
  - Python（Django, Flask, FastAPI, etc.）
  - Ruby（Rails, Sinatra, etc.）
  - その他

**質問2: 必要なツールの確認**

- 「このプロジェクトで必要なツールは何ですか？」
  - ランタイム（Node.js, Python, Ruby, etc.）
  - データベース（PostgreSQL, MySQL, MongoDB, etc.）
  - キャッシュ（Redis, Memcached, etc.）
  - その他（Docker, Docker Compose, etc.）

### 2. ランタイムのバージョン確認

**Node.js プロジェクト**:

```bash
node --version
npm --version
```

**推奨バージョンを確認**:

- `.nvmrc` ファイルが存在する場合: `cat .nvmrc`
- `package.json` の `engines` フィールドを確認

**質問3: バージョンの確認**

- 「現在のバージョンは推奨バージョンと一致していますか？」
- 一致しない場合、nvm（Node Version Manager）で切り替え：

  ```bash
  nvm install
  nvm use
  ```

**Python プロジェクト**:

```bash
python --version
# または
python3 --version
```

**推奨バージョンを確認**:

- `.python-version` ファイルが存在する場合: `cat .python-version`
- `pyproject.toml` または `setup.py` を確認

### 3. 依存関係のインストール

#### 3.1. パッケージマネージャーの確認

**質問4: パッケージマネージャー**

- 「使用するパッケージマネージャーは何ですか？」
  - npm（`package-lock.json` が存在）
  - yarn（`yarn.lock` が存在）
  - pnpm（`pnpm-lock.yaml` が存在）
  - pip（`requirements.txt` が存在）
  - poetry（`poetry.lock` が存在）

#### 3.2. 依存関係のインストール

**Node.js**:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

**Python**:

```bash
# pip (virtualenv 推奨)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# poetry
poetry install
```

**Ruby**:

```bash
bundle install
```

### 4. 環境変数の設定

#### 4.1. 環境変数ファイルの確認

**質問5: 環境変数ファイルの存在**

- 「`.env.example` または `.env.sample` ファイルが存在しますか？」

**環境変数ファイルをコピー**:

```bash
cp .env.example .env
```

#### 4.2. 環境変数の設定

**質問6: 必要な環境変数**

- 「設定が必要な環境変数は何ですか？」

必要な環境変数の例：

- `DATABASE_URL` - データベース接続文字列
- `REDIS_URL` - Redis 接続文字列
- `API_KEY` - 外部 API キー
- `JWT_SECRET` - JWT シークレット
- `NODE_ENV` - 環境（development, production）

**環境変数を対話的に設定**:

```bash
# .env ファイルを編集
nano .env
# または
code .env
```

**例**:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# API Keys
OPENAI_API_KEY=your_api_key_here

# JWT
JWT_SECRET=your_secret_key_here

# Environment
NODE_ENV=development
```

### 5. データベースのセットアップ

#### 5.1. データベースサーバーの起動

**Docker Compose を使用する場合**:

```bash
docker-compose up -d postgres
# または
docker-compose up -d
```

**ローカルにインストールされている場合**:

```bash
# PostgreSQL
sudo service postgresql start

# MySQL
sudo service mysql start

# MongoDB
sudo service mongod start
```

#### 5.2. データベースの作成

**質問7: データベース作成**

- 「データベースを作成する必要がありますか？」

**PostgreSQL**:

```bash
createdb <database_name>
```

**MySQL**:

```bash
mysql -u root -p -e "CREATE DATABASE <database_name>;"
```

#### 5.3. マイグレーションの実行

**Node.js (Prisma)**:

```bash
npx prisma migrate dev
```

**Node.js (TypeORM)**:

```bash
npm run migration:run
```

**Python (Django)**:

```bash
python manage.py migrate
```

**Python (Alembic)**:

```bash
alembic upgrade head
```

**Ruby (Rails)**:

```bash
rails db:migrate
```

### 6. サンプルデータの投入（オプション）

**質問8: サンプルデータの投入**

- 「開発用のサンプルデータを投入しますか？」

**Node.js (Prisma)**:

```bash
npx prisma db seed
```

**Python (Django)**:

```bash
python manage.py loaddata fixtures/sample_data.json
```

**Ruby (Rails)**:

```bash
rails db:seed
```

**カスタムスクリプト**:

```bash
npm run seed
# または
node scripts/seed.js
```

### 7. ビルド・コンパイル（必要に応じて）

**質問9: ビルドが必要**

- 「初回ビルドが必要ですか？」

**TypeScript プロジェクト**:

```bash
npm run build
# または
tsc
```

**Webpack/Vite プロジェクト**:

```bash
npm run build
```

### 8. 開発サーバーの起動

**開発サーバーを起動してテスト**:

```bash
# Node.js
npm run dev
# または
yarn dev

# Python (Django)
python manage.py runserver

# Python (Flask)
flask run

# Ruby (Rails)
rails server
```

**質問10: サーバー起動確認**

- 「開発サーバーが正常に起動しましたか？」
- ブラウザで `http://localhost:<port>` にアクセスして確認

### 9. テストの実行

**すべてのテストを実行して環境が正しくセットアップされたことを確認**:

```bash
npm test
# または
pytest
# または
rails test
```

**質問11: テスト結果**

- 「すべてのテストが通りましたか？」
- 失敗した場合、環境設定を見直す

### 10. 開発ツールのセットアップ（オプション）

#### 10.1. エディタ設定

**VS Code 拡張機能**:

- `.vscode/extensions.json` が存在する場合、推奨拡張機能をインストール

**EditorConfig**:

- `.editorconfig` が存在する場合、エディタで読み込まれることを確認

#### 10.2. Git Hooks

**Husky のセットアップ**:

```bash
npm run prepare
# または
npx husky install
```

**pre-commit フックの有効化**:

```bash
pre-commit install
```

### 11. ドキュメントの確認

**質問12: ドキュメントの確認**

- 「README.md に追加のセットアップ手順が記載されていますか？」
- 追加手順がある場合、それに従う

### 12. セットアップ完了の確認

**チェックリスト**:

- [ ] 依存関係がすべてインストールされた
- [ ] 環境変数が正しく設定された
- [ ] データベースが作成され、マイグレーションが実行された
- [ ] サンプルデータが投入された（オプション）
- [ ] 開発サーバーが起動した
- [ ] テストが通った
- [ ] ブラウザでアプリケーションが表示された

## 完了条件

- すべての依存関係がインストールされている
- 環境変数が適切に設定されている
- データベースがセットアップされ、マイグレーションが完了している
- 開発サーバーが正常に起動する
- テストが全て通る
- ブラウザでアプリケーションが正しく表示される
- README.md の手順がすべて完了している

## エスカレーション

- **依存関係のインストールが失敗する場合**:
  - 「依存関係のインストールに失敗しました。以下を確認してください：」
    - インターネット接続
    - npm/yarn/pnpm のバージョン
    - ネットワークプロキシ設定
    - `npm cache clean --force` でキャッシュをクリア

- **データベース接続エラー**:
  - 「データベースに接続できません。以下を確認してください：」
    - データベースサーバーが起動しているか
    - `DATABASE_URL` が正しいか
    - データベースユーザーの権限
    - ファイアウォール設定

- **ポート競合エラー**:
  - 「ポートが既に使用されています。以下を確認してください：」
    - `lsof -i :<port>` で使用中のプロセスを確認
    - 別のポートを使用するか、プロセスを停止

- **環境変数が不足している場合**:
  - 「必要な環境変数が設定されていません。`.env.example` を参照して、`.env` に必要な変数を設定してください。」

- **マイグレーションが失敗する場合**:
  - 「マイグレーションに失敗しました。以下を確認してください：」
    - データベースが作成されているか
    - マイグレーションファイルが存在するか
    - データベーススキーマの競合がないか

## トラブルシューティング

### Node.js バージョンの不一致

```bash
nvm install <version>
nvm use <version>
```

### Python 仮想環境の問題

```bash
# 仮想環境を削除して再作成
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### データベースリセット

```bash
# PostgreSQL
dropdb <database_name>
createdb <database_name>
npm run migration:run

# Rails
rails db:drop db:create db:migrate db:seed
```

### キャッシュのクリア

```bash
# npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# pip
pip cache purge
```

## ベストプラクティス

- **ドキュメント化**: README.md にセットアップ手順を明確に記載
- **自動化スクリプト**: `npm run setup` のようなスクリプトで一括セットアップ
- **Docker 活用**: Docker Compose でデータベースなどの依存サービスを管理
- **環境変数テンプレート**: `.env.example` を最新の状態に保つ
- **CI/CD でテスト**: セットアップ手順が正しいことを CI で定期的に検証
- **Makefile**: 複雑なセットアップ手順を `Makefile` にまとめる
