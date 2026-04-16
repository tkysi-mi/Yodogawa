# コンポーネント・アイコン・アニメーションのカタログ

SKILL.md 手順6〜8で参照するコンポーネント/アイコン/アニメーションの標準仕様。

## コンポーネントスタイル

### ボタン

- **バリアント**: Primary, Secondary, Outline, Ghost, Danger
- **サイズ**: sm, md, lg
- **ステート**: Default, Hover, Active, Disabled, Loading

### フォーム要素

- **種類**: Input, Textarea, Select, Checkbox, Radio
- **ステート**: Default, Focus, Error, Disabled

### カード / コンテナ

- 角丸（border-radius）
- シャドウ（elevation 3段階程度）
- パディング（内側余白）

### その他

- Badge, Tag, Avatar, Tooltip, Modal

## アイコンガイドライン

- **ライブラリ候補**: Lucide, Heroicons, Material Icons
- **サイズ規定**: sm(16px), md(20px), lg(24px), xl(32px)
- **スタイル**: Outline / Filled の統一（混在させない）

## アニメーション・トランジション

- **Duration**: fast(150ms), normal(300ms), slow(500ms)
- **Easing**: ease-in-out をデフォルトに
- **使用箇所**: hover, focus, モーダル開閉, ページ遷移

## スペーシングの設計方針

- **基本単位**: 4px または 8px ベース
- **スケール**: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
- **用途**: margin, padding, gap
