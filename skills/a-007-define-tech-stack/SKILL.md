---
name: a-007-define-tech-stack
description: 要件とドメインモデルを踏まえて推奨技術スタックを提案し、対話で最終確定する。ドメイン設計完了後、実装技術を選定する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineTechStack (a-007)

## 目的

- 既存の要件ドキュメント（システム概要、非機能要件、ドメインモデル）を分析し、適合する技術スタックを推奨する。
- 推奨案を提示した上で、ユーザーと詳細なインタビューを行い、すべての技術選定を明確化する。
- 技術選定の理由、バージョン、選定タイミング（初期/中期/後期/随時）を明確に記録する。

## 前提

- `docs/project/requirements/` 配下のドキュメントが作成されていること。
- `docs/project/domain/` 配下のドキュメントが作成されていること。
- `docs/project/design/` ディレクトリが存在すること（未作成なら `/a-001-setup-doc-structure`）。

## 手順

### 1. ドキュメントと前提条件の確認

```bash
ls -la docs/project/design/ 2>/dev/null || echo "ディレクトリが存在しません"
```

要件ドキュメント（`01-system-overview.md`, `03-features-planned.md`, `04-non-functional-requirements.md`）とドメインモデル（`01-domain-model.md`）を読み込む。

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/01-tech-stack.md" "docs/project/design/01-tech-stack.md"
```

### 3. 要件分析と推奨技術スタックの生成

- **システム特性の分析**: アプリケーションタイプ（SPA/SSR 等）、非機能要件、ドメイン複雑度
- **レイヤー別推奨**: フロントエンド / バックエンド / データベース / インフラ・CI/CD / 監視・テスト
- **提示形式**: 各技術に「推奨理由」と「代替案」を付ける

提案フォーマットと各層の候補一覧は [examples/stack-interview.md](examples/stack-interview.md#推奨案提示フォーマット) を参照。

### 4. 詳細インタビューと選定

フィードバックを受けてレイヤーごとに詳細確認する。各レイヤーの具体的な質問項目は [examples/stack-interview.md](examples/stack-interview.md#レイヤー別インタビュー項目) を参照。

- フロントエンド: フレームワーク、TypeScript、状態管理、スタイリング
- バックエンド: 言語、フレームワーク、API スタイル
- データベース: RDBMS/NoSQL、ORM、マイグレーション
- インフラ: クラウド、コンテナ、IaC
- 開発ツール: リンター、テスト、CI/CD

### 5. ドキュメント作成

ヒアリング結果を `docs/project/design/01-tech-stack.md` に記入する。必須項目:

- 技術名、バージョン
- 選定理由（要件とのマッピング）
- 選定タイミング（初期/中期/後期/随時）

記入例は [examples/stack-interview.md](examples/stack-interview.md#記入例表形式) を参照。

### 6. 構造チェック

```bash
grep "### フロントエンド" docs/project/design/01-tech-stack.md \
  && grep "### バックエンド" docs/project/design/01-tech-stack.md \
  && echo "OK" || echo "MISSING SECTION"
```

詳細チェックリストは [reference/structure-check.md](reference/structure-check.md#チェックリスト) を参照。

### 7. Git への追加（任意）

```bash
git add docs/project/design/01-tech-stack.md
git commit -m "docs: 技術スタック選定ドキュメントの作成"
```

詳細は [reference/structure-check.md](reference/structure-check.md#git-への追加任意) を参照。

## 完了条件

- `docs/project/design/01-tech-stack.md` が作成されている。
- すべてのレイヤーについて技術選定が完了している（または「保留」として記録されている）。
- 選定理由とバージョンが明確になっている。
- ユーザーが内容を承認している。

## エスカレーション

- **ユーザーが決められない**: 「要件に基づき、最も標準的でリスクの少ない [技術名] を仮採用とし、実装フェーズで再評価しませんか？」
- **コスト・学習コストの懸念**: 「初期フェーズは慣れた技術（[技術名]）を採用し、複雑要件が出てから移行検討しましょう。」
- 詳細応答例は [reference/structure-check.md](reference/structure-check.md#エスカレーション時の推奨応答) を参照。

## 参考

- [examples/stack-interview.md](examples/stack-interview.md) — 推奨案フォーマット、レイヤー別インタビュー項目、選定タイミング区分、記入例
- [reference/structure-check.md](reference/structure-check.md) — 構造確認コマンド、チェックリスト、レビュー質問、Git 追加例
