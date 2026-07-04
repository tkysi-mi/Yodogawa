---
name: a-014-define-infrastructure
description: アーキテクチャ設計を基にインフラ構成図・環境構成・運用方針を定義する。アーキテクチャ確定後、デプロイ/運用環境を設計する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineInfrastructure (a-014)

## 目的

- 技術スタックとアーキテクチャ設計を基に、インフラ構成を定義する。
- クラウドリソース、ネットワーク、セキュリティ、監視を含む全体構成を可視化する。
- 環境ごとの構成（開発、ステージング、本番）を明確化する。
- 高可用性、冗長化、スケーラビリティ、セキュリティの方針を定義する。
- Product Brief の「クリティカル制約」を起点に、初期フェーズで保留した**詳細な非機能要件（応答時間・稼働率・スケーラビリティ・RPO/RTO 等の定量値）を本フェーズで定量化・所有する**。

## 前提

- `docs/project/04-design/01-tech-stack.md` が作成されていること（デプロイ環境、インフラ技術選定済み）。
- `docs/project/04-design/07-architecture.md` が作成されていること（推奨）。
- `docs/project/01-requirements/01-product-brief.md` の「クリティカル制約」（詳細 NFR 定量化の起点）。
- `docs/project/04-design/` ディレクトリが存在すること。

## 手順

### 1. ドキュメントと前提条件の確認

以下を読み込む:

- `docs/project/04-design/01-tech-stack.md`
- `docs/project/04-design/07-architecture.md`

不足があれば対応スキルの実行を促す。

### 2. テンプレートの準備

このスキルの配置ディレクトリ（`skills/a-014-define-infrastructure/`）を起点に、相対パス `../../templates/project/04-design/08-infrastructure.md` を Read で読み込み、その内容を `docs/project/04-design/08-infrastructure.md` へ Write する。出力先が既に存在する場合は上書きせずスキップして報告する（冪等）。出力先ディレクトリ（`docs/project/04-design/`）が無ければ作成する。

コピー直後に、ドキュメント冒頭のメタヘッダを記入する（Owner は文書責任者。未確認ならユーザーに確認し、既存 docs があればその Owner を引き継ぐ / Status は `draft` / Last-updated は当日日付）。

### 3. インフラ構成の提案

技術スタックとアーキテクチャ図から必要なリソース（VPC, ALB, ECS/EC2, RDS 等）を抽出し、構成案を提示する。

- 「[Cloud Provider] 上に VPC + Public/Private Subnet 構成」
- 「DB は Managed Service（RDS 等）」

構成図のサンプルは [examples/infrastructure-templates.md](examples/infrastructure-templates.md#インフラ構成図mermaid) を参照。

### 4. 詳細定義（インタビュー）

#### 4.1 ネットワークとセキュリティ

VPC 構成、サブネット分割（Public/Private/Data）、セキュリティグループ、WAF、HTTPS 化。詳細は [examples/infrastructure-templates.md](examples/infrastructure-templates.md#ネットワークセキュリティ) を参照。

#### 4.2 コンピューティングとスケーリング

インスタンス種別・サイズ、Auto Scaling ポリシー（CPU 負荷等）、デプロイ戦略。

#### 4.3 データベースとストレージ

Multi-AZ 構成、リードレプリカ、バックアップ（頻度、保持期間）、PITR の有無。

#### 4.4 環境構成

開発/ステージング/本番環境の差異（リソースサイズ、冗長化、WAF など）。表形式のテンプレートは [examples/infrastructure-templates.md](examples/infrastructure-templates.md#環境構成表) を参照。

#### 4.5 詳細な非機能要件（定量化）

Product Brief の「クリティカル制約」を起点に、性能（応答時間・スループット）・可用性（稼働率・RPO/RTO）・スケーラビリティ・セキュリティ等を定量化する。初期フェーズでは保留していた定量値をここで確定する。テンプレートは [examples/non-functional-requirements.md](examples/non-functional-requirements.md)、特に指定が無い場合の標準提案値は [examples/nfr-baseline.md](examples/nfr-baseline.md) を参照。

### 5. ドキュメント作成

`docs/project/04-design/08-infrastructure.md` に以下を記入する:

- インフラ構成図（Mermaid）
- 環境構成表
- 運用方針（バックアップ、監視、セキュリティ）

運用方針の項目一覧は [examples/infrastructure-templates.md](examples/infrastructure-templates.md#運用方針の定義項目) を、非機能要件との対応表は [reference/structure-check.md](reference/structure-check.md#非機能要件との対応確認) を参照。

### 6. 構造チェック

```bash
grep "\`\`\`mermaid" docs/project/04-design/08-infrastructure.md \
  && grep "## 環境構成" docs/project/04-design/08-infrastructure.md \
  && grep "## 主要な運用方針" docs/project/04-design/08-infrastructure.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/project/04-design/08-infrastructure.md
git commit -m "docs: インフラ設計の定義"
```

## 完了条件

- `docs/project/04-design/08-infrastructure.md` が作成されている。
- インフラの物理構成とネットワーク構成が可視化されている。
- 環境ごとの差異が明確になっている。
- 運用上の重要事項（バックアップ、セキュリティ）が定義されている。
- ユーザーが内容を承認している。

## エスカレーション

- **コストが高すぎる**: 「冗長化構成によりコストが増加します。ステージング環境は Single-AZ にするなど、コスト最適化を検討しましょう。」
- **セキュリティリスク**: 「DB がパブリックサブネットに配置されています。プライベートサブネットへの移動を強く推奨します。」
- 詳細応答例は [reference/structure-check.md](reference/structure-check.md#エスカレーション時の推奨応答) を参照。

## 参考

- [examples/infrastructure-templates.md](examples/infrastructure-templates.md) — インフラ構成図、環境構成表、運用方針の定義項目
- [examples/non-functional-requirements.md](examples/non-functional-requirements.md) — 詳細な非機能要件テンプレート（設計フェーズで定量化）
- [examples/nfr-baseline.md](examples/nfr-baseline.md) — 非機能要件の標準ベースライン提案値
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、非機能要件対応、レビュー質問
