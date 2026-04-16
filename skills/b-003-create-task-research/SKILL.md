---
name: b-003-create-task-research
description: タスク実装前に既存コード・ベストプラクティス・再利用候補・リスクを調査し b-research.md に記録する。タスク定義確定後、実装計画作成前に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "[task-id]"
---

# CreateTaskResearch (b-003)

## 目的

- 実装に着手する前に、最適なアプローチ・技術・注意点を整理する。
- 既存コードやコンポーネントを把握し、重複実装や手戻りを防止する。
- 技術選定・リスク・参考資料を記録し、実装計画 (b-004) の入力とする。

## 前提

- `CreateTaskDefinition (b-002)` が完了し、`a-definition.md` に目的・変更内容が記載されている。
- タスクディレクトリ: `docs/tasks/task{ID}-{SLUG}/`
- テンプレート: `{IDE_DIR}/templates/tasks/task-template/b-research.md`

## 手順

`$ARGUMENTS` が指定されている場合は `task{ID}-{SLUG}`（例: `task000003-auth-login`）として使用する。未指定の場合はユーザーに対象タスクを確認する。

### 1. ドキュメントとテンプレートの準備

```bash
# 対象タスクの確認
ls -d docs/tasks/task*

# テンプレート未設置ならコピー
SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/tasks/task-template/b-research.md" \
   "docs/tasks/task{ID}-{SLUG}/b-research.md"
```

### 2. 調査計画の立案

- `a-definition.md` を読み、変更対象・技術要件・制約を抽出。
- 調査する観点を整理：例）類似実装、利用ライブラリ、外部API仕様、セキュリティ要件。
- 調査メモを残しながら進めると、ドキュメント作成がスムーズ。

### 3. 既存実装と再利用候補の調査

- コードベースを検索し、類似ロジックやコンポーネントを洗い出す。
- 再利用できるファイル・モジュール・カスタムフック・APIクライアントをリスト化。
- 参考にできる実装パターン（バリデーション、エラーハンドリング等）と課題点を併記。
- 詳細な調査観点・分析項目は [reference/investigation-guide.md](reference/investigation-guide.md) を参照。

### 4. ベストプラクティス・外部情報の調査

- 公式ドキュメント、信頼できる記事、社内ナレッジを確認し、採用すべきパターン/アンチパターンを整理。
- 調査内容（タイトル、要点、URL）を記録。例）フォームバリデーション、非同期通信、セキュリティガイドライン。

### 5. 技術選定と比較（必要時）

- 新規導入・置き換え候補のライブラリ/サービスを比較。
- 比較観点: メンテ状況、TypeScript対応、バンドルサイズ、コスト、既存スタックとの親和性。
- 選定理由と却下理由を記録。チーム合意が必要な場合はその旨も記載。
- 詳細な比較観点は [reference/investigation-guide.md](reference/investigation-guide.md) を参照。

### 6. 技術的リスクと対策

- パフォーマンス、セキュリティ、スケーラビリティ、依存サービス等のリスクを洗い出す。
- 影響度と優先度（高/中/低）を付与し、軽減策やPoCの必要有無を記載。
- リスクカテゴリ一覧とセキュリティチェック項目は [reference/investigation-guide.md](reference/investigation-guide.md) を参照。

### 7. ドキュメントへの反映

1. `docs/tasks/task{ID}-{SLUG}/b-research.md` を編集し、以下を記入：
   - ベストプラクティス / 参考リンク
   - 既存コード・再利用コンポーネント
   - 技術選定（比較表含む）
   - 技術的リスク・制約
   - メモ / 次に確認すべき事項
2. HTMLコメントはガイドとして残す。
3. 各セクションの表テンプレートは [examples/research-tables.md](examples/research-tables.md) を参照。

### 8. 構造チェック

```bash
grep "## ベストプラクティス" docs/tasks/task{ID}-{SLUG}/b-research.md \
 && grep "## 既存コード調査" docs/tasks/task{ID}-{SLUG}/b-research.md \
 && grep "## 技術選定" docs/tasks/task{ID}-{SLUG}/b-research.md \
 && grep "## 技術的リスク" docs/tasks/task{ID}-{SLUG}/b-research.md \
 && echo "OK" || echo "MISSING SECTION"
```

チェックリスト:

- [ ] 参考リンク・出典が記載されている
- [ ] 再利用できるコード/コンポーネントが明確
- [ ] 技術選定理由と代替案が整理されている
- [ ] リスクに軽減策と優先度が付与されている

### 9. Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/b-research.md
git commit -m "docs(task): 技術調査メモの作成 task{ID}"
```

## 完了条件

- `b-research.md` に以下が網羅されている：
  - ベストプラクティス／参考資料
  - 既存コード・再利用コンポーネント
  - 技術選定と比較（必要に応じて）
  - 技術的リスクと対策
  - 追加のメモ／未解決事項
- 実装計画 (b-004) に渡せるレベルで情報が整理されている。
- 関係者が内容を確認し、疑問があれば解消済み。

## エスカレーション

- **既存コードが見つからない**: 「コードベースを検索しても見つからない場合、他メンバーに確認し、再利用可否を判断してください。」
- **ライブラリ選定で決め手がない**: 「評価軸を追加（保守実績、サポート、コストなど）し、比較表を拡張してください。」
- **リスクが高い**: 「影響が重大なリスクは PoC や専門チーム相談を提案し、スケジュールに反映してください。」
- **外部サービス依存がある**: 「SLA・レート制限・コストを確認し、代替案やフォールバックを検討してください。」
- **ドキュメントが不足**: 「ベストプラクティスや参考資料の記載が不十分です。公式ドキュメントや社内ナレッジを追加してください。」
- **セキュリティリスクが見落とされている**: 「入力バリデーション／XSS/CSRF/SQLi／認証・認可／暗号化／レート制限の観点で再調査してください。」
- **パフォーマンスリスクが見落とされている**: 「大量データや高負荷時の動作を検討してください。」
- **新ライブラリ導入がチーム未合意**: 「チームリーダーやメンバーとレビュー・合意を取ってください。」

## 参考

- [reference/investigation-guide.md](reference/investigation-guide.md) — 調査観点・分析項目・リスクカテゴリの詳細
- [examples/research-tables.md](examples/research-tables.md) — 各セクションの表テンプレート例
