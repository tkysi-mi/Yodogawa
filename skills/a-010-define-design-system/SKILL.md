---
name: a-010-define-design-system
description: カラー・タイポグラフィ・スペーシング・コンポーネントスタイルを含むデザインシステムを定義する。画面設計後、UI 実装のスタイル基盤を固める際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineDesignSystem (a-010)

## 目的

- プロジェクト全体で一貫したビジュアルデザインを実現するデザインシステムを定義する。
- カラーパレット、タイポグラフィ、スペーシング、コンポーネントスタイルを標準化する。
- デザイナーと開発者が共通言語として使える仕様書を作成する。

## 前提

- `docs/project/design/03-screen-design.md` が作成されている（画面設計完了）
- `docs/project/design/01-tech-stack.md` が作成されている（UI フレームワーク決定）

## 手順

### 1. 既存ドキュメントの確認

- `docs/project/design/01-tech-stack.md` — 使用する CSS フレームワーク（Tailwind, MUI 等）
- `docs/project/design/03-screen-design.md` — 画面設計とレスポンシブポリシー
- ブランドガイドラインがあれば参照

### 2. テンプレートの準備

```bash
SCRIPT_DIR=$(for d in .claude .agents; do [ -d "$d" ] && echo "$d" && break; done)
cp "$SCRIPT_DIR/templates/project/04-design/04-design-system.md" \
   "docs/project/design/04-design-system.md"
```

### 3. カラーパレットの定義

- **Primary Colors**: ブランドカラー（1〜2色）
- **Secondary Colors**: アクセントカラー
- **Semantic Colors**: Success, Warning, Error, Info
- **Neutral Colors**: グレースケール（背景、テキスト、ボーダー）
- **Dark Mode 対応**: 必要に応じてダークテーマも定義

CSS 変数のサンプルは [examples/css-tokens.md](examples/css-tokens.md#カラーパレット) を参照。

### 4. タイポグラフィの定義

- **フォントファミリー**: 見出し用、本文用、コード用
- **フォントサイズスケール**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **行間**: tight, normal, relaxed
- **フォントウェイト**: normal, medium, semibold, bold

サンプル: [examples/css-tokens.md](examples/css-tokens.md#タイポグラフィ)

### 5. スペーシングシステムの定義

基本単位は 4px または 8px ベース。スケール・用途・サンプルは [examples/css-tokens.md](examples/css-tokens.md#スペーシング) と [reference/component-catalog.md](reference/component-catalog.md#スペーシングの設計方針) を参照。

### 6. コンポーネントスタイルの定義

以下のコンポーネントについて、バリアントとステートを定義:

- ボタン
- フォーム要素（Input, Textarea, Select, Checkbox, Radio）
- カード / コンテナ
- その他（Badge, Tag, Avatar, Tooltip, Modal）

詳細なバリアント・ステート一覧は [reference/component-catalog.md](reference/component-catalog.md#コンポーネントスタイル) を参照。

### 7. アイコン・イラストガイドライン

- アイコンライブラリ（Lucide / Heroicons / Material Icons 等）の選定
- サイズ規定とスタイル統一（Outline / Filled のいずれか）

詳細: [reference/component-catalog.md](reference/component-catalog.md#アイコンガイドライン)

### 8. アニメーション・トランジション

- Duration: fast(150ms), normal(300ms), slow(500ms)
- Easing: ease-in-out をデフォルトに

サンプル: [examples/css-tokens.md](examples/css-tokens.md#アニメーション)

### 9. ドキュメント作成

`docs/project/design/04-design-system.md` に以下を必須セクションとして記入:

- カラーパレット
- タイポグラフィ
- スペーシング
- コンポーネントスタイル（主要なもの）

### 10. 完了条件の確認

- [ ] `04-design-system.md` が作成されている
- [ ] カラーパレットが定義されている
- [ ] タイポグラフィスケールが定義されている
- [ ] スペーシングシステムが定義されている
- [ ] 主要コンポーネント（ボタン、フォーム）のスタイルが定義されている

### 11. Git への追加（オプション）

```bash
git add docs/project/design/04-design-system.md
git status
```

推奨コミットメッセージ:

```
docs: デザインシステムの定義

- カラーパレット、タイポグラフィ、スペーシングを定義
- 主要コンポーネントのスタイルガイドを追加
```

## 完了条件

- `docs/project/design/04-design-system.md` が作成されている
- カラー・タイポグラフィ・スペーシングが定義されている
- 主要コンポーネントのスタイルが定義されている
- ユーザーが内容を承認している

## エスカレーション

- **ブランドガイドラインなし**: 「ブランドカラーやフォントの指定がありますか？なければ汎用的なパレットを提案します。」
- **CSS フレームワーク未定**: 「`/a-007-define-tech-stack` で技術スタックを先に決定しましょう。」
- **コンポーネントが多すぎる**: 「まずはボタン・フォーム・カードから始め、必要に応じて拡張しましょう。」

## 参考

- [examples/css-tokens.md](examples/css-tokens.md) — カラー/タイポ/スペーシング/アニメーションの CSS サンプル
- [reference/component-catalog.md](reference/component-catalog.md) — コンポーネント・アイコン・アニメーションの標準仕様
