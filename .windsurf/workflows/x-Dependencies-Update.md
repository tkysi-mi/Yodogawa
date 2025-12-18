---
description: 依存関係を安全に更新し、破壊的変更やセキュリティ脆弱性に対処するワークフロー
auto_execution_mode: 1
---

# Dependencies-Update (x-Dependencies-Update)

## 目的

- プロジェクトの依存関係を最新の安全なバージョンに更新する。
- セキュリティ脆弱性を修正し、パッチを適用する。
- 破壊的変更（Breaking Changes）を事前に確認し、適切に対処する。
- アップデート後の動作を検証し、問題があれば修正する。

## 前提

- `package.json` または `requirements.txt` などの依存関係管理ファイルが存在する。
- npm/yarn/pnpm（Node.js）、pip/poetry（Python）などのパッケージマネージャーが利用可能。
- テストが整備されており、アップデート後の動作確認ができる。
- Git リポジトリが初期化されており、変更を追跡できる。

## 手順

### 1. 現在の依存関係の確認

**質問1: パッケージマネージャーの確認**

- 「このプロジェクトで使用しているパッケージマネージャーは何ですか？」
  - npm
  - yarn
  - pnpm
  - pip
  - poetry
  - その他

**現在のバージョンを確認**:

```bash
# Node.js プロジェクト
npm list --depth=0
# または
yarn list --depth=0
# または
pnpm list --depth=0

# Python プロジェクト
pip list
# または
poetry show
```

### 2. セキュリティ脆弱性のスキャン

**Node.js プロジェクト**:

```bash
npm audit
# または
yarn audit
# または
pnpm audit
```

**Python プロジェクト**:

```bash
pip-audit
# または
safety check
```

**質問2: 脆弱性の確認**

- 「セキュリティ脆弱性が検出されましたか？」
- 検出された場合、重要度（Critical, High, Moderate, Low）を確認

### 3. 更新可能なパッケージの確認

**Node.js プロジェクト**:

```bash
npm outdated
# または
yarn outdated
# または
pnpm outdated
```

**Python プロジェクト**:

```bash
pip list --outdated
# または
poetry show --outdated
```

**質問3: 更新戦略**

- 「どの更新戦略を使用しますか？」
  - **Conservative（保守的）**: パッチバージョンのみ更新（例: 1.2.3 → 1.2.4）
  - **Moderate（中程度）**: マイナーバージョンまで更新（例: 1.2.3 → 1.3.0）
  - **Aggressive（積極的）**: メジャーバージョンも更新（例: 1.2.3 → 2.0.0）
  - **Security Only（セキュリティのみ）**: 脆弱性があるパッケージのみ更新

### 4. 破壊的変更（Breaking Changes）の確認

更新するパッケージの CHANGELOG または リリースノートを確認：

**質問4: Breaking Changes の確認**

- 「更新するパッケージに破壊的変更がありますか？」
- 確認すべき内容：
  - API の変更（関数名、引数、戻り値の変更）
  - 非推奨 API の削除
  - デフォルト動作の変更
  - 最低必要バージョンの変更（Node.js, Python など）

**確認方法**:

- GitHub リリースページ: `https://github.com/{org}/{repo}/releases`
- CHANGELOG.md
- Migration Guide

### 5. 依存関係の更新

#### 5.1. バックアップの作成

```bash
# package.json と package-lock.json のバックアップ
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup

# または Python の場合
cp requirements.txt requirements.txt.backup
cp poetry.lock poetry.lock.backup
```

#### 5.2. パッケージの更新

**セキュリティパッチのみ適用**:

```bash
# Node.js
npm audit fix
# または
yarn audit fix
# または
pnpm audit fix
```

**すべてのパッケージを更新**:

```bash
# Node.js (interactive)
npm update
# または
yarn upgrade-interactive
# または
pnpm update -i

# Python
pip install --upgrade -r requirements.txt
# または
poetry update
```

**特定のパッケージのみ更新**:

```bash
# Node.js
npm install <package>@latest
# または
yarn upgrade <package>@latest

# Python
pip install --upgrade <package>
# または
poetry update <package>
```

### 6. 変更内容の確認

```bash
git diff package.json
git diff package-lock.json
```

**質問5: 変更の確認**

- 「予期しない変更がありませんか？」
- 「更新されたパッケージのバージョンは適切ですか？」

### 7. テストの実行

**すべてのテストを実行**:

```bash
# Node.js
npm test
# または
yarn test

# Python
pytest
# または
python -m unittest
```

**質問6: テスト結果**

- 「すべてのテストが通りましたか？」
- 失敗した場合、原因を特定：
  - 破壊的変更による API の変更
  - テストコードの更新が必要
  - 環境依存の問題

### 8. ビルドの確認

**ビルドが成功するか確認**:

```bash
# Node.js
npm run build
# または
yarn build

# TypeScript
tsc --noEmit
```

**質問7: ビルド結果**

- 「ビルドが成功しましたか？」
- エラーがある場合、型定義やコンパイルエラーを修正

### 9. 動作確認

**開発サーバーを起動して動作確認**:

```bash
npm run dev
# または
yarn dev
```

**質問8: 動作確認**

- 「主要な機能が正常に動作しますか？」
- 確認すべき項目：
  - ページが正しく表示される
  - API リクエストが成功する
  - フォームが正常に動作する
  - 認証・認可が機能する

### 10. コミットとプッシュ

**変更をコミット**:

```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies

- Update <package1> from <old-version> to <new-version>
- Update <package2> from <old-version> to <new-version>
- Fix security vulnerabilities (npm audit)
- All tests passing

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**プッシュ**:

```bash
git push origin <branch>
```

### 11. CI/CD の確認

- CI が成功することを確認
- 失敗した場合、ログを確認して修正

### 12. ドキュメント更新（必要に応じて）

**質問9: ドキュメント更新**

- 「依存関係の更新により、ドキュメントの更新が必要ですか？」
- 更新すべきドキュメント：
  - README.md（最低必要バージョン）
  - CHANGELOG.md
  - API ドキュメント

## 完了条件

- 依存関係が最新の安全なバージョンに更新されている
- セキュリティ脆弱性が修正されている
- すべてのテストが通っている
- ビルドが成功している
- 主要な機能が正常に動作している
- 変更がコミットされ、GitHub にプッシュされている
- CI/CD が成功している

## エスカレーション

- **メジャーバージョンアップで破壊的変更が多い場合**:
  - 「メジャーバージョンアップには大きな変更が含まれます。段階的に更新することを推奨します。」
  - マイグレーションガイドを参照
  - 別ブランチで作業

- **テストが失敗する場合**:
  - 「テストが失敗しました。原因を特定してください：」
    - 破壊的変更による API の変更
    - テストコードの更新が必要
    - モック・スタブの修正が必要

- **ビルドが失敗する場合**:
  - 「ビルドが失敗しました。型定義やコンパイルエラーを確認してください。」
  - TypeScript の場合、`@types/*` パッケージも更新

- **セキュリティ脆弱性が修正できない場合**:
  - 「セキュリティ脆弱性が修正できません。以下を検討してください：」
    - パッケージの代替案を探す
    - 一時的に `npm audit` の特定の警告を無視（非推奨）
    - セキュリティチームに報告

- **依存関係の競合が発生した場合**:
  - 「依存関係の競合が発生しました。`npm ls <package>` で原因を特定してください。」
  - `resolutions`（yarn）または `overrides`（npm）で強制解決

## ベストプラクティス

- **定期的な更新**: 週次または月次で依存関係を確認
- **小さく更新**: 一度に多くのパッケージを更新せず、段階的に更新
- **テスト自動化**: CI で依存関係の更新を自動テスト
- **Dependabot/Renovate**: 自動 PR 作成ツールの活用
- **セキュリティアラート**: GitHub Security Alerts を有効化
- **ロックファイルのコミット**: `package-lock.json` や `yarn.lock` を必ずコミット
