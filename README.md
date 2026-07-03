# Yodogawa

> **🌟 AIネイティブIDE向けの仕様駆動開発スキル集**

---

## 概要

**Yodogawa**は、プロダクトマネージャーや開発者が**ステークホルダーと合意できる高品質なドキュメント**を作成・維持するための**仕様駆動開発スキル集**です。

生成AIを使ったコーディングでは、**コンテキスト（文脈）がすべて**です。  
AIに「何を作りたいのか」を正確に伝えるには、チーム全体で合意された詳細なドキュメントが欠かせません。

Yodogawaは、このドキュメント作成プロセスを標準化し、AIエージェントが理解しやすい形式で仕様・設計・タスクを管理できるようにします。

### スキルの仕組み

各スキルは `skills/{name}/SKILL.md` という形式で定義されています。  
`SKILL.md` はYAML frontmatterに `name`（識別子）と `description`（スキルの役割を表す説明文）を持ち、手順・完了条件・エスカレーション指針を記述したMarkdownドキュメントです。

```
skills/
├── a-001-setup-doc-structure/
│   └── SKILL.md
├── a-002-initialize-project/
│   └── SKILL.md
└── ...
```

インストール後、各IDEがスキルを認識し、ユーザーがスラッシュコマンド（例 `/a-001-setup-doc-structure`）で明示的に呼び出せるようになります。

### 対応環境

以下のAIネイティブIDE・コードエディタに導入できます。本ツールは各 IDE のスキルディレクトリ（Claude Code は `.claude/`、その他は `.agents/`）へ `skills/` / `templates/` をコピーします。スキルは `name` / `description` を持つ YAML frontmatter と Markdown 本文で構成されます。各 IDE での認識・呼び出し挙動はそれぞれの仕様に依存します：

| IDE / エディタ  | スキルの場所                                        | 呼び出し方              |
| :-------------- | :-------------------------------------------------- | :---------------------- |
| **Claude Code** | `.claude/skills/{name}/SKILL.md`                    | `/a-001` などで呼び出し |
| **Cursor**      | `.agents/skills/{name}/SKILL.md`                    | `/a-001` などで呼び出し |
| **Codex**       | `.agents/skills/{name}/SKILL.md`                    | `/a-001` などで呼び出し |
| **Antigravity** | `.agents/skills/{name}/SKILL.md`                    | `/a-001` などで呼び出し |

> ℹ️ 表中の `/a-001` 等は短縮表記です。実際の呼び出しはフルのスキル名（例 `/a-001-setup-doc-structure`）を使います。Plugin 導入時は `/yodogawa:a-001-setup-doc-structure` のようにプレフィックスが付きます。
>
> ℹ️ frontmatter には Claude Code 向けの拡張フィールドが含まれます（`disable-model-invocation` は全スキル、`allowed-tools` / `argument-hint` / `context: fork` は一部スキルに設定）。これらの他 IDE での扱いは各 IDE の仕様に依存し、本プロジェクトでは検証していません。詳細は下記「設計上の決定」を参照。
>
> ℹ️ 一部のスキルは手順内でエージェントが `ls` / `cat` / `find` / `grep` などの POSIX シェルコマンドを実行します（大半のスキルが `allowed-tools` に `Bash` を含みます）。Windows ネイティブ環境では bash 互換シェル（Git Bash / WSL 等）が利用できる状態を推奨します。各 IDE での実行可否は IDE の仕様に依存します。

---

## 背景

### 生成AI時代の開発課題

Copilot、Claude、GPTなど、生成AIを使ってコードを書く時代になりました。  
しかし、**AIは万能ではありません**。良いコードを生成するには、**良いコンテキスト**が必要です。

> 🎯 **「何を作りたいのか」が曖昧だと、AIも曖昧な答えしか返せない。**

チーム開発では、以下のポイントが重要になります：

- 📝 **非開発者（PM、デザイナー）と開発者**が同じドキュメントを見て合意できること
- 🔗 **ドキュメントがリポジトリ内にある**こと → AIがコンテキストとして参照できる
- 🔄 **ドキュメントとコードが同期している**こと → 陳腐化しない

### 既存ツールの課題

多くのSpec Driven Developmentツールが存在しますが、それぞれに課題があります：

| 課題                         | 詳細                                               |
| :--------------------------- | :------------------------------------------------- |
| **タスク単位でバラバラ**     | タスクごとにドキュメントが分散し、全体像が見えない |
| **ドキュメントが薄い・曖昧** | API仕様やDBスキーマまで踏み込んでいない            |
| **リポジトリ外で管理**       | Notion、Confluenceなどに分散し、AIが参照できない   |

### Yodogawaのアプローチ

Yodogawaは、**「なぜ作るのか？」から「どう作るか？」まで**を一貫して文書化します：

```
Why? ─── What? ─── How?
 │         │         │
 ▼         ▼         ▼
目的    ユーザー   API仕様
課題    ストーリー  DBスキーマ
スコープ  シナリオ   アーキテクチャ
```

**メリット:**

- ✅ すべてリポジトリ内で管理 → AIのコンテキストとして最適
- ✅ 非開発者と開発者が同じドキュメントを参照できる
- ✅ 設計から実装まで一貫性を保てる

**デメリット:**

- ⚠️ 他のツールより**ドキュメント作成に時間がかかる**
- ⚠️ 小規模・短期プロジェクトにはオーバースペックな場合がある

> 💡 **Yodogawaは「急がば回れ」の思想です。**  
> 最初に時間をかけて仕様を固めることで、後工程のやり直しを減らせます。

---

## 解決できる課題

| 課題                                | Yodogawaの解決策                                    |
| :---------------------------------- | :-------------------------------------------------- |
| 📝 仕様が曖昧なまま実装が始まる     | A-Seriesで要件・設計を事前に文書化                  |
| 🔄 人によって成果物の品質がバラつく | 構造化されたワークフローで標準化                    |
| 📚 ドキュメントがすぐ陳腐化する     | C-002で実装後にドキュメントを自動更新               |
| 🐛 設計と実装が乖離する             | B-005レビュー & A-015設計レビューで整合性をチェック |
| 🤖 AIに何を頼めばいいか分からない   | 事前定義されたワークフローに従うだけ                |
| 🔁 スキルの品質改善が属人化・散発的になる | D-001が実行後の振り返りをSKILL.md修正案に還元       |

---

## スキル一覧

開発ライフサイクルに沿って、**4つのシリーズ**を提供しています。

### A-Series：プロジェクト設計

> プロジェクトの立ち上げや、大規模な設計変更時に使用

|  #  | コマンド | 名前                      | 説明                                               |
| :-: | :------- | :------------------------ | :------------------------------------------------- |
|  1  | `/a-001` | **Setup Doc Structure**   | ドキュメント構造をセットアップ（a-002 が自動実行するため任意） |
|  2  | `/a-002` | **Initialize Project**    | 問題定義(Why) を Product Brief（課題・ユーザー・価値・成功指標）として作成（新規/既存モード対応） |
| 2a  | `/a-002a`| **Slice MVP Scope**       | Parking Lot（アイデア backlog）を生成し、MVP を Must/Not Now/Won't に切り分け、やらないこと（Out of Scope）を明示 |
| 2b  | `/a-002b`| **Define User Stories**   | Must 機能を起点にユーザーストーリー（役割・目的・価値・受け入れ基準）を作成 |
|  3  | `/a-003` | **Create Core Scenarios** | MVP の主要行動（Day 1 Happy Path・Critical Failure）を定義（詳細 Gherkin は任意） |
|  4  | `/a-004` | **Define Domain Sketch**  | 軽量ドメイン（主要用語・境界・中核エンティティ・重要ルール）を定義 |
|  5  | `/a-005` | **Create Domain Diagram** | （任意/Advanced）Full DDD・Context Map を図解（複雑ドメインのみ） |
|  6  | `/a-006` | **Review & PM Gate**      | ⚠️ **整合性レビュー＋PM Gate（Go/No-Go）、STAKEHOLDER-SUMMARY・AI_CONTEXT を生成** |
|  7  | `/a-007` | **Define Tech Stack**     | 技術スタック（言語・FW・DB）を選定                 |
|  8  | `/a-008` | **Define Repo Structure** | リポジトリのディレクトリ構成を定義                 |
|  9  | `/a-009` | **Define Screen Design**  | 画面遷移・UIコンポーネント・Empty Stateを設計      |
| 10  | `/a-010` | **Define Design System**  | デザインシステム（カラー、タイポグラフィ等）を定義 |
| 11  | `/a-011` | **Define Data Model**     | データベーススキーマ・ER図を設計                   |
| 12  | `/a-012` | **Define API Spec**       | APIエンドポイント・リクエスト/レスポンスを定義     |
| 13  | `/a-013` | **Define Architecture**   | アーキテクチャ決定記録（ADR）を作成                |
| 14  | `/a-014` | **Define Infrastructure** | インフラ構成・**詳細な非機能要件（性能/可用性/RPO/RTO）を所有** |
| 15  | `/a-015` | **Review Design**         | ⚠️ **全体設計の一貫性をレビュー**                  |

> ⚠️ マークのスキルは**必ず実施**してください。
>
> ℹ️ **非機能要件（NFR）の扱い**: 初期フェーズ（a-002）では、MVP の作り方を変えるほど重要な制約のみを Product Brief の「クリティカル制約」に集約します。応答時間・稼働率・スケーラビリティ等の**詳細な定量 NFR は設計フェーズ（a-014）が所有**します（責務分離）。そのため `01-requirements/` の採番は `04` を欠番とし、`01`(Product Brief) / `02`(MVP Scope) / `03`(Parking Lot) / `05`(User Stories) / `06`(Features Implemented, existing のみ) になります。
>
> ℹ️ **スキルの採番方針**: 番号プレフィックス（`a-002` 等）はフェーズ標識として安定維持し、**振り直しません**。フェーズ間に新スキルを挿入する場合は**英字 suffix**（`a-002a` = MVP Scope、`a-002b` = User Stories）を用います。これにより既存の相互参照・推奨フローへの影響を最小化します。

---

### B-Series：タスク管理

> 機能開発タスクを定義し、実装可能なレベルまで詳細化

|  #  | コマンド | 名前                    | 説明                                                           |
| :-: | :------- | :---------------------- | :------------------------------------------------------------- |
|  1  | `/b-001` | **Create Task Dir**     | `docs/tasks/taskNNN` ディレクトリを作成し、テンプレートを配置  |
|  2  | `/b-002` | **Task Definition**     | タスクの目的・ユーザーストーリー・受け入れ基準を定義           |
|  3  | `/b-003` | **Task Research**       | 実装に必要な調査（既存コード・ライブラリ・ベストプラクティス） |
|  4  | `/b-004` | **Implementation Plan** | タスクを詳細な実装ステップ（1ステップ数時間）に分解            |
|  5  | `/b-005` | **Review Task**         | ⚠️ **実装計画の品質と漏れをレビュー、Go/No-Go判断**            |

---

### C-Series：実装

> 承認された計画に基づき、コード実装・テスト・ドキュメント更新

|  #  | コマンド | 名前               | 説明                                             |
| :-: | :------- | :----------------- | :----------------------------------------------- |
|  1  | `/c-001` | **Implement Task** | 計画されたステップに従って実装・テストを反復実行 |
|  2  | `/c-002` | **Update Docs**    | 実装完了後、プロジェクト全体のドキュメントを更新 |

---

### D-Series：メタ／横断

> A〜Cシリーズ（または1タスク分のb/cサイクル）完了後の振り返りに使用

|  #  | コマンド | 名前                    | 説明                                                                       |
| :-: | :------- | :---------------------- | :------------------------------------------------------------------------- |
|  1  | `/d-001` | **Review Retrospective** | 成果物ドキュメントから摩擦点を収集し、SKILL.md修正案の提示とLESSONS.md記録を行う |

---

## 導入

> ℹ️ 再インストールは既存の `skills/` / `templates/`（方法1・方法3）にマージされます（同名ファイルは上書き、不足ファイルは追加）。スキルの**リネーム・削除を反映するには**、再実行前に対象の `.claude/skills/`・`.claude/templates/`（その他 IDE は `.agents/...`）を手動で削除してください。方法2（Plugin）はファイルをコピーしないため対象外です。

### 方法1: NPMパッケージ（推奨／全IDE対応）

```bash
npm install -g yodogawa
cd your-project-dir
yodogawa
```

対話形式でIDEを選択すると、`skills/`, `templates/` がプロジェクトの IDE ディレクトリに配置されます。

### 方法2: Claude Code Plugin（Claude Code 限定）

Claude Code から直接マーケットプレイスを追加してインストールできます。リポジトリにファイルをコピーせず、`.claude/settings.json` に参照エントリのみ追加されます。

```bash
# Claude Code 内で以下を実行
/plugin marketplace add tkysi-mi/Yodogawa
/plugin install yodogawa@yodogawa
/reload-plugins
```

スキルは `/yodogawa:a-001` のようにプラグイン名のプレフィックス付きで呼び出されます。

> ℹ️ Plugin 機能は Claude Code 固有です。Cursor / Codex / Antigravity を使う場合は方法1または方法3を選んでください。
>
> ℹ️ スキルが参照するテンプレート（`templates/`）は、各スキルの配置ディレクトリを起点に相対参照で解決されるため、Plugin 導入でもプラグインキャッシュ上のテンプレートが利用されます。実行環境の差異で解決できない場合は、確実な方法1（NPM）または方法3（手動）を利用してください。

### 方法3: 手動導入

このリポジトリの `skills/`, `templates/` をプロジェクトの IDE ディレクトリにコピーしてください：

- **Claude Code**: `.claude/` 配下にコピー
- **Cursor / Codex / Antigravity**: `.agents/` 配下にコピー

---

## CLI コマンド

インストーラに加えて、決定的に判定できる検査・操作を CLI サブコマンドとして同梱しています（`npx -y yodogawa <command>` でインストール不要でも実行可能）。

### `yodogawa doctor` — ドキュメントの健全性検査

`docs/project/` のトレーサビリティと構造をスクリプトで決定的に検査します。レビュー系スキル（`/a-006` / `/a-015` / `/b-005`）が自然言語で指示していた機械的な検査（存在確認・trace切れ・リンク切れ）をスクリプト実行結果の転記に置き換えます。ただし `/b-005` は対象が `docs/tasks/` のため `links` チェックのみが対象で、他の観点はエージェントの読解判断に基づきます。

```bash
yodogawa doctor            # カレントディレクトリを検査（人間可読）
yodogawa doctor --json     # 機械可読な JSON を出力
yodogawa doctor --dir path/to/project
```

| チェック | 内容 |
|:--|:--|
| `structure` | 必須ファイル・必須見出し・テーブル骨格の存在（フェーズ進行に応じて未着手分は対象外） |
| `id-trace` | `P-XXX` / `US-XXX` / `FN-XXX` / `CS-XXX` / `CF-XXX` の参照整合（trace 切れ = Error、孤児 ID = Warning） |
| `placeholder` | テンプレート未記入（コメントのみのセル・プレースホルダ・`**例:**`・空セクション）の残置 |
| `links` | `docs/` 内の相対リンク切れ |

Exit code は `0` = Error なし（Warning のみ含む）、`1` = Error あり、`2` = 使い方の誤り。各チェックは単体でも実行できます（例: `node bin/checks/id-trace.js <dir>`）。

### `yodogawa new-task <slug>` — タスクディレクトリの採番作成

`/b-001-create-task-directory` の採番規則（`task{6桁連番}-{スラッグ}`）で `docs/tasks/` にディレクトリを作成します。

```bash
yodogawa new-task user-profile-edit          # docs/tasks/task000001-user-profile-edit
yodogawa new-task user-profile-edit --json   # {"id":"task000001", "slug":"...", "path":"..."}
```

---

## 使い方

### 1️⃣ プロジェクトの立ち上げ（A-Series スキル）

新規プロジェクトや大規模機能の開発時に、**A-Series**を順番に実行します。

| ステップ | コマンド            | 内容                                                                      |
| :------: | :------------------ | :------------------------------------------------------------------------ |
|    1     | `/a-002` → `/a-002a` → `/a-002b` → `/a-003` → `/a-004` | Product Brief、MVP スコープ、User Stories、Core Scenarios、Domain Sketch（a-002 がドキュメント構造を自動初期化。`/a-005` は複雑ドメイン向けの任意 Advanced） |
|    2     | `/a-006`            | ⚠️ **PM Gate（整合性レビュー＋Go/No-Go、AI_CONTEXT 生成）（必須）**        |
|    3     | `/a-007` → `/a-014` | 技術スタック、リポジトリ構成、画面設計、DB、API、アーキテクチャ、インフラ |
|    4     | `/a-015`            | ⚠️ **全体設計レビュー（必須）**                                           |

#### プロダクト性質別の推奨フロー

プロダクトの性質に応じて、A-Series 前半の進め方を2つ用意しています。

- **新規プロダクト向け（greenfield）**: Product Brief → MVP Scope → User Stories → Core Scenarios → Domain Sketch → PM Gate
- **既存プロダクト向け（existing / brownfield）**: Codebase Inventory → Product Brief 補完 → Scope 再定義

> ℹ️ 上記のフェーズ名は A-Series 再構成後の呼称です。現状、**Product Brief** は `/a-002`（Initialize Project）が `01-product-brief.md` として、**MVP Scope** は `/a-002a`（Slice MVP Scope）が `02-mvp-scope.md`（Must/Not Now/Won't ＋ Out of Scope）と `03-parking-lot.md` として、**User Stories** は `/a-002b`（Define User Stories）が `05-user-stories.md` として、**PM Gate** は `/a-006` が整合性レビュー＋ Go/Go with caveats/No-Go 判定として実行し、`STAKEHOLDER-SUMMARY.md`（合意用1枚）と `AI_CONTEXT.md`（AI 実装用コンテキスト）を生成します。a-002 は **greenfield / existing の2モード**に分岐し、新規プロダクトでは実装済み機能の棚卸し（`06-features-implemented.md`）をスキップ、既存プロダクトではコードベース分析と棚卸しを実行します（モード未指定時の既定は greenfield）。**Core Scenarios** は `/a-003`（Create Core Scenarios）が `01-core-scenarios.md`（Day 1 Happy Path・Critical Failure・Not Covered in MVP）として実行します。詳細な Gherkin は任意（`skills/a-003-create-scenarios/reference/detailed-gherkin-template.md`）です。**Domain Sketch** は `/a-004`（Define Domain Sketch）が `01-domain-sketch.md`（主要用語・境界・中核エンティティ・重要ルール・MVP で作らない範囲・簡易図）として実行します。**標準は Domain Sketch、複雑なドメインのみ Full DDD（`/a-005` で Bounded Context・Aggregate・Context Map を `01-domain-model.md` に展開）** という分担で、`/a-005` は標準フローには含まれない任意 Advanced です。
>
> 🤖 `a-006` 完了後、Go / Go with caveats なら `docs/project/AI_CONTEXT.md` を実装エージェント（Vibe coding / AI 実装）へ渡すと、スコープ境界（作る/作らないもの）を保ったまま実装に入れます。

---

### 2️⃣ 機能開発のループ（B & C Series スキル）

個々のタスクは以下のサイクルで進めます：

| ステップ | コマンド | 内容                                                 |
| :------: | :------- | :--------------------------------------------------- |
|    1     | `/b-001` | タスクディレクトリ作成                               |
|    2     | `/b-002` | タスク定義（目的・ユーザーストーリー・受け入れ基準） |
|    3     | `/b-003` | 実装調査（既存コード・ライブラリ調査）               |
|    4     | `/b-004` | 実装計画（詳細ステップに分解）                       |
|    5     | `/b-005` | ⚠️ **レビュー・Go/No-Go判断**                        |
|    6     | `/c-001` | 実装・テスト（計画に沿って反復）                     |
|    7     | `/c-002` | ドキュメント更新                                     |

> ⚠️ `/b-005` でRejectされた場合は `/b-002` に戻って修正

---

## スキルのフォーマット

各 `SKILL.md` は以下の構造を持ちます：

```markdown
---
name: a-001-setup-doc-structure
description: プロジェクトのドキュメントディレクトリ構造を作成する軽量セットアップワークフロー
---

# スキル名

## 目的
## 前提
## 手順
## 完了条件
## エスカレーション
```

- **`name`**: スキルの識別子（kebab-case）
- **`description`**: スキルの役割を説明する文（スキル一覧での識別に使われる）

---

## 設計上の決定（Design Decisions）

### スキルは「ユーザーが明示的に呼び出す」設計

全スキルの frontmatter には `disable-model-invocation: true` を設定しています。これは **AIエージェントによる自動呼び出しを無効化し、ユーザーがスラッシュコマンドで明示的に呼び出す**ことを意味します。

仕様駆動開発では、各フェーズ（要件定義 → 設計 → タスク → 実装）を**正しい順序で・適切なタイミングで**実行することが品質を左右します。AIが文脈から自動でスキルを起動すると、順序の飛ばしや意図しない実行が起きやすくなります。そこで Yodogawaは、ユーザーが `/a-001-setup-doc-structure` のように明示的に呼び出す設計を採用し、段階的で制御可能なワークフローを保証しています。

このため frontmatter の `description` は「AIが呼び出すトリガー」ではなく、**スキル一覧での識別・説明用のメタ情報**として機能します。

### frontmatter フィールドと IDE 互換性

スキルの中核は `name` / `description` と Markdown 本文ですが、各スキルの frontmatter には Claude Code 向けの拡張フィールドも含まれます。これらは Claude Code で機能し、他 IDE（Cursor / Codex / Antigravity）での扱いは各 IDE の仕様に依存します（本プロジェクトでは未検証）。

- **`disable-model-invocation`**: AIエージェントによる自動呼び出しを無効化（前述）。全 25 スキルに設定。
- **`allowed-tools`**: スキルに必要な最小限のツール権限を明示。25 スキル中 24（`c-001-implement-task` のみ未指定）。
- **`argument-hint`**: コマンド引数のヒント（例 `[task-id]`）。引数を取る B/C/D 系の 8 スキルに設定。
- **`context: fork`**: Claude Code でレビュー系スキル（`a-006` / `a-015` / `b-005` / `d-001`）を別コンテキストで実行させる指定。メインの作業文脈を汚さずに整合性チェックを行うために採用。

### テンプレートは記入欄中心、詳細は reference

`templates/` のテンプレートは**記入欄＋簡潔なヒント＋例**を中心に構成し、長大な HTML コメント解説は持たせません。生成される docs はステークホルダーと AI coding が読む成果物であり、大量の解説コメントが残ると合意・実装の両方でノイズになるためです。

原則・理論・ベストプラクティス・用語定義などの詳しい解説は、各スキルの `reference/`（例: `a-002` の `hearing-questions.md`、`a-002b` の `user-stories-guide.md`、`a-004` の `event-storming-guide.md` / `ubiquitous-language-guide.md`）に置き、テンプレートのコメントからはパスで参照します。テンプレートを記入するときに必要なら参照すればよく、生成 docs はクリーンに保たれます。

> 設計フェーズ（`04-design/` 配下、`a-007`〜`a-014` が生成）の一部テンプレートは、まだ解説コメントが厚い状態です。これらの圧縮は今後のフォローアップ対象です。

### スキルの評価（evals）

最重要スキル（`a-002-initialize-project` / `a-006-review-requirements-domain`）には、[skill-creator 流](https://agentskills.io/skill-creation/evaluating-skills)の評価用テストケースを `skills/{name}/evals/evals.json` として同梱しています（入力フィクスチャは `evals/files/`）。スキル改修が改善か改悪かを、感覚ではなく数値（合格率・トークン・時間）で判断するためのものです。

- **評価スコープは出力品質のみ**: トリガー（discovery）精度は測定しません。全スキルが `disable-model-invocation: true` の明示呼び出し設計（前述）のため、評価対象になり得ないからです。
- **実行方法**: ケースごとに fresh session の隔離サブエージェント（Claude Code のサブエージェント等）で、with-skill / without-skill の 2 構成を実行して比較します。実行結果（`grading.json` / `timing.json` / `benchmark.json`）はリポジトリルート直下の `{skill-name}-workspace/iteration-N/` に生成します（gitignore 済み）。**workspace を `skills/` 配下に作らないでください**（`/a-002` 等の短縮参照が前方一致で解決されるため、リポジトリ整合性チェックが壊れます）。
- **ベースラインが正**: 確定した基準値は `skills/{name}/evals/baseline.json` にコミットします（計測日・モデル・iteration 数・yodogawa CLI バージョンを併記）。更新するときは eval を再実行し、新しい数値を転記して同一 PR でコミットします。
- **PR 運用**: `a-002` / `a-006` の SKILL.md・参照 reference・関連テンプレートを変更する PR では eval を再実行し、「eval 再実行済み（pass rate X/Y、baseline 比 ±Z）」を PR 本文に記載してください。baseline から悪化した場合はマージ前に原因を調査します。
- **配布物には含めない**: `evals/` は開発用資産のため、`skills/.npmignore` で npm パッケージから除外しています。

---

## ライセンス

[MIT License](LICENSE) — Copyright (c) 2025-2026 tkysi-mi
