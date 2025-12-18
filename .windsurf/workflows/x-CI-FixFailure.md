---
description: CI/CDパイプラインの失敗をデバッグし、根本原因を特定して修正するワークフロー
auto_execution_mode: 1
---

# CI-FixFailure (x-CI-FixFailure)

## 目的

- CI/CD パイプラインの失敗を迅速にデバッグし、原因を特定する。
- ローカル環境で CI の失敗を再現し、修正する。
- 再発防止策を実施し、CI の安定性を向上させる。
- チームに失敗の原因と修正内容を共有する。

## 前提

- CI/CD パイプラインが設定されている（GitHub Actions, GitLab CI, など）。
- CI ログにアクセスできる。
- ローカル開発環境が整備されている。
- Git リポジトリが初期化されている。

## 手順

### 1. CI 失敗の確認

CI の失敗は通常、以下の方法で通知されます:

- **GitHub / GitLab の Pull Request ページ**: 赤い × マークが表示される
- **メール通知**: GitHub/GitLab から自動送信される
- **チャット通知**: Slack / Discord / Teams に通知される
- **CI/CD ダッシュボード**: Actions / Pipelines ページで確認

**GitHub Actions での確認方法**:

1. GitHub リポジトリ → Actions タブ
2. 失敗したワークフローをクリック
3. 失敗したジョブをクリック

**GitLab CI の確認**:

1. GitLab プロジェクト → CI/CD → Pipelines
2. 失敗したパイプラインをクリック
3. 失敗したジョブをクリック

### 2. エラーログの分析

失敗したステップとエラーメッセージを特定します。

**一般的な失敗ステップ**:

- **依存関係のインストール**: `npm install`, `pip install`, `bundle install`
- **リント**: ESLint, Prettier, Black, RuboCop
- **型チェック**: TypeScript, mypy, sorbet
- **ユニットテスト**: Jest, pytest, RSpec
- **E2E テスト**: Playwright, Cypress
- **ビルド**: `npm run build`, `cargo build`, `go build`
- **デプロイ**: Vercel, AWS, Heroku

**ログでのエラーメッセージの探し方**:

```bash
# 🔍 探すべきキーワード:
# ERROR, FAILED, ✗, ❌, Exit code 1, Exception

# 例:
# ✗ 3 tests failed
# ERROR: Command failed with exit code 1
# npm ERR! code ELIFECYCLE
# AssertionError: expected 3 to equal 4
```

エラーメッセージをコピーして、原因の分析に進みます。

### 3. よくある失敗パターンと修正方法

#### 3.1. 依存関係のインストール失敗

**エラー例**:

```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /home/runner/work/myapp/myapp/package.json
npm ERR! errno -2
```

**原因**:

- `package.json` が存在しない
- ディレクトリ構造が間違っている
- Git で追跡されていない

**修正方法**:

```bash
# package.json が存在するか確認
ls -la package.json

# Git で追跡されているか確認
git ls-files package.json

# 追跡されていない場合は追加
git add package.json
git commit -m "fix: add package.json to git"
```

**CI ワークフローの修正**:

```yaml
- name: Install dependencies
  working-directory: ./path/to/project  # ディレクトリ指定
  run: npm ci
```

#### 3.2. 依存関係のバージョン競合

**エラー例**:

```
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^18.0.0" from react-dom@18.2.0
```

**原因**:

- 依存関係のバージョンが競合している
- `package-lock.json` が古い

**修正方法**:

```bash
# package-lock.json を削除して再生成
rm package-lock.json
npm install

# または特定のバージョンを指定
npm install react@18.2.0 react-dom@18.2.0

# Git にコミット
git add package.json package-lock.json
git commit -m "fix: resolve dependency conflicts"
```

#### 3.3. テストの失敗

**エラー例**:

```
FAIL  src/utils/math.test.ts
  ✕ adds 1 + 2 to equal 3 (5 ms)

  ● adds 1 + 2 to equal 3

    expect(received).toBe(expected) // Object.is equality

    Expected: 3
    Received: 4
```

**原因**:

- テストコードのバグ
- 実装コードのバグ
- テストデータの不整合

**修正方法**:

```bash
# ローカルでテストを実行
npm test

# 特定のテストファイルのみ実行
npm test -- src/utils/math.test.ts

# デバッグモードで実行
node --inspect-brk node_modules/.bin/jest --runInBand

# 修正後、再度テスト
npm test
```

**テストコードの修正例**:

```typescript
// Before
expect(add(1, 2)).toBe(4);  // ❌ 間違い

// After
expect(add(1, 2)).toBe(3);  // ✅ 正しい
```

#### 3.4. リントエラー

**エラー例**:

```
/home/runner/work/myapp/myapp/src/index.ts
  1:1  error  'React' is defined but never used  @typescript-eslint/no-unused-vars
  5:3  error  Missing trailing comma              comma-dangle
```

**原因**:

- コードがリントルールに違反している
- ESLint / Prettier の設定不足

**修正方法**:

```bash
# ローカルでリントを実行
npm run lint

# 自動修正
npm run lint -- --fix

# Git にコミット
git add .
git commit -m "fix: resolve lint errors"
```

**ESLint 設定の調整**:

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",  // error → warn に緩和
    "comma-dangle": ["error", "always-multiline"]
  }
}
```

#### 3.5. ビルドエラー

**エラー例**:

```
ERROR in ./src/index.tsx
Module not found: Error: Can't resolve './App' in '/home/runner/work/myapp/myapp/src'
```

**原因**:

- インポートパスが間違っている
- ファイルが存在しない
- 大文字小文字の不一致（Windows ↔ Linux）

**修正方法**:

```typescript
// Before
import App from './app';  // ❌ Linux では大文字小文字を区別

// After
import App from './App';  // ✅ 正しいファイル名
```

#### 3.6. 環境変数の不足

**エラー例**:

```
Error: Environment variable NEXT_PUBLIC_API_URL is not defined
```

**原因**:

- CI 環境で環境変数が設定されていない
- `.env` ファイルが Git にコミットされていない（正しい挙動）

**修正方法（GitHub Actions）**:

```yaml
- name: Build project
  env:
    NEXT_PUBLIC_API_URL: https://api.example.com
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npm run build
```

**または GitHub Secrets に追加**:

1. Settings → Secrets and variables → Actions
2. "New repository secret" をクリック
3. `DATABASE_URL` を追加

#### 3.7. タイムアウトエラー

**エラー例**:

```
Error: Timeout - Async callback was not invoked within the 5000ms timeout specified by jest.setTimeout
```

**原因**:

- テストの実行時間が長すぎる
- 非同期処理が完了していない

**修正方法**:

```typescript
// テストファイルでタイムアウトを延長
jest.setTimeout(30000);  // 30 秒

// または特定のテストで延長
it('should fetch data', async () => {
  // ...
}, 30000);  // 30 秒
```

**CI ワークフローでタイムアウトを延長**:

```yaml
- name: Run tests
  run: npm test
  timeout-minutes: 10  # デフォルト: 360 分
```

#### 3.8. メモリ不足エラー

**エラー例**:

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**原因**:

- Node.js のヒープメモリが不足している
- 大量のデータを処理している

**修正方法**:

```yaml
- name: Build project
  run: NODE_OPTIONS="--max-old-space-size=4096" npm run build  # 4GB に拡張
```

**package.json のスクリプト修正**:

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

#### 3.9. キャッシュの問題

**エラー例**:

```
Error: Cannot find module 'express'
```

**原因**:

- キャッシュが古くなっている
- 依存関係が正しくインストールされていない

**修正方法（GitHub Actions）**:

```yaml
- name: Clear cache
  run: npm cache clean --force

- name: Install dependencies
  run: npm ci
```

**または CI でキャッシュを無効化**:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    # cache: 'npm'  # キャッシュを無効化
```

#### 3.10. 並行実行の競合

**エラー例**:

```
Error: Port 3000 is already in use
```

**原因**:

- 複数のジョブが同じポートを使用している
- 前のジョブが終了していない

**修正方法**:

```yaml
- name: Start development server
  run: npm start &
  env:
    PORT: ${{ job.container.id }}  # 一意のポート番号
```

**または順次実行**:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    # strategy を削除して並列実行を無効化
```

### 4. ローカル環境での再現

CI の失敗をローカル環境で再現することで、デバッグが容易になります。

**CI 環境を模倣した実行**:

```bash
# クリーンな環境で実行
rm -rf node_modules package-lock.json
npm install

# CI と同じコマンドを実行
npm run lint
npm test
npm run build
```

**Docker で CI 環境を再現**:

```bash
# CI と同じ Node バージョンを使用
docker run -it --rm -v $(pwd):/app -w /app node:20 bash

# コンテナ内で実行
npm ci
npm test
```

### 5. 修正の実装

原因が特定できたら、修正を実装します。

**修正と検証の手順**:

1. コードを修正
2. ローカルでテストを実行して動作確認

   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. すべてのテストが通ることを確認
4. Git にコミット

   ```bash
   git add .
   git commit -m "fix: resolve CI test failures

   - Fix import path for App component
   - Add missing environment variables
   - Increase test timeout to 30 seconds"

   git push origin feature/fix-ci
   ```

### 6. CI の再実行と結果確認

修正をプッシュすると CI が自動的に再実行されます。手動で再実行することも可能です。

**GitHub Actions の手動再実行**:

1. Actions タブで失敗したワークフローを開く
2. "Re-run jobs" → "Re-run all jobs" をクリック

**GitLab CI の手動再実行**:

1. パイプラインページで "Retry" をクリック

**結果の確認**:

- すべてのジョブが緑色のチェックマーク ✅ になることを確認
- 失敗が続く場合は、ログを再度確認して追加の修正を実施

### 7. 根本原因の分析

修正が完了したら、なぜ問題が発生したのか根本原因を分析します。

**一般的な根本原因**:

- **コードのバグ**: ロジックエラー、タイポ、誤った実装
- **環境設定の不足**: 環境変数、シークレット、設定ファイルの不足
- **依存関係の問題**: バージョン競合、欠落したパッケージ
- **CI 設定の誤り**: ワークフローファイルの誤設定、パスの間違い
- **環境差異**: ローカル（Windows/Mac）と CI（Linux）の違い
- **フレーク（不安定なテスト）**: タイミング依存、非決定的な動作

### 8. 再発防止策の実施

同じ問題が再発しないよう、適切な対策を講じます。

**推奨される対策**:

#### 8.1. Pre-commit フックの追加

**husky + lint-staged のインストール**:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**.husky/pre-commit**:

```bash
#!/bin/sh
npx lint-staged
```

**package.json**:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

#### 8.2. CI ステータスチェック必須化

**GitHub**:

1. Settings → Branches → Branch protection rules
2. "Require status checks to pass before merging" をチェック
3. 必須にしたいチェック（lint, test, build）を選択

#### 8.3. フレークテストの修正

**Retry 機能の追加**:

```typescript
// Jest
jest.retryTimes(3);

// Playwright
test('flaky test', async ({ page }) => {
  // ...
}, { retries: 3 });
```

**Wait を適切に使用**:

```typescript
// Bad: 固定時間待機
await new Promise(resolve => setTimeout(resolve, 1000));

// Good: 要素が表示されるまで待機
await page.waitForSelector('.loading', { state: 'hidden' });
```

#### 8.4. ドキュメントの更新

**README.md に CI トラブルシューティングセクションを追加**:

```markdown
## CI Troubleshooting

### Common Issues

#### 1. Test Timeout
If you encounter timeout errors, increase the timeout:
\`\`\`typescript
jest.setTimeout(30000);
\`\`\`

#### 2. Port Already in Use
Kill existing processes:
\`\`\`bash
lsof -ti:3000 | xargs kill -9
\`\`\`
```

### 9. チームへの共有

失敗の原因と修正内容をチームに共有することで、他のメンバーが同じ問題を回避できます。

**Pull Request コメントでの共有例**:

```markdown
## CI Failure Fix

### Issue
CI was failing due to missing environment variable `DATABASE_URL`.

### Root Cause
The environment variable was not set in GitHub Actions secrets.

### Fix
- Added `DATABASE_URL` to GitHub Secrets
- Updated `.github/workflows/ci.yml` to use the secret

### Prevention
- Document required environment variables in README
- Add validation script to check for missing env vars
```

### 10. Git コミット

```bash
git add .
git commit -m "fix: resolve CI failures and add prevention measures

- Fix test timeout issues by increasing timeout to 30s
- Add missing DATABASE_URL environment variable
- Fix import path case sensitivity for Linux
- Add pre-commit hooks with husky and lint-staged
- Document CI troubleshooting in README

Root cause: Environment variable was not set in CI
Prevention: Added environment variable validation script

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 完了条件

- CI の失敗原因が特定されている
- ローカル環境で失敗が再現されている
- 修正が実装され、ローカルでテストが通る
- CI が成功する
- 根本原因が分析されている
- 再発防止策が実施されている
- チームに失敗の原因と修正内容が共有されている
- ドキュメントが更新されている（必要に応じて）

## エスカレーション

- **エラーログが不明瞭**:
  - 「エラーメッセージが不明瞭です。以下を試してください：」
    - CI のログレベルを DEBUG に変更
    - ローカルで同じコマンドを実行
    - スタックトレースを確認
    - 関連する issue や Stack Overflow を検索

- **ローカルでは成功するが CI で失敗する**:
  - 「環境差異の可能性があります。以下を確認してください：」
    - Node バージョンの違い
    - OS の違い（Windows ↔ Linux）
    - 環境変数の違い
    - タイムゾーンの違い
    - ファイルシステムの違い（大文字小文字）

- **フレークテスト（不安定なテスト）**:
  - 「テストが不安定です。以下を検討してください：」
    - Retry 機能の追加
    - Wait を適切に使用
    - テストの独立性を確保（共有状態を削除）
    - テスト実行順序の固定
    - タイムアウトの延長

- **CI が非常に遅い**:
  - 「CI の実行時間が長すぎます。以下を検討してください：」
    - キャッシュの有効化
    - 並列実行の活用
    - 不要なステップの削除
    - テストの最適化
    - セルフホストランナーの使用

- **複数の問題が同時発生**:
  - 「複数の問題が同時に発生しています。以下を実施してください：」
    - 一つずつ修正して確認
    - Git bisect で問題が発生したコミットを特定
    - main ブランチに戻して動作確認
    - 変更を段階的に適用

## ベストプラクティス

- **早期発見**: Pre-commit フックで事前にチェック
- **詳細なログ**: エラー発生時は詳細なログを出力
- **環境の統一**: Docker で CI 環境を再現
- **フレークテスト対策**: Retry 機能と適切な Wait
- **ドキュメント化**: よくある問題と解決策を README に記載
- **モニタリング**: CI の成功率と実行時間を監視
- **定期的なメンテナンス**: 依存関係の更新、キャッシュのクリア
- **チームへの共有**: 失敗の原因と修正内容を共有
- **再発防止**: 根本原因を分析し、対策を実施
- **ステータスチェック必須化**: PR マージ前に CI 成功を必須に
