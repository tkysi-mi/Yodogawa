# 推奨スタックとインタビュー項目

SKILL.md 手順3〜4 で使用する提案テンプレートと詳細ヒアリング項目。

## 推奨案提示フォーマット

```markdown
### 推奨技術スタック

**フロントエンド**: React 18 + TypeScript 5 + Vite
- 推奨理由: SPA 要件、エコシステム、TypeScript による型安全性
- 代替案: Vue 3 + Nuxt（SSR が必要な場合）

**バックエンド**: Node.js 20 + NestJS + TypeScript
- 推奨理由: FE と言語統一、DDD 志向のモジュール構成が標準装備
- 代替案: Go + Gin（高スループットが必要な場合）

**データベース**: PostgreSQL 16 + Prisma
- 推奨理由: リレーショナルデータ、JSON 型、強い整合性
- 代替案: MySQL 8（既存資産がある場合）
```

## レイヤー別インタビュー項目

### フロントエンド

- フレームワーク: React / Vue / Svelte / SolidJS
- レンダリング: SPA / SSR / SSG / Islands
- TypeScript 利用の有無
- 状態管理: React Query / Zustand / Redux Toolkit / Pinia
- スタイリング: Tailwind / CSS Modules / styled-components

### バックエンド

- 言語: TypeScript / Go / Python / Rust / Kotlin
- フレームワーク: NestJS / Fastify / Gin / FastAPI / Spring Boot
- API スタイル: REST / GraphQL / gRPC / tRPC
- バリデーション: Zod / class-validator / Pydantic

### データベース

- 種別: RDBMS（PostgreSQL / MySQL）/ NoSQL（MongoDB / DynamoDB）
- ORM / クエリビルダー: Prisma / TypeORM / Drizzle / sqlc
- マイグレーション戦略: 自動生成 / 手書き

### インフラ・CI/CD

- クラウド: AWS / GCP / Azure / Cloudflare / Vercel
- コンテナ: Docker / Kubernetes / ECS / Cloud Run
- IaC: Terraform / Pulumi / CDK
- CI/CD: GitHub Actions / GitLab CI / CircleCI

### 監視・テスト

- ログ/メトリクス: Datadog / New Relic / Grafana + Prometheus
- エラートラッキング: Sentry
- テスト: Vitest / Jest / Playwright / Cypress
- リンター: ESLint + Prettier / Biome

## 選定タイミング区分

- **初期**: MVP 構築時点から導入
- **中期**: ユーザー増加に合わせて導入
- **後期**: スケール・運用安定化で導入
- **随時**: 必要に応じて導入

## 記入例（表形式）

| 層 | 技術 | バージョン | 選定理由 | タイミング |
|:--|:--|:--|:--|:--|
| FE | React | 18.x | SPA・エコシステム | 初期 |
| BE | NestJS | 10.x | DDD 構成 | 初期 |
| DB | PostgreSQL | 16.x | 整合性 | 初期 |
| 監視 | Datadog | - | 統合監視 | 中期 |

## コミットメッセージ例

```text
docs: 技術スタック選定ドキュメントの作成

- フロントエンド、バックエンド、インフラ等の技術選定を定義
- 選定理由と導入フェーズを明記
```
