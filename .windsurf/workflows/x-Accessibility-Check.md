---
description: Webアクセシビリティを監査し、WCAG準拠とスクリーンリーダー対応を確認するワークフロー
auto_execution_mode: 1
---

# Accessibility-Check (x-Accessibility-Check)

## 目的

- Web アクセシビリティ（a11y）の問題を検出し、修正する。
- WCAG 2.1 レベル AA 準拠を確認する。
- スクリーンリーダーでの使用体験を改善する。
- キーボードナビゲーションを確保する。
- 色のコントラスト比を適切に設定する。

## 前提

- Web アプリケーションが開発サーバーまたはステージング環境で動作している。
- Chrome または Firefox ブラウザが利用可能。
- axe DevTools または Lighthouse が利用可能。

## 手順

### 1. 自動アクセシビリティテストの実行

#### 1.1. axe DevTools のインストール

**Chrome 拡張機能**:

- Chrome Web Store で "axe DevTools" を検索してインストール
- または: <https://chrome.google.com/webstore/detail/axe-devtools-web-accessibility-testing/lhdoppojpmngadmnindnejefpokejbdd>

**Firefox アドオン**:

- <https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/>

#### 1.2. axe DevTools の実行

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで対象ページを開く
3. DevTools を開く（F12）
4. "axe DevTools" タブを選択
5. "Scan ALL of my page" をクリック

**質問1: 検出された問題**

- 「どのような問題が検出されましたか？」
- 重要度：
  - **Critical**: 即座に修正が必要
  - **Serious**: 優先度高
  - **Moderate**: 優先度中
  - **Minor**: 優先度低

#### 1.3. Lighthouse の実行

```bash
npx lighthouse https://localhost:3000 --view --only-categories=accessibility
```

**スコア目標**:

- **90-100**: 優秀
- **80-89**: 良好
- **<80**: 改善が必要

### 2. よくあるアクセシビリティ問題と修正方法

#### 2.1. 画像の代替テキスト不足

**問題**: `<img>` タグに `alt` 属性がない

**修正前**:

```html
<img src="/logo.png" />
```

**修正後**:

```html
<img src="/logo.png" alt="Company Logo" />

<!-- 装飾的な画像の場合は空文字列 -->
<img src="/decoration.png" alt="" />
```

#### 2.2. フォーム要素のラベル不足

**問題**: `<input>` に対応する `<label>` がない

**修正前**:

```html
<input type="email" placeholder="Email" />
```

**修正後**:

```html
<label htmlFor="email">Email</label>
<input id="email" type="email" placeholder="Enter your email" />

<!-- または暗黙的な関連付け -->
<label>
  Email
  <input type="email" placeholder="Enter your email" />
</label>
```

#### 2.3. 色のコントラスト不足

**問題**: テキストと背景のコントラスト比が 4.5:1 未満

**チェックツール**:

- <https://webaim.org/resources/contrastchecker/>
- Chrome DevTools の Color Picker

**修正前**:

```css
.text {
  color: #999; /* グレー */
  background-color: #fff; /* 白 */
  /* コントラスト比: 2.8:1 (不十分) */
}
```

**修正後**:

```css
.text {
  color: #666; /* ダークグレー */
  background-color: #fff; /* 白 */
  /* コントラスト比: 5.7:1 (良好) */
}
```

#### 2.4. ボタンのアクセシブルな名前不足

**問題**: ボタンにテキストやラベルがない

**修正前**:

```html
<button><Icon /></button>
```

**修正後**:

```html
<!-- 方法1: aria-label -->
<button aria-label="Close dialog"><CloseIcon /></button>

<!-- 方法2: スクリーンリーダー専用テキスト -->
<button>
  <CloseIcon />
  <span className="sr-only">Close dialog</span>
</button>
```

**CSS for sr-only**:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### 2.5. 見出しレベルのスキップ

**問題**: h1 → h3 のように見出しレベルをスキップ

**修正前**:

```html
<h1>Page Title</h1>
<h3>Subsection</h3>
```

**修正後**:

```html
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

#### 2.6. リンクのアクセシブルな名前不足

**問題**: "Click here" や "Read more" などの曖昧なリンクテキスト

**修正前**:

```html
<a href="/article">Read more</a>
```

**修正後**:

```html
<!-- 方法1: 説明的なリンクテキスト -->
<a href="/article">Read more about accessibility best practices</a>

<!-- 方法2: aria-label -->
<a href="/article" aria-label="Read more about accessibility best practices">
  Read more
</a>

<!-- 方法3: スクリーンリーダー専用テキスト -->
<a href="/article">
  Read more
  <span className="sr-only">about accessibility best practices</span>
</a>
```

### 3. キーボードナビゲーションのテスト

**質問2: キーボードナビゲーション**

- 「キーボードのみですべての機能にアクセスできますか？」

**テスト手順**:

1. Tab キーで全要素を順番に移動できるか
2. Shift+Tab で逆順に移動できるか
3. Enter または Space キーでボタンを実行できるか
4. Esc キーでモーダルを閉じられるか
5. 矢印キーでドロップダウンやタブを操作できるか

**フォーカスの可視化**:

```css
/* フォーカスリングを明確にする */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* outline: none は使わない！ */
```

**フォーカストラップ（モーダル）**:

```typescript
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // フォーカス可能な要素を取得
    const focusableElements = modalRef.current?.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    // 最初の要素にフォーカス
    firstElement?.focus();

    // Tab キーのトラップ
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift+Tab: 最後の要素から最初へ
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: 最初の要素から最後へ
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Esc キーで閉じる
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### 4. ARIA 属性の適切な使用

#### 4.1. ランドマークロール

```html
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- ナビゲーション -->
  </nav>
</header>

<main role="main">
  <!-- メインコンテンツ -->
</main>

<aside role="complementary">
  <!-- サイドバー -->
</aside>

<footer role="contentinfo">
  <!-- フッター -->
</footer>
```

#### 4.2. ライブリージョン

```html
<!-- 成功メッセージ（polite: 現在の読み上げが終わってから） -->
<div role="status" aria-live="polite">
  Changes saved successfully
</div>

<!-- エラーメッセージ（assertive: 即座に割り込んで読み上げ） -->
<div role="alert" aria-live="assertive">
  Error: Please fix the following issues
</div>
```

#### 4.3. 展開可能な要素

```html
<button
  aria-expanded="false"
  aria-controls="details-panel"
  onClick={() => setExpanded(!expanded)}
>
  {expanded ? 'Hide' : 'Show'} Details
</button>

<div id="details-panel" hidden={!expanded}>
  <!-- 詳細コンテンツ -->
</div>
```

### 5. スクリーンリーダーでのテスト

**質問3: スクリーンリーダーテスト**

- 「スクリーンリーダーでテストしますか？」

**スクリーンリーダー**:

- **Windows**: NVDA (無料) または JAWS
- **Mac**: VoiceOver (内蔵)
- **Linux**: Orca

**VoiceOver の起動** (Mac):

```
Cmd + F5
```

**基本的なテスト**:

1. ページ全体を読み上げさせる
2. 見出しのみをナビゲート
3. リンクのみをナビゲート
4. フォームを入力
5. ボタンを操作

### 6. 自動テストの追加

**Jest + jest-axe**:

```bash
npm install --save-dev jest-axe
```

```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button label="Click me" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Playwright + axe-playwright**:

```bash
npm install --save-dev @axe-core/playwright
```

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 7. Git コミット

```bash
git add .
git commit -m "a11y: improve accessibility

- Add alt text to all images
- Add labels to form inputs
- Improve color contrast (4.5:1 minimum)
- Add aria-labels to icon buttons
- Implement keyboard navigation for modal
- Add automated accessibility tests

Lighthouse accessibility score: 75 → 95

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com)"
```

## 完了条件

- axe DevTools でエラーが 0 件
- Lighthouse アクセシビリティスコアが 90 以上
- キーボードのみですべての機能にアクセス可能
- スクリーンリーダーで適切に読み上げられる
- 色のコントラスト比が 4.5:1 以上
- 自動テストが追加されている

## エスカレーション

- **Critical 問題が多数**:
  - 「Critical 問題を優先的に修正してください。」
  - 画像の alt 属性、フォームラベル、ボタンラベルを確認

- **コントラスト比が改善できない**:
  - 「デザインチームと相談してカラーパレットを見直してください。」

- **キーボードナビゲーションが複雑**:
  - 「フォーカス管理ライブラリ（react-focus-lock, focus-trap）の使用を検討してください。」

## ベストプラクティス

- **セマンティック HTML**: `<div>` の代わりに `<button>`, `<nav>`, `<main>` を使用
- **ARIA は最後の手段**: HTML だけで解決できる場合は ARIA を使わない
- **継続的な監視**: CI で自動テストを実行
- **早期対応**: 設計段階からアクセシビリティを考慮
- **実際のユーザーテスト**: 障害を持つユーザーにテストしてもらう
