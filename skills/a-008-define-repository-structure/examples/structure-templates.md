# ディレクトリ構造と命名規則のテンプレート

SKILL.md 手順3〜5 で使用する構造例と命名規則のサンプル。

## アーキテクチャパターン別の構成例

### レイヤードアーキテクチャ（NestJS 等）

```text
project-root/
├── src/
│   ├── controllers/      # プレゼンテーション層
│   ├── services/         # アプリケーション層
│   ├── repositories/     # インフラ層
│   ├── domain/           # ドメイン層（Entity, VO）
│   └── main.ts
├── tests/
│   ├── unit/
│   └── e2e/
└── package.json
```

### 機能ベース（Feature-based / Next.js App Router 等）

```text
project-root/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   └── layout.tsx
├── features/
│   ├── user/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api.ts
│   └── order/
├── components/           # 共有 UI
├── lib/                  # 汎用ユーティリティ
└── package.json
```

### クリーンアーキテクチャ

```text
project-root/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   └── usecases/
│   ├── application/      # Use Case interactors
│   ├── interface/        # Controller, Presenter
│   └── infrastructure/   # DB, 外部 API
└── tests/
```

### Feature-Sliced Design（FSD）/ Atomic Design

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

## 命名規則のサンプル

### ファイル名

| 対象 | 規則 | 例 |
|:--|:--|:--|
| React Component | PascalCase | `UserCard.tsx` |
| Hook | camelCase (`use` prefix) | `useAuthSession.ts` |
| Utility | camelCase | `formatDate.ts` |
| 定数ファイル | SCREAMING_SNAKE or kebab | `API_ENDPOINTS.ts` / `api-endpoints.ts` |
| Route (Next.js) | kebab-case | `user-settings/page.tsx` |
| Test | `*.test.ts` / `*.spec.ts` | `UserCard.test.tsx` |

### 識別子

- 変数/関数: camelCase
- 型/クラス/コンポーネント: PascalCase
- 定数: SCREAMING_SNAKE_CASE
- ディレクトリ: kebab-case

## 依存関係ルールの例

- 上位層から下位層への依存のみ許可（Presentation → Application → Domain → Infrastructure）
- ドメイン層は他のいかなる層にも依存しない
- features/ 間の直接参照は禁止。共有ロジックは shared/ または entities/ に配置
- インフラ層は interface 経由でドメインに注入する（DIP）

## コロケーション戦略

- 関連ファイルを機能単位でまとめる（components + hooks + styles を同階層）
- テストは対象ファイルと同階層（`Foo.ts` / `Foo.test.ts`）
- 大規模化時は features/ への移行を検討

## コミットメッセージ例

```text
docs: リポジトリ構造とアーキテクチャ定義の作成

- ディレクトリ構成、命名規則、依存関係ルールを定義
- 採用アーキテクチャパターン: [パターン名]
```
