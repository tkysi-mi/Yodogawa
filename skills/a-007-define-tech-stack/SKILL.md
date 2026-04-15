---
name: a-007-define-tech-stack
description: 要件を分析して推奨技術スタックを提案し、ユーザーとの詳細なインタビューを通じて最適な技術選定を行うワークフロー
---

# DefineTechStack (a-007)

## 目的

- 既存の要件ドキュメント（システム概要、非機能要件、ドメインモデル）を分析し、適合する技術スタックを推奨する。
- 推奨案を提示した上で、ユーザーと詳細なインタビューを行い、すべての技術選定を明確化する。
- 技術選定の理由、バージョン、選定タイミング（初期/中期/後期/随時）を明確に記録する。

## 前提

- `docs/project/requirements/` 配下のドキュメントが作成されていること。
- `docs/project/domain/` 配下のドキュメントが作成されていること。
- `docs/project/design/` ディレクトリが存在すること（存在しない場合は先に `SetupDocStructure` (a-001) を実行）。

## 手順

### 1. ドキュメントと前提条件の確認

- `docs/project/design/` ディレクトリの存在を確認

  ```bash
  ls -la docs/project/design/ 2>/dev/null || echo "ディレクトリが存在しません"
  ```

- 存在しない場合：ユーザーに通知し、`SetupDocStructure` (a-001) を実行するよう促す。

- 必要な要件ドキュメントを読み込む：
  - `docs/project/requirements/01-system-overview.md`
  - `docs/project/requirements/03-features-planned.md`
  - `docs/project/requirements/04-non-functional-requirements.md`
  - `docs/project/domain/01-domain-model.md`

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/04-design/01-tech-stack.md" "docs/project/design/01-tech-stack.md"
  ```

### 3. 要件分析と推奨技術スタックの生成

- **システム特性の分析**: アプリケーションタイプ（SPA/SSR等）、非機能要件（パフォーマンス/セキュリティ）、ドメイン複雑度を分析する。
- **推奨案の作成**: 以下のレイヤーごとに推奨技術を選定する。
  1. フロントエンド
  2. バックエンド
  3. データベース
  4. インフラ・CI/CD
  5. 監視・テスト

- **推奨案の提示**:
  - 「要件分析の結果、以下の技術スタックを推奨します：」
  - 各技術について「推奨理由」と「代替案」を提示する。

### 4. 詳細インタビューと選定

ユーザーからのフィードバックを受け、各レイヤーについて詳細を確認する。

- **フロントエンド**: フレームワーク（React/Vue等）、TypeScript利用、状態管理、スタイリング。
- **バックエンド**: 言語、フレームワーク、APIスタイル（REST/GraphQL）。
- **データベース**: RDBMS/NoSQL、ORM、マイグレーション戦略。
- **インフラ**: クラウド/PaaS、コンテナ化（Docker）、IaC。
- **開発ツール**: リンター/フォーマッター、テストツール、CI/CD。

### 5. ドキュメント作成

- ヒアリング結果を `docs/project/design/01-tech-stack.md` に記入する。
- **必須項目**:
  - 技術名、バージョン
  - 選定理由（要件とのマッピング）
  - 選定タイミング（初期/中期/後期）

### 6. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # フロントエンドセクションの確認
     grep "### フロントエンド" docs/project/design/01-tech-stack.md && echo "OK" || echo "MISSING: Frontend section"
     # バックエンドセクションの確認
     grep "### バックエンド" docs/project/design/01-tech-stack.md && echo "OK" || echo "MISSING: Backend section"
     # 技術選定理由の確認（メモ欄など）
     grep "|" docs/project/design/01-tech-stack.md | head -n 5
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/01-tech-stack.md` が作成されている
     - [ ] 主要なレイヤー（FE, BE, DB, Infra）の技術が選定されている
     - [ ] 選定理由が明確に記載されている

### 7. Git への追加（オプション）

- ユーザーに確認：「作成した技術スタックドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/01-tech-stack.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: 技術スタック選定ドキュメントの作成

  - フロントエンド、バックエンド、インフラ等の技術選定を定義
  - 選定理由と導入フェーズを明記
  ```

## 完了条件

- `docs/project/design/01-tech-stack.md` が作成されている。
- すべてのレイヤーについて技術選定が完了している（または「保留」として記録されている）。
- 選定理由とバージョンが明確になっている。
- ユーザーが内容を承認している。

## エスカレーション

- ユーザーが決められない場合：
  - 「要件に基づき、最も標準的でリスクの少ない[技術名]を仮採用とし、実装フェーズで再評価しませんか？」と提案する。
- コストや学習コストの懸念がある場合：
  - 「初期フェーズは慣れた技術（[技術名]）を採用し、複雑な要件が出てきた段階で移行を検討しましょう。」と提案する。
