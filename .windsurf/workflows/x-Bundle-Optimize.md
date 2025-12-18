---
description: ビルド成果物のサイズを分析し、コード分割・遅延ロード・Tree Shakingで最適化するワークフロー
auto_execution_mode: 1
---

# Bundle-Optimize (x-Bundle-Optimize)

## 目的

- ビルド成果物のサイズを分析し、ページロード時間を改善する。
- 不要な依存関係を特定し、削除または軽量な代替に置き換える。
- コード分割と遅延ロードを実装し、初回ロード時間を短縮する。
- Tree Shaking を活用し、未使用コードを削減する。
- Core Web Vitals（LCP, FID, CLS）を改善する。

## 前提

- ビルドツールが設定されている（任意のバンドラー/ビルドツール）。
- 本番ビルドが可能である。
- パフォーマンス測定ツールが利用可能である（ブラウザ DevTools, Lighthouse等）。
- Git リポジトリが初期化されている。

## 手順

### 1. 現在のビルドサイズの測定

**ベースライン測定**:

本番ビルドを実行してサイズを確認:

```bash
# ビルドコマンド例
npm run build
# または
yarn build
# または
<build-command>
```

**ビルド出力の確認**:

- メインバンドル/チャンクのサイズ
- CSS ファイルのサイズ
- アセット（画像、フォント等）のサイズ
- 圧縮後のサイズ（gzip, brotli）

**サイズの目安**:

- **< 100 KB** (gzipped): 優秀
- **100-200 KB**: 良好
- **200-500 KB**: 改善の余地あり
- **> 500 KB**: 最適化が必要

### 2. バンドル/ビルド分析

**分析ツールの選択と実行**:

**バンドル可視化ツール**:

- webpack-bundle-analyzer (Webpack)
- rollup-plugin-visualizer (Rollup/Vite)
- next-bundle-analyzer (Next.js)
- source-map-explorer (汎用)
- bundle-buddy (汎用)

**分析の実施**:

```bash
# ビルドツールに応じたアナライザーを実行
<build-command> --analyze
# または
<analyzer-command>
```

**分析すべき項目**:

- [ ] 最も大きいパッケージ/モジュール
- [ ] 重複しているパッケージ
- [ ] 未使用または不要なコード
- [ ] サードパーティライブラリのサイズ
- [ ] アプリケーションコードとベンダーコードの比率

### 3. 問題のあるパッケージの特定

**よくある問題パッケージと代替案**:

**日付ライブラリ**:

- 問題: moment.js (500KB+)
- 代替: date-fns, day.js, Temporal API (ネイティブ)

**ユーティリティライブラリ**:

- 問題: lodash (全体インポート)
- 代替: 個別関数インポート、ネイティブJSメソッド

**ポリフィル**:

- 問題: core-js (古いポリフィル)
- 代替: 必要なもののみインポート、ターゲットブラウザに応じた選択

**パッケージサイズの確認方法**:

```bash
# bundlephobia CLI
npx bundlephobia <package-name>

# または https://bundlephobia.com でWeb検索
```

### 4. 依存関係の最適化

**軽量化の戦略**:

**1. 大きいパッケージの置き換え**:

- サイズの小さい代替ライブラリに置き換え
- ネイティブAPI で代替可能か検討
- 必要な機能のみを提供する最小限のライブラリを選択

**2. Tree Shaking の有効化**:

- ES Modules (ESM) を使用
- 副作用のないモジュールを明示
- Dead Code Elimination の設定確認

**3. 個別インポートの使用**:

```javascript
// 避ける: 全体インポート
import _ from 'lodash';

// 推奨: 個別インポート
import debounce from 'lodash/debounce';
// または
import { debounce } from 'lodash-es';
```

**4. 未使用パッケージの削除**:

```bash
# 未使用パッケージの検出
npx depcheck

# 削除
npm uninstall <unused-package>
```

**5. 重複パッケージの統一**:

```bash
# 重複確認
npm ls <package-name>

# package.json で解決（npm 8.3+）
{
  "overrides": {
    "package-name": "^1.2.3"
  }
}
```

### 5. コード分割の実装

**コード分割の戦略**:

**1. ルートベース分割**:

- ページ/ルートごとにコードを分割
- 動的インポートを使用
- 初回ロードに不要なコードを遅延ロード

**2. 機能ベース分割**:

- 重いライブラリを遅延ロード
- 条件付きで使用される機能を分割
- ユーザーインタラクション後にロード

**3. ベンダー/サードパーティ分割**:

- アプリケーションコードとライブラリを分離
- 頻繁に変更されないコードを別チャンクに

**動的インポートの例**:

```javascript
// 遅延ロード
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 条件付きロード
if (userNeedsChart) {
  const ChartLibrary = await import('chart-library');
  ChartLibrary.renderChart(data);
}
```

### 6. Tree Shaking の最適化

**Tree Shaking が機能する条件**:

**1. ES Modules を使用**:

- import/export 構文を使用
- CommonJS (require) ではなくESMを使用

**2. 副作用の明示**:

```json
// package.json
{
  "sideEffects": false
}

// または特定ファイルのみ
{
  "sideEffects": ["*.css", "*.scss", "polyfills.js"]
}
```

**3. ビルドツールの設定**:

- Production モードでビルド
- Minification を有効化
- Dead Code Elimination を有効化

### 7. アセットの最適化

**画像最適化**:

- 適切な形式を使用（WebP, AVIF）
- 適切なサイズにリサイズ
- 遅延ロード（Lazy Loading）
- CDN の使用
- スプライトシートまたはアイコンフォント

**フォント最適化**:

- サブセット化（必要な文字のみ）
- WOFF2 形式を優先
- font-display: swap を使用
- preload で重要なフォントを先読み

**その他のアセット**:

- SVG の最適化（SVGO）
- JSON の圧縮
- 不要なメタデータの削除

### 8. パフォーマンス測定

**測定ツール**:

**ブラウザ DevTools**:

- Network タブでリソースサイズ確認
- Performance タブでロード時間確認
- Coverage タブで未使用コード確認

**Lighthouse**:

```bash
npx lighthouse <url> --view
```

**Core Web Vitals の目標値**:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Total Blocking Time**: < 200ms

**バンドルサイズ予算の設定**:

- ビルドツールに size budget を設定
- CI/CD で自動チェック
- 閾値を超えた場合はビルドを失敗させる

### 9. 最適化結果の検証

**再ビルドと比較**:

```bash
# 最適化後のビルド
npm run build

# サイズ比較
# Before: 500KB → After: 200KB (-60%)
```

**検証項目**:

- [ ] ビルドサイズが削減された
- [ ] ページロード時間が改善された
- [ ] Core Web Vitals が改善された
- [ ] アプリケーションが正常に動作する
- [ ] エラーが発生していない

**削減目標**:

- **10-20%**: 良好
- **20-50%**: 優秀
- **50%+**: 大幅改善

### 10. 継続的な監視

**モニタリングの設定**:

- バンドルサイズの推移をトラッキング
- CI/CD でサイズチェックを自動化
- パフォーマンス予算を設定
- 定期的なレビューを実施

**自動化の例**:

```json
// package.json
{
  "scripts": {
    "build": "...",
    "analyze": "...",
    "size-check": "bundlesize"
  }
}
```

### 11. Git コミット

```bash
git add .

git commit -m "perf: optimize build size

- Replace heavy library with lightweight alternative (saved 400KB)
- Implement route-based code splitting
- Enable tree shaking for utility libraries
- Remove unused dependencies
- Optimize images and assets
- Build size reduced from 500KB to 200KB (-60%)

Metrics:
- LCP: 4.2s → 2.1s
- FID: 150ms → 80ms
- Bundle size: 500KB → 200KB

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com)"
```

## 完了条件

- ビルドサイズが測定されている
- バンドル分析で問題が特定されている
- 不要な依存関係が削除されている
- コード分割が実装されている
- Tree Shaking が有効化されている
- 最適化後のビルドが成功している
- ビルドサイズが削減されている（目標10%以上）
- パフォーマンス測定で改善が確認されている

## エスカレーション

- **ビルドサイズが削減できない**:
  - 大きいパッケージの代替案を再検討
  - 未使用コードの徹底的な削除
  - 動的インポートの追加実装
  - アセットの最適化を強化

- **コード分割でエラーが発生**:
  - ローディング状態の適切な処理
  - エラーバウンダリの実装
  - チャンクロード失敗時のフォールバック

- **Tree Shaking が機能しない**:
  - ES Modules を使用しているか確認
  - package.json の "sideEffects" を設定
  - ビルドツールの設定を確認

- **パフォーマンスが改善しない**:
  - ネットワークのボトルネックを確認
  - サーバーサイドのパフォーマンスを確認
  - キャッシュ戦略を見直す

## ベストプラクティス

- **継続的な監視**: Lighthouse CI で定期的に測定
- **予算設定**: ビルドサイズの上限を設定
- **段階的な最適化**: 小さな改善を積み重ねる
- **プログレッシブエンハンスメント**: 必要な機能から順にロード
- **CDN 活用**: 静的アセットは CDN から配信
- **圧縮**: Gzip または Brotli 圧縮を有効化
- **キャッシュ戦略**: 長期キャッシュを活用
- **差分ビルド**: 変更されたファイルのみ再ビルド
- **並列処理**: ビルドプロセスを並列化

## 参考: ツール別のパターン

**ビルドツール**:

- Webpack, Rollup, esbuild
- Vite, Turbopack, Parcel
- Next.js, Nuxt, SvelteKit (内蔵)

**バンドル分析ツール**:

- webpack-bundle-analyzer
- rollup-plugin-visualizer
- source-map-explorer
- bundle-buddy
- bundlephobia

**パフォーマンス測定**:

- Lighthouse, PageSpeed Insights
- Chrome DevTools (Network, Performance, Coverage)
- WebPageTest
- Core Web Vitals (CrUX)

**最適化ツール**:

- Terser, UglifyJS (minification)
- PurgeCSS (未使用CSSの削除)
- ImageOptim, Squoosh (画像圧縮)
- SVGO (SVG最適化)
