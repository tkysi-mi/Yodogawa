# リポジトリ構造

<!--
何を書くか: プロジェクトのディレクトリ構造とファイル配置の規則

目的:
  - 新規メンバーのオンボーディング支援
  - コードの配置場所を明確化
  - プロジェクト全体の見通しを向上
  - アーキテクチャパターンの一貫性維持
  - リファクタリング時の指針

重要性:
  - コードベースのナビゲーション効率化
  - 機能追加時の配置判断を迅速化
  - アーキテクチャ決定の可視化
  - チーム間の認識統一
  - ツール（IDE、ビルドツール）の設定基盤

記載のポイント:
  - アーキテクチャパターンを明示（レイヤードアーキテクチャ、クリーンアーキテクチャ、ドメイン駆動設計など）
  - ディレクトリの責務を明確に記載
  - 命名規則を具体例とともに提示
  - 依存関係のルールを記載（例: インフラ層はドメイン層に依存可能、逆は不可）
  - モノレポ/マルチレポの戦略を明記
  - 共通パターン（コロケーション、機能ベース、レイヤーベース）の選択理由

更新頻度:
  - プロジェクト初期に作成
  - アーキテクチャ変更時に更新
  - 新しいディレクトリを追加する際に更新
  - 四半期ごとに見直し（実際の構造との乖離確認）
-->

---

## ディレクトリ構造

<!--
プロジェクトのフォルダ構造を tree コマンド形式で記載

記載のベストプラクティス:
  1. ルートから主要ディレクトリまで（深すぎると読みづらい）
  2. 各ディレクトリに1行コメントで役割を記載
  3. 重要なファイル（設定ファイルなど）も含める
  4. サンプルファイル名を含めると理解しやすい
  5. 複数のアーキテクチャパターンがある場合は分けて記載

よくあるパターン:
  A. レイヤーベース（Clean Architecture, Layered Architecture）
     - presentation/ → domain/ → infrastructure/
     - 依存方向が明確、大規模プロジェクト向き

  B. 機能ベース（Feature-based, Vertical Slices）
     - features/user-management/, features/billing/
     - 機能ごとに独立、マイクロサービス移行しやすい

  C. Atomic Design（UI コンポーネント）
     - atoms/, molecules/, organisms/, templates/, pages/
     - デザインシステムとの整合性、再利用性が高い

  D. モノレポ
     - packages/app/, packages/web/, packages/shared/
     - 複数アプリケーション、コード共有が必要な場合

選択したパターンの理由をメモ欄に記載すること
-->

```
project-root/
├── src/                    # ソースコード
│   ├── components/        # UIコンポーネント（再利用可能な部品）
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── features/          # 機能モジュール（ビジネスロジック単位）
│   │   ├── user/
│   │   │   ├── UserList.tsx
│   │   │   ├── UserDetail.tsx
│   │   │   └── userService.ts
│   │   └── auth/
│   ├── lib/               # ユーティリティ、ヘルパー関数
│   │   ├── api.ts
│   │   └── formatters.ts
│   ├── hooks/             # カスタムフック（React など）
│   ├── types/             # 型定義（TypeScript）
│   ├── styles/            # グローバルスタイル
│   └── App.tsx            # アプリケーションエントリーポイント
├── public/                 # 静的ファイル（HTML、画像、フォントなど）
│   ├── index.html
│   └── favicon.ico
├── docs/                   # プロジェクトドキュメント
│   ├── project/
│   └── tasks/
├── tests/                  # テストコード
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                # ビルドスクリプト、デプロイスクリプト
├── .github/                # GitHub Actions ワークフロー
│   └── workflows/
├── node_modules/           # 依存パッケージ（gitignore）
├── package.json            # プロジェクト設定、依存関係
├── tsconfig.json           # TypeScript 設定
├── .env.example            # 環境変数テンプレート
├── .gitignore              # Git 除外設定
└── README.md               # プロジェクト概要
```

---

## アーキテクチャパターン

<!--
採用しているアーキテクチャパターンを明示

記載すべき内容:
  - パターン名（例: Clean Architecture, Layered Architecture, Feature-Sliced Design）
  - パターンを選んだ理由
  - レイヤー/モジュールの依存方向
  - パターンの適用範囲（フロントエンド/バックエンド/全体）

よくあるパターン:
  - Clean Architecture: 依存性逆転、ドメイン中心
  - Layered Architecture: プレゼンテーション → ビジネスロジック → データアクセス
  - Hexagonal Architecture (Ports & Adapters): コア + アダプター
  - Feature-Sliced Design: features/, shared/, entities/, widgets/
  - Modular Monolith: モジュール単位で分割、境界明確
-->

**採用パターン**: <!-- 例: Feature-based Architecture -->

**理由**:
<!-- 例:
- 機能ごとに独立したモジュール化
- チームを機能単位で分割しやすい
- マイクロサービス移行を見据えた設計
-->

**依存方向**:
<!-- 例:
features/ → lib/ (OK)
features/user/ → features/auth/ (要検討、循環依存注意)
components/ → features/ (NG、コンポーネントは汎用部品)
-->

---

## 主要ディレクトリ

<!--
各ディレクトリの責務と配置すべきファイルを明記

テーブル構成:
【ディレクトリ】
  - パス表記（例: /src, /src/features）
  - プロジェクトルートからの相対パス

【役割】
  - そのディレクトリが担う責務
  - 配置すべきファイルの種類
  - 配置すべきでないもの（アンチパターン）

【例】
  - 具体的なファイル名やサブディレクトリの例

記載のベストプラクティス:
  - 「何を置くべきか」だけでなく「何を置くべきでないか」も記載
  - サブディレクトリの構造パターンも示す
  - 複数チームで開発する場合は所有権も明記
-->

| ディレクトリ | 役割 | 例 |
|--------------|------|----|
| `/src` | アプリケーションのソースコード全体。ビジネスロジック、UI、ユーティリティを含む | `App.tsx`, `index.ts` |
| `/src/components` | 再利用可能な UI コンポーネント。ビジネスロジックを持たない汎用部品 | `Button.tsx`, `Modal.tsx`, `Input.tsx` |
| `/src/features` | 機能単位のモジュール。UI、ロジック、API 呼び出しを含む | `/features/user/UserList.tsx`, `/features/auth/LoginForm.tsx` |
| `/src/lib` | ユーティリティ関数、API クライアント、共通ロジック。ビジネスロジック非依存 | `api.ts`, `formatDate.ts`, `validation.ts` |
| `/src/hooks` | カスタムフック（React など）。UI ロジックの再利用 | `useAuth.ts`, `useFetch.ts` |
| `/src/types` | TypeScript 型定義。API レスポンス型、ドメインモデル型 | `User.ts`, `ApiResponse.ts` |
| `/src/styles` | グローバルスタイル、テーマ設定、CSS変数 | `global.css`, `theme.ts` |
| `/public` | 静的ファイル。ビルド時にそのままコピーされる | `index.html`, `favicon.ico`, `robots.txt` |
| `/docs` | プロジェクトドキュメント。要件、設計、タスク管理 | `/docs/project/`, `/docs/tasks/` |
| `/tests` | テストコード。ユニット、統合、E2E テスト | `/tests/unit/`, `/tests/e2e/` |
| `/scripts` | ビルド、デプロイ、データ移行などのスクリプト | `build.sh`, `deploy.js` |
| `/.github` | GitHub 関連設定。Actions ワークフロー、Issue テンプレート | `/workflows/ci.yml`, `PULL_REQUEST_TEMPLATE.md` |

---

## 命名規則

<!--
ファイル、ディレクトリ、変数の命名規則を定義

テーブル構成:
【対象】
  - ファイルの種類やコード要素の種類

【規則】
  - 命名パターン（PascalCase, camelCase, kebab-case, snake_case）
  - 接頭辞・接尾辞のルール

【例】
  - 実際のファイル名やコード例

よくある命名規則:
  - React コンポーネント: PascalCase (UserProfile.tsx)
  - TypeScript ファイル: camelCase (formatDate.ts)
  - テストファイル: *.test.ts, *.spec.ts
  - CSS Modules: *.module.css
  - 設定ファイル: ドット始まり (.eslintrc, .env)
  - 定数ファイル: UPPER_SNAKE_CASE (API_ENDPOINTS.ts) または constants.ts

一貫性が重要: プロジェクト全体で統一された規則を維持
-->

| 対象 | 規則 | 例 |
|------|------|-----|
| **ファイル・ディレクトリ** | | |
| React コンポーネント | PascalCase、拡張子 .tsx | `UserProfile.tsx`, `LoginForm.tsx` |
| TypeScript ファイル | camelCase、拡張子 .ts | `formatDate.ts`, `apiClient.ts` |
| CSS Modules | *.module.css,*.module.scss | `Button.module.css` |
| テストファイル | *.test.ts,*.spec.ts | `user.test.ts`, `auth.spec.ts` |
| 設定ファイル | ドット始まり、特定の名前 | `.eslintrc.json`, `.env`, `tsconfig.json` |
| ディレクトリ | kebab-case または camelCase | `user-management/` または `userManagement/` |
| **コード要素** | | |
| 変数・関数 | camelCase | `const userName = ...`, `function fetchData() {}` |
| 定数 | UPPER_SNAKE_CASE | `const API_BASE_URL = ...`, `const MAX_RETRY = 3` |
| クラス・型 | PascalCase | `class UserService {}`, `type ApiResponse = ...` |
| インターフェース | PascalCase、I接頭辞は避ける | `interface User {}` (not `IUser`) |
| Enum | PascalCase (型), UPPER_SNAKE_CASE (値) | `enum Status { ACTIVE = "ACTIVE" }` |

---

## モジュール境界と依存関係

<!--
モジュール間の依存関係ルールを定義（オプション）

このセクションは特に重要:
  - Clean Architecture や Layered Architecture を採用している場合
  - モノレポで複数パッケージを管理している場合
  - マイクロフロントエンド構成の場合

記載すべき内容:
  - 許可される依存方向
  - 禁止される依存（循環依存、逆方向依存）
  - 依存関係を強制するツール（dependency-cruiser, madge など）
  - Bounded Context 間の依存ルール（DDD の場合）

依存関係の例:
  - UI層 → ドメイン層 (OK)
  - ドメイン層 → インフラ層 (NG、依存性逆転)
  - features/user → features/auth (要検討、結合度上昇)
  - lib → features (NG、汎用ユーティリティが機能依存)
-->

**依存ルール**:

- ✅ **許可**: `features/` → `components/`, `lib/`, `hooks/`, `types/`
- ✅ **許可**: `components/` → `lib/`, `types/`
- ❌ **禁止**: `lib/` → `features/` (汎用ライブラリが機能に依存)
- ❌ **禁止**: `components/` → `features/` (汎用コンポーネントが機能に依存)
- ⚠️ **注意**: `features/user/` → `features/auth/` (機能間依存、循環依存注意)

**依存関係の強制**:
<!-- 例:
- dependency-cruiser で依存ルールを検証
- .dependency-cruiser.json に禁止ルールを定義
- CI で依存違反を検出
-->

---

## コロケーション戦略

<!--
関連ファイルの配置方針（オプション）

コロケーション = 関連するファイルを近くに配置する設計原則

よくあるパターン:
  A. ファイルタイプ別
     - components/, styles/, tests/ を分離
     - 伝統的だが、機能追加時に複数ディレクトリを編集

  B. 機能別コロケーション
     - UserProfile.tsx, UserProfile.module.css, UserProfile.test.tsx を同じディレクトリに
     - 変更が局所化、削除も容易

  C. ハイブリッド
     - features/ 内ではコロケーション
     - 共通コンポーネントはタイプ別

選択基準:
  - チームサイズ（小規模ならコロケーション推奨）
  - プロジェクト規模（大規模なら機能別）
  - マイクロフロントエンド移行予定があるか
-->

**採用戦略**: <!-- 例: 機能別コロケーション -->

**配置例**:

```
features/user/
├── UserProfile.tsx          # コンポーネント
├── UserProfile.module.css   # スタイル
├── UserProfile.test.tsx     # テスト
├── userService.ts           # ビジネスロジック
└── types.ts                 # 型定義
```

**理由**:
<!-- 例:
- 機能追加・削除時の変更が1ディレクトリ内で完結
- ファイル間の移動が少なく、認知負荷が低い
- マイクロフロントエンド移行時にモジュール分割が容易
-->

---

## 設定ファイル一覧

<!--
プロジェクトルートの主要設定ファイル（オプション）

記載すべき設定ファイル:
  - ビルドツール: package.json, tsconfig.json, vite.config.ts
  - リンター/フォーマッター: .eslintrc, .prettierrc
  - テスト: jest.config.js, playwright.config.ts
  - 環境変数: .env, .env.example
  - Docker: Dockerfile, docker-compose.yml
  - CI/CD: .github/workflows/*.yml
  - エディタ: .editorconfig, .vscode/settings.json

目的: 新規メンバーが設定ファイルの役割を理解しやすくする
-->

| ファイル | 役割 |
|----------|------|
| `package.json` | Node.js プロジェクト設定、依存関係、スクリプト定義 |
| `tsconfig.json` | TypeScript コンパイラ設定 |
| `.eslintrc.json` | ESLint ルール設定（コード品質チェック） |
| `.prettierrc` | Prettier フォーマット設定 |
| `.env.example` | 環境変数のテンプレート（機密情報は含めない） |
| `.gitignore` | Git 管理対象外ファイル（node_modules, .env など） |
| `jest.config.js` | Jest テスト設定 |
| `Dockerfile` | Docker イメージビルド定義 |
| `.github/workflows/ci.yml` | GitHub Actions CI/CD ワークフロー |

---

## メモ

<!--
リポジトリ構造に関する補足情報

記載すべき内容:
  1. 構造変更の履歴
     - いつ、なぜディレクトリ構造を変更したか
     - マイグレーション方法（移行スクリプトなど）

  2. 将来の構造変更計画
     - モノレポ移行の予定
     - マイクロサービス分割の計画
     - レイヤー分離の強化

  3. ツールとの統合
     - ESLint import/no-restricted-paths プラグイン
     - dependency-cruiser での依存検証
     - IDE のパス補完設定

  4. チーム運用
     - 新規ディレクトリ作成時の承認フロー
     - 構造変更の提案方法（ADR作成など）

  5. モノレポ戦略（該当する場合）
     - パッケージマネージャー（npm workspaces, yarn workspaces, pnpm, turborepo）
     - 共有コードの管理方法
     - ビルドキャッシュ戦略

  6. パフォーマンス最適化
     - Tree shaking のためのバレルエクスポート避ける
     - Code splitting の境界
     - Dynamic import の利用箇所

  7. セキュリティ
     - 環境変数の管理（.env は gitignore、.env.example のみコミット）
     - 機密情報を含むファイルの配置ルール
     - public/ ディレクトリの注意点（すべて公開される）
-->
