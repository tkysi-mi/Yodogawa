# 設計ドキュメント間の一貫性チェック項目

SKILL.md 手順2 で実施する 6 観点の詳細。**観点 2.1〜2.5 は doctor 非対応**（`bin/lib/project-spec.js` の `ID_FAMILIES` に 04-design 向けの ID 族が定義されていないため、`id-trace` は 04-design 配下を検査対象にしない）。手順1の doctor 呼び出しは `structure` チェックによる存在確認・必須見出し確認、および 2.6 向けの `placeholder`（`[Owner名]` 残置）検出に使う。2.1〜2.5 はすべて Read/Grep による手動確認＋file:line引用で判定する。

## 2.1 テックスタック ↔ アーキテクチャ

- **整合性**: `01-tech-stack.md` で選定された技術がアーキテクチャ図（`07-architecture.md`）のコンポーネントと一致しているか。
- **ADR**: 重要な技術選定理由が ADR として記録されているか。

以下の grep は固定語リストによる補助検索であり、判定の代わりにはならない（新しい技術選定が語彙に含まれず検出漏れになりうる）。判定は必ず Read で該当箇所を確認し file:line を引用して行う。

```bash
# tech-stack で挙がった技術が architecture に登場するか（補助検索）
grep -oE "PostgreSQL|Redis|NestJS|Next.js" docs/project/04-design/01-tech-stack.md | sort -u
grep -oE "PostgreSQL|Redis|NestJS|Next.js" docs/project/04-design/07-architecture.md | sort -u
```

## 2.2 データモデル ↔ ドメインモデル

- **カバレッジ**: ドメインの中核エンティティ（`01-domain-sketch.md`、Full DDD 採用時は `01-domain-model.md` の Aggregate）がデータモデル（`05-data-model.md`）のエンティティとして定義されているか。
- **用語統一**: テーブル名・カラム名がユビキタス言語と一致しているか。

## 2.3 API 仕様 ↔ データモデル

- **リソース**: API リソース（`06-api-spec.md`）がデータモデルのエンティティに基づいているか。
- **フィールド**: API のレスポンスフィールドがデータモデルに存在するか、または意図的な派生フィールドとして明示されているか。

## 2.4 画面設計 ↔ API 仕様

- **カバレッジ**: 画面（`03-screen-design.md`）で必要なデータ取得・操作が API エンドポイントとして定義されているか。
- **状態**: エラー状態やロード状態に対応するレスポンス仕様があるか。

## 2.5 インフラ ↔ アーキテクチャ

- **構成**: インフラ構成（`08-infrastructure.md`）がアーキテクチャ図のコンポーネントを網羅しているか。
- **非機能要件**: 可用性・セキュリティ要件がインフラ設計に反映されているか。

## 2.6 ドキュメントメタ情報（Owner / Status）

各設計ドキュメント冒頭のメタヘッダ（Owner / Status / Last-updated）を確認する。**Owner の未記入（`[Owner名]` の残置）は doctor の placeholder が検出する**（一部 doctor 対応）。Status の整合はエージェントの読解判断。

- **Owner**: `[Owner名]` のまま、または空 → FAIL。文書責任者をユーザーに確認して記入を提案する。
- **Status**: フェーズと不整合（例: 設計レビュー段階なのに `draft` のまま）→ FAIL ではなく更新提案として記録する。
- **ヘッダ自体が無い**（旧テンプレート由来のドキュメント）→ FAIL にせず PASS＋注記とし、メタヘッダの追補を提案する。

## エスカレーション判断基準

- **致命的な不整合**: データモデルと API の大きな乖離 → 実装手戻りを防ぐため設計見直しを強く推奨
- **ドメインモデルとの乖離**: ビジネスロジックの破綻リスク → 設計がドメインの意図を反映しているか確認
- **複数の Error**: タスク分解前に必ず解消する

## Git への追加（任意）

```bash
git add docs/project/DESIGN-REVIEW-REPORT-*.md
git commit -m "docs: 設計整合性レビューレポートの作成"
```
