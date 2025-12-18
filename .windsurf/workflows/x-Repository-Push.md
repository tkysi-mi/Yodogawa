---
description: ローカル変更を検証し、安全なコミットとリモートリポジトリへのプッシュを行うワークフロー（GitHub/GitLab対応）
auto_execution_mode: 1
---

# Repository-Push (x-Repository-Push)

## 目的

- ローカル変更をレビュー・テストした上で、適切なブランチ運用とコミットメッセージでリモートリポジトリにプッシュする。
- コンフリクトやCI失敗を未然に防ぎ、チームと共有できる状態で提出する。
- GitHub、GitLab など複数のGitホスティングサービスに対応する。
- 必要なドキュメンテーション更新や追跡情報を整備した上で変更を公開する。

## 前提

- ローカルリポジトリがリモート（origin）と接続されている。
- コミット対象の変更内容を把握しており、未保存ファイルや不要な変更がない。
- 動作確認に必要なテストやビルドコマンドが実行でき、依存ツールが揃っている。
- 認証情報（PAT / SSH鍵など）が有効で、リモートリポジトリへの push 権限がある。
- プッシュ前に README / ドキュメント / ワークフローを更新する必要がある場合は、その方針を決めている。

## 手順

### 1. リモートリポジトリの確認

**リモートURLの確認**:

```bash
git remote -v
```

**プラットフォームの特定**:

- github.com → GitHub
- gitlab.com → GitLab
- その他のセルフホストインスタンス

**認証方法の確認**:

- SSH: `git@github.com:user/repo.git`
- HTTPS: `https://github.com/user/repo.git`

### 2. 最新状態への同期

**ブランチ戦略の確認**:

- GitHub Flow: main ブランチから feature ブランチ
- GitLab Flow: main → pre-production → production
- Git Flow: develop → feature, develop → release
- Trunk-based: main ブランチのみ

**同期コマンド**:

```bash
# 現在の状態確認
git status

# リモートの最新状態を取得
git fetch --prune

# ベースブランチを最新化（例: main）
git checkout main
git pull origin main

# 作業ブランチに戻る
git checkout <feature-branch>

# 最新の変更を取り込む（リベースまたはマージ）
git rebase origin/main
# または
git merge origin/main
```

### 3. ローカル検証

**テスト実行**:

```bash
# Lint チェック
<lint-command>

# ユニットテスト
<test-command>

# E2Eテスト（必要に応じて）
<e2e-test-command>

# ビルド確認
<build-command>
```

**検証項目**:

- [ ] すべてのテストが通過する
- [ ] Lint エラーがない
- [ ] ビルドが成功する
- [ ] 新機能が正常に動作する
- [ ] 既存機能に影響がない

**エラーが出た場合**:

- エラーを修正
- 再度テストを実行
- 成功を確認してから次のステップへ

### 4. 変更内容の整理

**変更の確認**:

```bash
# 変更されたファイルを確認
git status

# 変更内容の詳細を確認
git diff

# ステージングエリアの確認
git diff --staged
```

**不要なファイルの除外**:

- [ ] 一時ファイルが含まれていない
- [ ] ビルド成果物が含まれていない（.gitignore で管理）
- [ ] 機密情報が含まれていない
- [ ] デバッグコードが削除されている

**コミット単位の分割**（必要に応じて）:

- 大きな変更は複数のコミットに分割
- 各コミットは独立して意味のある単位に
- 論理的に関連する変更をまとめる

### 5. ドキュメントとメタ情報の更新

**ドキュメント更新**:

- [ ] README.md の更新（新機能、使い方）
- [ ] CHANGELOG.md の更新（変更内容、バージョン）
- [ ] API ドキュメントの更新
- [ ] コメント・JSDoc の更新

**Issue/タスク管理との連携**:

- GitHub: `Fixes #123`, `Closes #456`
- GitLab: `Closes #123`, `Related to #456`
- Jira: `PROJ-123`, `PROJ-456`

### 6. コミットの実行

**コミットメッセージの作成**:

チーム規約に従ったフォーマットを使用:

**Conventional Commits 形式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type の種類**:

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット
- `refactor`: リファクタリング
- `test`: テスト追加
- `chore`: ビルド・設定変更

**コミット実行**:

```bash
# ファイルをステージング
git add <files>

# コミット
git commit -m "feat: add user authentication

- Add login/logout functionality
- Add JWT token management
- Add protected routes

Fixes #123

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**コミット履歴の整理**（必要に応じて）:

```bash
# 直前のコミットを修正
git commit --amend

# 複数コミットを整理（インタラクティブリベース）
git rebase -i HEAD~3
```

### 7. プッシュ前の最終確認

**確認項目**:

- [ ] `git status` が clean である
- [ ] 不要な stash が残っていない
- [ ] コミットメッセージが正しい
- [ ] テストが通過している
- [ ] ドキュメントが更新されている

**リモートの最新状態確認**:

```bash
# リモートの変更を確認
git fetch

# リモートとの差分を確認
git log origin/<branch>..HEAD

# 必要なら再度リベース
git rebase origin/<base-branch>
```

### 8. リモートリポジトリへのプッシュ

**プッシュコマンド**:

**初回プッシュ（ブランチが存在しない場合）**:

```bash
git push -u origin <branch-name>
```

**通常のプッシュ**:

```bash
git push origin <branch-name>
```

**強制プッシュ（慎重に）**:

```bash
# リベース後など、必要な場合のみ
git push --force-with-lease origin <branch-name>

# 注意: main/master への強制プッシュは避ける
```

**プッシュ結果の確認**:

- プッシュが成功したか確認
- エラーがあればログを確認
- リモートブランチが作成されたか確認

### 9. Pull Request / Merge Request の作成

**プラットフォーム別のコマンド**:

**GitHub CLI**:

```bash
# PR作成
gh pr create --title "Add user authentication" --body "Implements login/logout functionality. Fixes #123"

# PR の状態確認
gh pr status

# PR のURLを開く
gh pr view --web
```

**GitLab CLI**:

```bash
# MR作成
glab mr create --title "Add user authentication" --description "Implements login/logout functionality. Closes #123"

# MR の状態確認
glab mr list

# MR のURLを開く
glab mr view --web
```

**Web UIでの作成**:

- GitHub: リポジトリページで "Compare & pull request" ボタン
- GitLab: リポジトリページで "Create merge request" ボタン

**PR/MR テンプレートの記入**:

- [ ] 変更内容の説明
- [ ] 影響範囲
- [ ] テスト結果
- [ ] スクリーンショット（UI変更の場合）
- [ ] レビュワーの指定
- [ ] ラベルの設定
- [ ] マイルストーンの設定（必要に応じて）

### 10. CI/CD の監視

**CI/CD パイプラインの確認**:

- GitHub Actions: リポジトリの "Actions" タブ
- GitLab CI/CD: リポジトリの "CI/CD > Pipelines"

**確認項目**:

- [ ] すべてのジョブが成功している
- [ ] テストが通過している
- [ ] ビルドが成功している
- [ ] デプロイが成功している（該当する場合）

**CI失敗時の対応**:

1. ログを確認してエラー原因を特定
2. ローカルで再現して修正
3. 修正をコミット・プッシュ
4. CI が成功するまで繰り返す

### 11. チームへの通知

**通知方法**:

- Slack / Microsoft Teams / Discord へ通知
- メール通知
- プロジェクト管理ツール（Jira, Asana等）への更新

**通知内容**:

- 変更内容の概要
- PR/MR のURL
- 影響範囲
- レビュー依頼
- テスト結果

## 完了条件

- ローカルブランチがリモートリポジトリにプッシュされている
- テスト・Lint・CI が成功している
- Pull Request / Merge Request が作成されている（該当する場合）
- 必要なドキュメント更新・Issueリンク・レビュー依頼が整備されている
- チームへの通知が完了している

## エスカレーション

- **プッシュが失敗する**:
  - 認証情報を確認（PAT, SSH鍵）
  - リモートURLを確認
  - プッシュ権限を確認
  - ネットワーク接続を確認

- **プッシュ後のCIが失敗する**:
  - ログを確認して原因を特定
  - ローカルで再現して修正
  - 対応が難しい場合はチームリードへ報告

- **コンフリクトが解消できない**:
  - ベースブランチの変更を確認
  - コンフリクトファイルを手動マージ
  - チームメンバーと調整

- **セキュリティやコンプライアンスの問題**:
  - セキュリティチームへ報告
  - レビュープロセスに従う
  - 必要に応じて変更を取り下げ

## ベストプラクティス

- **小さく頻繁にコミット**: 大きな変更は複数のコミットに分割
- **意味のあるコミットメッセージ**: 変更内容が分かりやすいメッセージ
- **テストを先に実行**: プッシュ前に必ずテストを実行
- **ドキュメントを更新**: 変更に伴うドキュメント更新を忘れない
- **レビューを依頼**: 重要な変更は必ずレビューを受ける
- **CI/CDを監視**: プッシュ後のCI/CD結果を確認
- **main/masterへの直接プッシュを避ける**: ブランチ戦略に従う
- **強制プッシュは慎重に**: `--force-with-lease` を使用し、共有ブランチでは避ける

## 参考: プラットフォーム別の機能

**GitHub**:

- Pull Request (PR)
- GitHub Actions (CI/CD)
- GitHub Projects (プロジェクト管理)
- GitHub Discussions (ディスカッション)
- GitHub CLI: `gh`

**GitLab**:

- Merge Request (MR)
- GitLab CI/CD
- GitLab Issues (課題管理)
- GitLab Wiki (ドキュメント)
- GitLab CLI: `glab`

**共通機能**:

- ブランチ保護
- コードレビュー
- CI/CD パイプライン
- Issue/課題管理
- Wiki/ドキュメント
- Webhooks
- API アクセス
