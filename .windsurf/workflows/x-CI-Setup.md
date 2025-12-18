---
description: GitHub Actions/GitLab CIでビルド・テスト・デプロイを自動化するCI/CDパイプラインをセットアップするワークフロー
auto_execution_mode: 1
---

# CI-Setup (x-CI-Setup)

## 目的

- コードをプッシュするたびに自動でビルド・テスト・デプロイを実行する CI/CD パイプラインを構築する。
- Pull Request ごとに自動テストを実行し、品質を担保する。
- main/master ブランチへのマージ時に自動デプロイを実行する。
- CI/CD のベストプラクティス（キャッシュ、並列実行、失敗時の通知）を適用する。

## 前提

- Git リポジトリが GitHub または GitLab でホストされている。
- プロジェクトに package.json または requirements.txt などの依存関係ファイルが存在する。
- テストコマンドが定義されている（`npm test`, `pytest`, など）。
- デプロイ先が決まっている（Vercel, Netlify, AWS, Heroku, など）。

## 手順

### 1. CI/CD プラットフォームの選択

プロジェクトに適した CI/CD プラットフォームを選択します。

**主要なCI/CDプラットフォームの特徴**:

- **GitHub Actions**: GitHub ホスティングなら推奨。無料枠が充実（2,000分/月）
- **GitLab CI**: GitLab ホスティングなら推奨。無料枠あり（400分/月）
- **CircleCI**: 高機能だが設定が複雑。無料枠（2,500クレジット/月）
- **Jenkins**: セルフホスト型。柔軟だが保守コストが高い
- **Azure Pipelines**: Azure 統合。無料枠（1,800分/月）

### 2. GitHub Actions のセットアップ

#### 2.1. ワークフローファイルの作成

**一般的な CI ジョブの種類**:

- **リント**: コードスタイルチェック（ESLint, Prettier, Ruff, Black, RuboCop など）
- **ユニットテスト**: アプリケーションロジックのテスト
- **統合テスト**: コンポーネント間の統合テスト
- **E2E テスト**: エンドツーエンドの動作確認（Playwright, Cypress など）
- **ビルド**: 本番用ビルドの生成
- **セキュリティスキャン**: 脆弱性検出（npm audit, Snyk, Trivy など）
- **デプロイ**: 本番環境またはステージング環境への自動デプロイ

**ワークフローファイルの配置**:

```
.github/
└── workflows/
    ├── ci.yml          # PR ごとのテスト
    ├── deploy.yml      # main マージ時のデプロイ
    └── nightly.yml     # 定期実行（夜間テスト）
```

#### 2.2. 基本的な CI ワークフロー

**.github/workflows/ci.yml**:

```yaml
name: CI

# トリガー: PR 作成・更新、main プッシュ
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

# 並列実行をキャンセル（同じ PR の古いビルドをキャンセル）
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: matrix.node-version == '20'
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

#### 2.3. デプロイワークフロー

**.github/workflows/deploy.yml**:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 3. GitLab CI のセットアップ

**.gitlab-ci.yml**:

```yaml
# Docker イメージ
image: node:20

# ステージ定義
stages:
  - lint
  - test
  - build
  - deploy

# キャッシュ設定
cache:
  paths:
    - node_modules/
  key:
    files:
      - package-lock.json

# リント
lint:
  stage: lint
  script:
    - npm ci
    - npm run lint

# テスト（複数 Node バージョン）
test:node18:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

test:node20:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

# ビルド
build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop

# デプロイ（本番環境）
deploy:production:
  stage: deploy
  script:
    - npm ci
    - npm run build
    - npm run deploy
  environment:
    name: production
    url: https://myapp.com
  only:
    - main
```

### 4. 環境変数とシークレットの設定

デプロイに必要な API キーやトークンなどの機密情報を安全に管理します。

#### 4.1. GitHub Actions のシークレット設定

**GitHub リポジトリページ**:

1. Settings → Secrets and variables → Actions
2. "New repository secret" をクリック
3. シークレット名と値を入力

**よく使われるシークレット**:

- `VERCEL_TOKEN`: Vercel デプロイトークン
- `AWS_ACCESS_KEY_ID`: AWS アクセスキー
- `AWS_SECRET_ACCESS_KEY`: AWS シークレットキー
- `DOCKER_USERNAME`: Docker Hub ユーザー名
- `DOCKER_PASSWORD`: Docker Hub パスワード
- `CODECOV_TOKEN`: Codecov トークン

**ワークフローで使用**:

```yaml
- name: Deploy to AWS
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  run: |
    aws s3 sync dist/ s3://my-bucket/
```

#### 4.2. GitLab CI の変数

**GitLab プロジェクトページ**:

1. Settings → CI/CD → Variables
2. "Add variable" をクリック
3. Key, Value, Flags（Protected, Masked）を設定

**ワークフローで使用**:

```yaml
deploy:production:
  script:
    - echo "Deploying with token $DEPLOY_TOKEN"
  variables:
    DEPLOY_TOKEN: $CI_DEPLOY_TOKEN
```

### 5. キャッシュの最適化

依存関係のキャッシュを設定することで、CI 実行時間を大幅に短縮できます。

#### 5.1. GitHub Actions のキャッシュ設定

**npm キャッシュ**:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'  # 自動キャッシュ
```

**手動キャッシュ**:

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**ビルドキャッシュ（Next.js）**:

```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

#### 5.2. GitLab CI のキャッシュ

```yaml
cache:
  paths:
    - node_modules/
    - .next/cache/
  key:
    files:
      - package-lock.json
```

### 6. マトリックスビルド（複数環境テスト）

複数のランタイムバージョンや OS でテストすることで、互換性を確保します。

**GitHub Actions でのマトリックスビルド例**:

```yaml
test:
  runs-on: ${{ matrix.os }}
  strategy:
    matrix:
      os: [ubuntu-latest, windows-latest, macos-latest]
      node-version: [18, 20, 22]
  steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
```

### 7. E2E テストの実行

E2E テストを CI に組み込み、実際のユーザー操作をシミュレートして動作を確認します。

**主要な E2E テストフレームワーク**: Playwright, Cypress, Selenium, Puppeteer

**Playwright を使用した例（GitHub Actions）**:

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm run build
    - run: npm run test:e2e
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

**Cypress + GitHub Actions**:

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: cypress-io/github-action@v6
      with:
        build: npm run build
        start: npm start
        wait-on: 'http://localhost:3000'
```

### 8. Docker イメージのビルドとプッシュ

コンテナ化されたアプリケーションの場合、Docker イメージを自動ビルドしてレジストリにプッシュします。

**主要なコンテナレジストリ**: Docker Hub, GitHub Container Registry (ghcr.io), AWS ECR, Google GCR

**GitHub Actions での Docker ビルド例**:

```yaml
docker:
  name: Build and Push Docker Image
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: myusername/myapp:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

### 9. 通知の設定

CI の失敗や成功をチームに通知することで、問題を迅速に把握できます。

**主要な通知先**: Slack, Discord, Microsoft Teams, Email

**Slack 通知の例（GitHub Actions）**:

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "CI failed for ${{ github.repository }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "❌ CI failed\n*Repository:* ${{ github.repository }}\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 10. ステータスバッジの追加

**README.md にステータスバッジを追加**:

**GitHub Actions**:

```markdown
[![CI](https://github.com/username/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/username/repo/actions/workflows/ci.yml)
```

**GitLab CI**:

```markdown
[![pipeline status](https://gitlab.com/username/repo/badges/main/pipeline.svg)](https://gitlab.com/username/repo/-/commits/main)
```

**Codecov**:

```markdown
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

### 11. CI の実行と動作確認

CI ワークフローの設定が完了したら、実際にコードをプッシュして動作を確認します。

**確認手順**:

1. テスト用のブランチを作成してコードを変更

   ```bash
   git checkout -b feature/ci-setup
   git add .
   git commit -m "ci: add CI/CD workflows"
   git push origin feature/ci-setup
   ```

2. Pull Request を作成

3. CI の実行状況を確認
   - **GitHub Actions**: リポジトリの Actions タブ
   - **GitLab CI**: プロジェクトの CI/CD → Pipelines
   - **CircleCI**: ダッシュボード

4. ログを確認
   - すべてのジョブ（lint, test, build）が成功しているか確認
   - エラーがある場合は、ログを読んで原因を特定
   - `/x-CI-FixFailure` ワークフローを使用して修正

5. PR で CI ステータスを確認
   - PR ページで緑色のチェックマークが表示されることを確認
   - "All checks have passed" が表示されれば成功

### 12. デプロイの動作確認

main ブランチへのマージ時に自動デプロイが実行されることを確認します。

**確認手順**:

1. CI が成功した PR を main ブランチにマージ

   ```bash
   git checkout main
   git pull origin main
   ```

2. デプロイワークフローの実行を確認
   - GitHub Actions / GitLab CI のページでデプロイジョブが実行されていることを確認

3. デプロイ先で動作確認
   - デプロイ先の URL にアクセスして、変更が反映されているか確認
   - ログを確認して、エラーが発生していないか確認

### 13. Git コミット

```bash
git add .github/workflows/
# または
git add .gitlab-ci.yml

git commit -m "ci: setup CI/CD pipeline

- Add GitHub Actions workflows for lint, test, build
- Add deploy workflow for Vercel
- Enable dependency caching for faster builds
- Add matrix build for Node 18, 20, 22
- Add E2E tests with Playwright
- Add Docker image build and push
- Add Slack notification on failure
- Add status badges to README

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 完了条件

- CI/CD ワークフローファイルが作成されている
- リント・テスト・ビルドが自動実行される
- PR ごとに CI が実行される
- main マージ時にデプロイが実行される
- 依存関係のキャッシュが設定されている
- シークレット（API キー、トークン）が安全に管理されている
- 失敗時の通知が設定されている（オプション）
- ステータスバッジが README に追加されている
- すべてのジョブが成功する

## エスカレーション

- **CI が失敗する**:
  - 「CI が失敗しました。以下を確認してください:」
    - ログを確認してエラー原因を特定
    - ローカル環境で再現するか確認
    - 依存関係のインストールエラー（`npm ci` → `npm install` に変更）
    - テストの失敗（ローカルでテストを実行）
    - ビルドエラー（環境変数の不足）

- **キャッシュが効かない**:
  - 「キャッシュが効いていません。以下を確認してください:」
    - キャッシュキーが正しいか（`package-lock.json` のハッシュ）
    - `npm ci` を使用しているか（`npm install` はキャッシュ効率が悪い）
    - キャッシュの有効期限（GitHub Actions は 7 日間）

- **デプロイが失敗する**:
  - 「デプロイが失敗しました。以下を確認してください:」
    - シークレットが正しく設定されているか
    - デプロイ先のサービス（Vercel, AWS）の権限
    - ビルド成果物が正しく生成されているか
    - デプロイコマンドが正しいか

- **CI が遅い**:
  - 「CI の実行時間が長すぎます。以下を検討してください:」
    - キャッシュの有効化
    - 並列実行の活用（マトリックスビルド）
    - 不要なステップの削除
    - 依存関係の削減
    - セルフホストランナーの使用（GitHub Actions）

- **費用が高い**:
  - 「CI/CD の費用が高騰しています。以下を検討してください:」
    - 無料枠の確認（GitHub Actions: 2,000 分/月）
    - 不要なワークフローの削除
    - `concurrency` でキャンセル設定
    - マトリックスビルドの削減
    - セルフホストランナーの使用

## ベストプラクティス

- **キャッシュの活用**: 依存関係とビルド成果物をキャッシュ
- **並列実行**: 複数ジョブを並列で実行して時間短縮
- **早期失敗**: リントを最初に実行し、早期にフィードバック
- **マトリックスビルド**: 複数環境で互換性を確認
- **シークレット管理**: 機密情報は絶対にコードに含めない
- **ステータスチェック必須化**: PR マージ前に CI 成功を必須に
- **通知設定**: 失敗時のみ通知（成功時は通知しない）
- **ワークフロー分離**: lint, test, deploy を別ワークフローに
- **環境の分離**: ステージング環境と本番環境を分ける
- **ロールバック計画**: デプロイ失敗時のロールバック手順を準備
