---
name: a-014-define-infrastructure
description: 技術スタックとアーキテクチャ設計を基に、インフラ構成図、環境構成、運用方針を定義するワークフロー
---

# DefineInfrastructure (a-014)

## 目的

- 技術スタックとアーキテクチャ設計を基に、インフラ構成を定義する。
- クラウドリソース、ネットワーク、セキュリティ、監視を含む全体構成を可視化する。
- 環境ごとの構成（開発、ステージング、本番）を明確化する。
- 高可用性、冗長化、スケーラビリティ、セキュリティの方針を定義する。

## 前提

- `docs/project/design/01-tech-stack.md` が作成されていること（デプロイ環境、インフラ技術選定済み）。
- `docs/project/design/07-architecture.md` が作成されていること（推奨）。
- `docs/project/design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

- 必要なドキュメントを読み込む：
  - `docs/project/design/01-tech-stack.md`
  - `docs/project/design/07-architecture.md`

- ドキュメントが不足している場合、対応するワークフローの実行を促す。

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/04-design/08-infrastructure.md" "docs/project/design/08-infrastructure.md"
  ```

### 3. インフラ構成の提案

- 技術スタックとアーキテクチャ図から、必要なインフラリソース（VPC, ALB, EC2/ECS, RDS等）を抽出する。
- **インフラ構成案の提示**:
  - 「以下の構成を提案します：」
  - 「[Cloud Provider] 上に [Pattern] (例: VPC + Public/Private Subnet) を構築」
  - 「DBは [Managed Service] (例: RDS) を使用」

### 4. 詳細定義（インタビュー）

ユーザーからのフィードバックを受け、詳細を定義する。

#### 4.1 ネットワークとセキュリティ

- VPC構成、サブネット分割（Public/Private/Data）
- セキュリティグループ方針、WAF、HTTPS化

#### 4.2 コンピューティングとスケーリング

- インスタンスタイプ/サイズ
- Auto Scalingポリシー（CPU負荷等）

#### 4.3 データベースとストレージ

- Multi-AZ構成、リードレプリカの有無
- バックアップ方針（頻度、保持期間）

#### 4.4 環境構成

- 開発/ステージング/本番環境の差異（リソースサイズ、冗長化）

### 5. ドキュメント作成

- `docs/project/design/08-infrastructure.md` に決定事項を記入する。
- **必須項目**:
  - インフラ構成図 (Mermaid)
  - 環境構成表
  - 運用方針（バックアップ、監視、セキュリティ）

### 6. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：
  1. **構造確認**:

     ```bash
     # インフラ構成図の確認
     grep "\`\`\`mermaid" docs/project/design/08-infrastructure.md && echo "OK" || echo "MISSING: Infra Diagram"
     # 環境構成の確認
     grep "## 環境構成" docs/project/design/08-infrastructure.md && echo "OK" || echo "MISSING: Environments"
     # 運用方針の確認
     grep "## 主要な運用方針" docs/project/design/08-infrastructure.md && echo "OK" || echo "MISSING: Operations"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/design/08-infrastructure.md` が作成されている
     - [ ] 本番環境の構成（冗長化など）が明確になっている
     - [ ] バックアップや監視の方針が記録されている

### 7. Git への追加（オプション）

- ユーザーに確認：「作成したインフラ設計ドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/design/08-infrastructure.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: インフラ設計の定義

  - インフラ構成図（Mermaid）の作成
  - 環境構成と運用方針の記録
  ```

## 完了条件

- `docs/project/design/08-infrastructure.md` が作成されている。
- インフラの物理構成とネットワーク構成が可視化されている。
- 環境ごとの差異が明確になっている。
- 運用上の重要事項（バックアップ、セキュリティ）が定義されている。
- ユーザーが内容を承認している。

## エスカレーション

- コストが高すぎる場合：
  - 「冗長化構成によりコストが増加します。ステージング環境はSingle-AZにするなど、コスト最適化を検討しましょう。」と提案する。
- セキュリティリスクがある場合：
  - 「DBがパブリックサブネットに配置されています。プライベートサブネットへの移動を強く推奨します。」と警告する。
