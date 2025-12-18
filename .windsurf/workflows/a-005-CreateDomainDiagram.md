---
description: ドメインモデルをMermaid図で視覚化し、Context MapやAggregate構造を図示するワークフロー
---

# CreateDomainDiagram (a-005)

## 目的

- ドメインモデルドキュメント（`01-domain-model.md`）を基に、視覚的なダイアグラムを作成する。
- Context Map（Bounded Context間の関係図）をMermaid形式で図示する。
- 各Bounded Context内のAggregate構造や関係性を図示する（オプション）。

## 前提

- `docs/project/domain/01-domain-model.md` が作成されていること（先に `DefineDomainModel` (a-004) を実行）。
- ドメインモデルドキュメントにBounded Contextの一覧と関係性が記述されていること。

## 手順

### 1. ドキュメントの確認

- `docs/project/domain/01-domain-model.md` を読み込み、内容を確認する。

  ```bash
  ls -la docs/project/domain/01-domain-model.md 2>/dev/null || echo "ファイルが存在しません"
  ```

- ファイルが存在しない場合：
  - ユーザーに通知：「ドメインモデルが見つかりません。先に `DefineDomainModel` (a-004) を実行してください。」

### 2. Context Map の情報収集と提案

- `docs/project/domain/01-domain-model.md` から以下の情報を抽出する：
  - Bounded Contextのリスト
  - 戦略的分類（Core / Supporting / Generic）
  - Context間の関係性

- 抽出した情報に基づき、Mermaid図の構成案を提示する：
  - 「以下の関係を図示します：」
  - 「Context A --> Context B (関係パターン)」

### 3. Context Map 図の作成

- `docs/project/domain/01-domain-model.md` の `## Context Map` セクションに Mermaid図を追加（または更新）する。
- **スタイル定義**:
  - Core Domain: 金色 (`fill:#FFD700`)
  - Supporting Domain: 水色 (`fill:#87CEEB`)
  - Generic Domain: グレー (`fill:#D3D3D3`)
- **エッジ定義**:
  - 関係パターンと通信方法をラベルに記載する。

### 4. 詳細図の作成（オプション）

- ユーザーに確認：「以下の詳細図も作成しますか？」
  - **Aggregate構造図**: クラス図形式でAggregateの内部構造と関係性を表現。
  - **イベントフロー図**: シーケンス図形式で主要なビジネスフロー（Command -> Event -> Policy）を表現。

- 「はい」の場合、対象のBounded Contextやシナリオを確認し、図を作成してドキュメント内の適切な箇所に追加する。

### 5. レビューと確認

- 作成した図をユーザーに提示し、以下を確認：
  - 「関係性は正しく表現されていますか？」
  - 「分類の色分けは適切ですか？」
  - 「複雑すぎて読みにくい箇所はありませんか？」

- フィードバックに基づき、レイアウト（TD/LR）や配置を調整する。

### 6. 完了条件と構造の確認

- 以下の完了条件を満たしているか、コマンドとチェックリストで確認してください：

  1. **構造確認**:

     ```bash
     # Mermaidブロックの存在確認
     grep "\`\`\`mermaid" docs/project/domain/01-domain-model.md && echo "OK" || echo "MISSING: Mermaid diagram"
     # Context Mapセクションの確認
     grep "## Context Map" docs/project/domain/01-domain-model.md && echo "OK" || echo "MISSING: Context Map section"
     ```

  2. **チェックリスト**:
     - [ ] `docs/project/domain/01-domain-model.md` にContext Map図が含まれている
     - [ ] Mermaid図が正しくレンダリングされる（構文エラーがない）
     - [ ] 戦略的分類に応じて色分けされている

### 7. Git への追加（オプション）

- ユーザーに確認：「更新したドメインモデルドキュメントを Git に追加しますか？」
- 「はい」の場合、以下を実行：

  ```bash
  git add docs/project/domain/01-domain-model.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: ドメインモデル図（Context Map）の追加

  - Bounded Context間の関係をMermaid図で視覚化
  - 戦略的分類に基づく色分けを追加
  ```

## 完了条件

- `docs/project/domain/01-domain-model.md` にContext Map図が追加されている。
- Bounded Context間の関係性が正しく表現されている。
- 戦略的分類が視覚的に区別されている。
- オプションの詳細図（Aggregate図、シーケンス図）が必要に応じて追加されている。
- ユーザーが図の内容を承認している。

## エスカレーション

- ドメインモデルが不完全で図を作成できない場合：
  - 「必要な情報（関係性など）が不足しています。`DefineDomainModel` (a-004) に戻って定義を補完しましょう。」と提案する。
- 図が複雑すぎて読みにくい場合：
  - 「関係が複雑すぎます。主要な関係のみに絞るか、図を分割することを検討しましょう。」と提案する。
