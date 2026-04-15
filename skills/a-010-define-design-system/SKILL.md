---
name: a-010-define-design-system
description: プロジェクトのデザインシステム（カラー、タイポグラフィ、スペーシング、コンポーネントスタイル）を定義するワークフロー
---

# DefineDesignSystem (a-010)

## 目的

- プロジェクト全体で一貫したビジュアルデザインを実現するためのデザインシステムを定義する。
- カラーパレット、タイポグラフィ、スペーシング、コンポーネントスタイルを標準化する。
- デザイナーと開発者が共通言語として使える仕様書を作成する。

## 前提

- `docs/project/design/03-screen-design.md` が作成されていること（画面設計が完了していること）。
- `docs/project/design/01-tech-stack.md` が作成されていること（使用するUIフレームワークが決定していること）。

## 手順

### 1. 既存ドキュメントの確認

- 以下のドキュメントを読み込む：
  - `docs/project/design/01-tech-stack.md` - 使用するCSSフレームワーク（Tailwind, MUI等）
  - `docs/project/design/03-screen-design.md` - 画面設計とレスポンシブポリシー
  - ブランドガイドラインがあれば参照

### 2. テンプレートの準備

- テンプレートをコピーして作業用ファイルを作成する：

  ```bash
  SCRIPT_DIR=$(for d in .agent .cursor .claude .codex; do [ -d "$d" ] && echo "$d" && break; done)
  cp "$SCRIPT_DIR/templates/project/04-design/04-design-system.md" "docs/project/design/04-design-system.md"
  ```

### 3. カラーパレットの定義

- **Primary Colors**: ブランドカラー（1〜2色）
- **Secondary Colors**: アクセントカラー
- **Semantic Colors**: Success, Warning, Error, Info
- **Neutral Colors**: グレースケール（背景、テキスト、ボーダー）
- **Dark Mode対応**: 必要に応じてダークテーマのカラーも定義

#### 出力例

```css
:root {
  /* Primary */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #0ea5e9;

  /* Neutral */
  --color-gray-50: #f9fafb;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
}
```

### 4. タイポグラフィの定義

- **フォントファミリー**: 見出し用、本文用、コード用
- **フォントサイズスケール**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **行間（Line Height）**: tight, normal, relaxed
- **フォントウェイト**: normal, medium, semibold, bold

#### 出力例

```css
:root {
  /* Font Family */
  --font-sans: "Inter", "Noto Sans JP", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Font Size */
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
}
```

### 5. スペーシングシステムの定義

- **基本単位**: 4px または 8px ベース
- **スケール**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
- **用途**: margin, padding, gap

#### 出力例

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
}
```

### 6. コンポーネントスタイルの定義

以下のコンポーネントについて、バリアント（種類）とステート（状態）を定義する：

#### 6.1 ボタン

- **バリアント**: Primary, Secondary, Outline, Ghost, Danger
- **サイズ**: sm, md, lg
- **ステート**: Default, Hover, Active, Disabled, Loading

#### 6.2 フォーム要素

- Input, Textarea, Select, Checkbox, Radio
- **ステート**: Default, Focus, Error, Disabled

#### 6.3 カード / コンテナ

- 角丸（border-radius）、シャドウ、パディング

#### 6.4 その他

- Badge, Tag, Avatar, Tooltip, Modal

### 7. アイコン・イラストガイドライン

- **アイコンライブラリ**: Lucide, Heroicons, Material Icons など
- **サイズ規定**: sm(16px), md(20px), lg(24px), xl(32px)
- **スタイル**: Outline / Filled の統一

### 8. アニメーション・トランジション

- **Duration**: fast(150ms), normal(300ms), slow(500ms)
- **Easing**: ease-in-out をデフォルトに
- **使用箇所**: hover, focus, モーダル開閉, ページ遷移

#### 出力例

```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

### 9. ドキュメント作成

- `docs/project/design/04-design-system.md` を作成する。
- **必須セクション**:
  - カラーパレット
  - タイポグラフィ
  - スペーシング
  - コンポーネントスタイル（主要なもの）

### 10. 完了条件の確認

- 以下のチェックリストで確認：
  - [ ] `docs/project/design/04-design-system.md` が作成されている
  - [ ] カラーパレットが定義されている
  - [ ] タイポグラフィスケールが定義されている
  - [ ] スペーシングシステムが定義されている
  - [ ] 主要コンポーネント（ボタン、フォーム）のスタイルが定義されている

### 11. Git への追加（オプション）

- ユーザーに確認：「作成したデザインシステムドキュメントを Git に追加しますか？」
- 「はい」の場合：

  ```bash
  git add docs/project/design/04-design-system.md
  git status
  ```

- 推奨コミットメッセージ：

  ```
  docs: デザインシステムの定義

  - カラーパレット、タイポグラフィ、スペーシングを定義
  - 主要コンポーネントのスタイルガイドを追加
  ```

## 完了条件

- `docs/project/design/04-design-system.md` が作成されている。
- カラーパレット、タイポグラフィ、スペーシングが定義されている。
- 主要コンポーネントのスタイルが定義されている。
- ユーザーが内容を承認している。

## エスカレーション

- ブランドガイドラインが存在しない場合：
  - 「ブランドカラーやフォントの指定がありますか？なければ汎用的なパレットを提案します。」と確認する。
- 使用するCSSフレームワークが未定の場合：
  - 「TailwindやMUIなど、使用するフレームワークが決まっていると、そのデザイントークンに合わせた定義ができます。`DefineTechStack` (a-007) で技術スタックを決定しましょう。」と提案する。
- コンポーネントが多すぎる場合：
  - 「まずは主要なコンポーネント（ボタン、フォーム、カード）から始めて、必要に応じて拡張しましょう。」と提案する。
