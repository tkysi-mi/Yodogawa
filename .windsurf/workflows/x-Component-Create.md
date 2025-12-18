---
description: UIコンポーネントをボイラープレート、型定義、ストーリー、テストと共に生成するワークフロー
auto_execution_mode: 1
---

# Component-Create (x-Component-Create)

## 目的

- UI コンポーネントを素早く作成し、開発効率を向上させる。
- Props/型定義、ストーリー/プレビュー、テストファイルを一括で生成する。
- プロジェクトの命名規則とディレクトリ構造に従ったコンポーネントを作成する。
- 設計パターン（Atomic Design, Feature-Sliced Design等）に対応する。

## 前提

- UI フレームワークがセットアップされている（React, Vue, Svelte, Solid等）。
- 型システムが使用されている（TypeScript推奨）。
- コンポーネントストーリー/プレビューツールがセットアップされている（Storybook, Histoire等、オプション）。
- テストフレームワークがセットアップされている（Jest, Vitest, Testing Library等、オプション）。
- プロジェクトの命名規則とディレクトリ構造が決まっている。

## 手順

### 1. コンポーネント設計の決定

**コンポーネントの種類**:

- **プレゼンテーショナル**: UI表示のみ、ロジックなし
- **コンテナ**: データ取得やステート管理を含む
- **レイアウト**: ページ構造を定義
- **ユーティリティ**: 再利用可能な小さなコンポーネント

**設計パターン**:

- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Feature-Sliced Design**: features/{feature}/ui/
- **Flat Structure**: components/
- **Domain-Driven**: domains/{domain}/components/

**命名規則**:

- PascalCase（例: `UserCard`, `NavigationBar`）
- 明確で説明的な名前
- 単数形または複数形を適切に使い分け

### 2. ディレクトリ構造の決定

**一般的なパターン**:

**単一ファイル**:

```
src/components/Button.tsx
```

**コロケーション**（推奨）:

```
src/components/Button/
├── Button.tsx              # メインコンポーネント
├── Button.module.css       # スタイル
├── Button.stories.tsx      # ストーリー/プレビュー
├── Button.test.tsx         # テスト
└── index.ts                # エクスポート
```

**複雑なコンポーネント**:

```
src/components/UserCard/
├── UserCard.tsx
├── UserCard.module.css
├── UserCard.stories.tsx
├── UserCard.test.tsx
├── components/             # サブコンポーネント
│   ├── Avatar.tsx
│   └── UserInfo.tsx
├── hooks/                  # カスタムフック
│   └── useUserData.ts
└── index.ts
```

### 3. コンポーネントファイルの作成

**基本構造**:

1. **インポート**: 必要な依存関係
2. **型定義**: Props の interface/type
3. **コンポーネント本体**: JSX/テンプレート
4. **エクスポート**: デフォルトまたは名前付き

**Props 設計のチェックリスト**:

- [ ] 必須プロパティと任意プロパティを明確に区別
- [ ] デフォルト値を適切に設定
- [ ] 型定義にドキュメントコメントを追加
- [ ] イベントハンドラの命名を統一（onClick, onSubmit等）
- [ ] children または slot の使用を検討
- [ ] as/component prop でポリモーフィズムを実現（必要に応じて）

**アクセシビリティチェックリスト**:

- [ ] セマンティックHTML要素を使用（button, nav, main等）
- [ ] ARIA属性を適切に設定
- [ ] キーボードナビゲーションをサポート
- [ ] フォーカス管理を実装
- [ ] スクリーンリーダー対応のラベルを追加

### 4. スタイリングの実装

**スタイリング手法の選択**:

- **CSS Modules**: スコープ付きCSS、設定不要
- **CSS-in-JS**: styled-components, Emotion, Vanilla Extract
- **Utility-First**: Tailwind CSS, UnoCSS
- **CSS Preprocessor**: Sass, Less
- **CSS Framework**: Bootstrap, Chakra UI, Material UI

**レスポンシブデザイン**:

- モバイルファースト設計
- ブレークポイントの定義
- フレキシブルレイアウト（Flexbox, Grid）

### 5. ストーリー/プレビューの作成

**目的**:

- コンポーネントの全バリエーションを可視化
- 開発中の動作確認
- デザインレビュー
- ドキュメント生成

**作成すべきストーリー**:

- **デフォルト**: 基本的な使用例
- **バリエーション**: すべての props の組み合わせ
- **状態**: loading, error, empty等
- **エッジケース**: 長いテキスト、空データ等

**ストーリーの構造**:

```typescript
// 例: Storybook形式
export default {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};

export const Primary = {
  args: { label: 'Button', variant: 'primary' },
};

export const Secondary = {
  args: { label: 'Button', variant: 'secondary' },
};
```

### 6. テストの作成

**テスト戦略**:

- **ユニットテスト**: コンポーネントの動作を検証
- **スナップショットテスト**: UI の変更を検出
- **インタラクションテスト**: ユーザー操作をシミュレート
- **アクセシビリティテスト**: a11y 準拠を確認

**テストケースの例**:

```typescript
describe('Button', () => {
  // レンダリングテスト
  it('renders with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // インタラクションテスト
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 状態テスト
  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} disabled />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // バリエーションテスト
  it('applies variant class', () => {
    const { rerender } = render(<Button label="Button" variant="primary" />);
    expect(screen.getByText('Button')).toHaveClass('primary');
  });

  // アクセシビリティテスト
  it('has no accessibility violations', async () => {
    const { container } = render(<Button label="Click me" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 7. Index ファイルの作成

**エクスポートパターン**:

```typescript
// Named export（推奨）
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Re-export with types
export { Button, type ButtonProps } from './Button';

// Default export
export { default } from './Button';
```

### 8. ドキュメント化

**JSDocコメントの追加**:

```typescript
/**
 * ボタンコンポーネント
 *
 * @example
 * ```tsx
 * <Button label="Click me" variant="primary" onClick={handleClick} />
 * ```
 */
export interface ButtonProps {
  /** ボタンのラベル */
  label: string;
  /** ボタンのバリエーション @default 'primary' */
  variant?: 'primary' | 'secondary' | 'danger';
  /** クリックイベントハンドラ */
  onClick?: () => void;
}
```

**README または Storybook Docs**:

- 使用例
- Props の説明
- アクセシビリティガイドライン
- カスタマイズ方法

### 9. 動作確認

**確認項目**:

- [ ] コンポーネントが正しくレンダリングされる
- [ ] すべての props が機能する
- [ ] イベントハンドラが正しく動作する
- [ ] スタイルが適用されている
- [ ] レスポンシブデザインが機能する
- [ ] アクセシビリティ要件を満たしている
- [ ] テストがすべて通る

**ストーリー/プレビューツールでの確認**:

```bash
# Storybook
npm run storybook

# Histoire (Vite)
npm run story:dev
```

**テストの実行**:

```bash
npm test Button
# または
npm test -- Button.test.tsx
```

### 10. Git コミット

```bash
git add src/components/Button/

git commit -m "feat: add Button component

- Add Button component with variants (primary, secondary, danger)
- Add size options (small, medium, large)
- Add component stories/preview
- Add unit tests with testing library
- Support accessibility features (ARIA, keyboard navigation)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 完了条件

- コンポーネントファイルが作成されている
- Props 型定義が記述されている
- スタイルが実装されている
- ストーリー/プレビューが作成されている（使用している場合）
- テストファイルが作成され、テストが通る
- Index ファイルでエクスポートされている
- アクセシビリティ要件を満たしている
- ドキュメントが記述されている

## エスカレーション

- **命名規則の不一致**:
  - プロジェクトの命名規則を確認
  - チーム内で合意を取る
  - ESLint ルールで強制

- **ディレクトリ構造の不一致**:
  - プロジェクトのアーキテクチャパターンを確認
  - 既存コンポーネントと整合性を取る

- **テストが失敗する**:
  - import パスを確認
  - テストライブラリのバージョンを確認
  - Mock が必要な依存関係を確認

- **ストーリー/プレビューが表示されない**:
  - 設定ファイルを確認
  - import パスを確認
  - エクスポートを確認

## ベストプラクティス

- **Props の型定義**: すべての Props に型と説明を追加
- **デフォルト値**: Props にデフォルト値を設定
- **アクセシビリティ**: ARIA 属性を適切に設定
- **テストカバレッジ**: Props のすべてのバリエーションをテスト
- **ストーリー/プレビュー**: すべてのバリエーションを可視化
- **再利用性**: 汎用的で再利用可能なコンポーネントを設計
- **ドキュメント**: JSDoc コメントで使用方法を記載
- **命名**: 説明的で一貫性のある命名
- **分離**: プレゼンテーショナルとコンテナを分離
- **パフォーマンス**: メモ化を適切に使用

## 参考: 技術スタック別のパターン

**UI フレームワーク**:

- React, Preact
- Vue 3, Nuxt 3
- Svelte, SvelteKit
- Solid.js, Qwik
- Angular, Lit

**スタイリング**:

- CSS Modules
- styled-components, Emotion
- Tailwind CSS, UnoCSS
- Vanilla Extract, Panda CSS
- Sass, Less, PostCSS

**ストーリー/プレビュー**:

- Storybook
- Histoire (Vite)
- Ladle
- Component Story Format (CSF)

**テスティング**:

- Jest, Vitest
- React Testing Library, Vue Testing Library
- Playwright, Cypress
- jest-axe (アクセシビリティ)
