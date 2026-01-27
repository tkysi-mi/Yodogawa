# デザインシステム

> 最終更新: YYYY-MM-DD

## 概要

このドキュメントでは、プロジェクト全体で使用するデザインシステムを定義します。

---

## カラーパレット

### Primary Colors

| 名前        | HEX       | 用途           |
| ----------- | --------- | -------------- |
| primary-50  | `#eff6ff` | 背景（薄）     |
| primary-100 | `#dbeafe` | ホバー状態     |
| primary-500 | `#3b82f6` | メインカラー   |
| primary-600 | `#2563eb` | ホバー（濃）   |
| primary-900 | `#1e3a8a` | テキスト（濃） |

### Secondary Colors

| 名前          | HEX       | 用途       |
| ------------- | --------- | ---------- |
| secondary-500 | `#8b5cf6` | アクセント |

### Semantic Colors

| 名前    | HEX       | 用途         |
| ------- | --------- | ------------ |
| success | `#22c55e` | 成功、完了   |
| warning | `#f59e0b` | 警告、注意   |
| error   | `#ef4444` | エラー、削除 |
| info    | `#0ea5e9` | 情報、ヘルプ |

### Neutral Colors

| 名前     | HEX       | 用途             |
| -------- | --------- | ---------------- |
| gray-50  | `#f9fafb` | 背景（明）       |
| gray-100 | `#f3f4f6` | カード背景       |
| gray-200 | `#e5e7eb` | ボーダー         |
| gray-400 | `#9ca3af` | プレースホルダー |
| gray-500 | `#6b7280` | サブテキスト     |
| gray-700 | `#374151` | 本文テキスト     |
| gray-900 | `#111827` | 見出しテキスト   |

### Dark Mode（必要な場合）

<!-- Dark Mode用のカラー定義 -->

---

## タイポグラフィ

### フォントファミリー

| 用途   | フォント                      |
| ------ | ----------------------------- |
| 見出し | `Inter`, `Noto Sans JP`       |
| 本文   | `Inter`, `Noto Sans JP`       |
| コード | `JetBrains Mono`, `monospace` |

### フォントサイズ

| 名前 | サイズ | 行間 | 用途             |
| ---- | ------ | ---- | ---------------- |
| xs   | 12px   | 1.5  | キャプション     |
| sm   | 14px   | 1.5  | 補足テキスト     |
| base | 16px   | 1.5  | 本文             |
| lg   | 18px   | 1.5  | リード文         |
| xl   | 20px   | 1.4  | 小見出し         |
| 2xl  | 24px   | 1.3  | セクション見出し |
| 3xl  | 30px   | 1.2  | ページタイトル   |
| 4xl  | 36px   | 1.1  | ヒーロー見出し   |

### フォントウェイト

| 名前     | 値  | 用途         |
| -------- | --- | ------------ |
| normal   | 400 | 本文         |
| medium   | 500 | 強調         |
| semibold | 600 | 見出し       |
| bold     | 700 | 重要な見出し |

---

## スペーシング

### スケール（4px ベース）

| 名前 | 値      | ピクセル |
| ---- | ------- | -------- |
| 0    | 0       | 0px      |
| 1    | 0.25rem | 4px      |
| 2    | 0.5rem  | 8px      |
| 3    | 0.75rem | 12px     |
| 4    | 1rem    | 16px     |
| 5    | 1.25rem | 20px     |
| 6    | 1.5rem  | 24px     |
| 8    | 2rem    | 32px     |
| 10   | 2.5rem  | 40px     |
| 12   | 3rem    | 48px     |
| 16   | 4rem    | 64px     |

### 使用ガイドライン

- **コンポーネント内部**: 2〜4 (8〜16px)
- **セクション間**: 8〜12 (32〜48px)
- **ページ余白**: 4〜6 (16〜24px)

---

## コンポーネントスタイル

### ボタン

#### バリアント

| バリアント | 背景        | テキスト    | 用途               |
| ---------- | ----------- | ----------- | ------------------ |
| Primary    | primary-500 | white       | 主要アクション     |
| Secondary  | gray-100    | gray-700    | 副次アクション     |
| Outline    | transparent | primary-500 | 代替アクション     |
| Ghost      | transparent | gray-700    | 控えめなアクション |
| Danger     | error       | white       | 削除、危険操作     |

#### サイズ

| サイズ | パディング | フォント |
| ------ | ---------- | -------- |
| sm     | 8px 12px   | 14px     |
| md     | 10px 16px  | 16px     |
| lg     | 12px 20px  | 18px     |

#### ステート

- **Default**: 通常状態
- **Hover**: 明度を10%変更
- **Active**: 明度を20%変更
- **Disabled**: opacity: 0.5, cursor: not-allowed
- **Loading**: スピナー表示

### フォーム要素

#### Input

| プロパティ | 値                 |
| ---------- | ------------------ |
| 高さ       | 40px (md)          |
| ボーダー   | 1px solid gray-200 |
| 角丸       | 6px                |
| Focus      | ring-2 primary-500 |
| Error      | border-error       |

#### その他

- **Textarea**: Inputと同様、min-height: 100px
- **Select**: Inputと同様 + ドロップダウンアイコン
- **Checkbox/Radio**: 20px × 20px

### カード

| プロパティ | 値                        |
| ---------- | ------------------------- |
| 背景       | white                     |
| ボーダー   | 1px solid gray-200        |
| 角丸       | 8px                       |
| シャドウ   | 0 1px 3px rgba(0,0,0,0.1) |
| パディング | 16px〜24px                |

---

## アイコン

### ライブラリ

- **推奨**: Lucide Icons / Heroicons

### サイズ

| 名前 | サイズ | 用途           |
| ---- | ------ | -------------- |
| sm   | 16px   | インライン     |
| md   | 20px   | ボタン内       |
| lg   | 24px   | 単独表示       |
| xl   | 32px   | 特徴セクション |

### スタイル

- **統一**: Outline または Solid（混在させない）

---

## アニメーション

### Duration

| 名前   | 値    | 用途               |
| ------ | ----- | ------------------ |
| fast   | 150ms | ホバー、フォーカス |
| normal | 300ms | パネル開閉         |
| slow   | 500ms | ページ遷移         |

### Easing

- **デフォルト**: `ease-in-out`
- **入場**: `ease-out`
- **退場**: `ease-in`

### 使用例

```css
.button {
  transition: background-color 150ms ease-in-out;
}

.modal {
  transition:
    opacity 300ms ease-out,
    transform 300ms ease-out;
}
```

---

## CSS変数（参考実装）

```css
:root {
  /* Colors */
  --color-primary-500: #3b82f6;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-sans: "Inter", "Noto Sans JP", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
}
```

---

## 変更履歴

| バージョン | 日付       | 変更内容 |
| ---------- | ---------- | -------- |
| 1.0        | YYYY-MM-DD | 初版作成 |
