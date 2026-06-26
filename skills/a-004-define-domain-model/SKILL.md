---
name: a-004-define-domain-model
description: Core Scenarios と MVP Scope から軽量な Domain Sketch（主要用語・境界・中核エンティティ・重要ルール）を定義し、ユビキタス言語を整備する。完全な Event Storming は任意（a-005）。シナリオ作成後、ドメイン理解を素早く固定する際に使用。
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# DefineDomainModel (a-004)

## 目的

- Core Scenarios と MVP Scope から、AI が責務混在を起こさない程度の軽量な Domain Sketch を定義する。
- 主要な業務概念・システム境界・中核エンティティ・重要なビジネスルール・MVP で作らない範囲を素早く固定する。
- 並行してユビキタス言語（共通用語）を洗練させる。
- 完全な Event Storming（Bounded Context / Aggregate / Context Map）は標準では作らない。複雑ドメインで必要なら任意スキル `/a-005-create-domain-diagram`（advanced）に委ねる。

## 前提

- `docs/project/02-behavior/01-core-scenarios.md` が作成されている（`/a-003-create-scenarios` 実行済み）
- `docs/project/01-requirements/02-mvp-scope.md` が作成されている（Must 機能・Not Now / Won't）
- `docs/project/03-domain/` ディレクトリが存在（なければ本スキルが作成する）

## 手順

### 1. 前提ドキュメントの確認

```bash
ls -la docs/project/03-domain/ 2>/dev/null || echo "ディレクトリが存在しません"
```

`02-behavior/01-core-scenarios.md`（Core Flow / Critical Failure）と `02-mvp-scope.md`（Must / Not Now / Won't）を読み込み、ドメインの主要概念と境界を把握する。

### 2. テンプレートの準備

このスキルの配置ディレクトリ（`skills/a-004-define-domain-model/`）を起点に、`docs/project/03-domain/` へ次の 2 ファイルを Read→Write する（FOR EACH）。出力先が既に存在する場合は上書きせずスキップして報告する（冪等）。出力先ディレクトリ（`docs/project/03-domain/`）が無ければ作成する。

- `../../templates/project/03-domain/01-domain-sketch.md` → `docs/project/03-domain/01-domain-sketch.md`
- `../../templates/project/03-domain/02-ubiquitous-language.md` → `docs/project/03-domain/02-ubiquitous-language.md`

### 3. 主要概念と境界の抽出

Core Scenarios と MVP Scope から以下を提案し、`01-domain-sketch.md` を更新する。観点は [reference/event-storming-guide.md](reference/event-storming-guide.md) を参照。

- **主要用語（10〜20 個）**: 頻出する業務用語。曖昧語（Data / Process / Manager）は避ける。
- **アクター / 外部システム / システム境界**: 誰が使い、何と連携し、MVP で作る範囲はどこか。
- **中核エンティティと責務**: MVP の中核エンティティと 1 行責務（属性網羅は不要）。

### 4. ルール・状態・作らない範囲の記入

- **重要なビジネスルール**: 守らないと価値・正しさが崩れるルールだけ。Core Scenarios の Critical Failure と整合させる。
- **状態遷移（任意）**: 明確なライフサイクルがあるエンティティのみ。
- **MVP では作らないドメイン範囲**: `02-mvp-scope.md` の Not Now / Won't と整合させる。
- 新しい用語が登場したら `02-ubiquitous-language.md` にも追記する。

### 5. 簡易ドメイン図の作成（任意）

必要に応じて、アクター・システム境界・外部システムを示す簡易 Mermaid 図を 1 枚だけ `01-domain-sketch.md` の「簡易ドメイン図」へ追加する。複雑な Context Map / Aggregate 図が必要なら `/a-005-create-domain-diagram`（advanced）に委ねる。

### 6. ユビキタス言語の洗練

`02-ubiquitous-language.md` を見直し、重複・曖昧さ・禁止用語を排除。観点は [reference/event-storming-guide.md](reference/event-storming-guide.md#ユビキタス言語の洗練観点) を参照。

### 7. レビューと確認

作成したドキュメントを提示し、(1) 主要概念・境界が Core Scenarios と一致するか、(2) 重要ルールが Critical Failure を防げるか、(3) 作らない範囲が MVP Scope と矛盾しないかを確認する。

### 8. 完了条件と構造の確認

```bash
grep "## 中核エンティティと責務" docs/project/03-domain/01-domain-sketch.md \
  && grep "## 重要なビジネスルール" docs/project/03-domain/01-domain-sketch.md \
  && grep "| 用語 | 定義 |" docs/project/03-domain/02-ubiquitous-language.md \
  && echo "OK" || echo "MISSING SECTION"
```

チェックリスト:

- [ ] `01-domain-sketch.md` に主要用語・境界・中核エンティティ・重要ルールが含まれている
- [ ] MVP で作らないドメイン範囲が明示されている
- [ ] `02-ubiquitous-language.md` の用語が定義されている
- [ ] Domain Sketch とユビキタス言語の整合性が取れている

### 9. Git への追加（オプション）

```bash
git add docs/project/03-domain/
git status
```

コミットメッセージ: [reference/event-storming-guide.md](reference/event-storming-guide.md#git-コミットメッセージ)

## 完了条件

- `docs/project/03-domain/01-domain-sketch.md` と `02-ubiquitous-language.md` が作成されている
- 主要用語・システム境界・中核エンティティ・重要なビジネスルール・MVP で作らない範囲が定義されている
- ドメインで使用される用語がユビキタス言語として定義されている
- ユーザーが内容を承認している

## エスカレーション

- **Core Scenarios が不足**: 「`/a-003-create-scenarios` に戻って Core Scenarios を充実させましょう。」
- **ドメインが複雑で軽量スケッチに収まらない**: 「複雑な Bounded Context / Aggregate / Context Map が必要なら、任意スキル `/a-005-create-domain-diagram`（advanced）で Full DDD を作成しましょう。」

## 参考

- [reference/event-storming-guide.md](reference/event-storming-guide.md) — ドメイン概念抽出の観点、（advanced）Event Storming / Context Map パターン、構造確認コマンド
