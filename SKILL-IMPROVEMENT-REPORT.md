# Yodogawa スキル改善レポート

> 対象: `.windsurf/workflows/` 配下の全22ワークフロー
> 評価基準: Claude Code Skills Best Practices, Anthropic Agent Skills Best Practices
> 作成日: 2026-03-24

---

## エグゼクティブサマリー

Yodogawaは「仕様駆動開発ワークフロー集」として優れた構想を持つが、現行のスラッシュコマンド群はClaude Code Skills仕様の進化に追随できていない。**ベストプラクティスとの乖離が22項目中18項目で確認された。** 以下の3つの構造的問題が最も深刻である：

1. **フォーマットの非準拠** — YAML frontmatterがWindsurf固有仕様であり、Claude Code `SKILL.md` 標準と互換性がない
2. **過剰なコンテキスト消費** — 平均200行超のワークフローが多く、500行上限を超えるファイルも存在（c-002: 1000行超）
3. **段階的開示の欠如** — 参照ファイルへの分離がなく、毎回全文がコンテキストにロードされる

**大胆な提言: 現行のフラットなMarkdownファイル構成から、SKILL.md + 参照ファイル構成への全面移行を推奨する。** これはリファクタリングではなく、アーキテクチャの再設計である。

---

## 1. 構造・フォーマットの問題

### 1.1 YAML Frontmatterの非準拠

**現状:**

```yaml
---
description: プロジェクトのシステム概要・機能要件...
auto_execution_mode: 1
---
```

**ベストプラクティス（Claude Code SKILL.md標準）:**

```yaml
---
name: initialize-project
description: プロジェクトの要件をヒアリングしドキュメントを作成する。要件定義、機能定義、ユーザーストーリー作成時に使用。
disable-model-invocation: true
---
```

**問題点:**

| 項目 | 現状 | 推奨 |
|:--|:--|:--|
| `name` フィールド | 欠如（ファイル名で代用） | 必須。小文字・ハイフンのみ、64文字以内 |
| `description` | 長文（実装詳細を含む） | 「何をするか」+「いつ使うか」の2文構成 |
| `auto_execution_mode` | Windsurf固有フィールド | `disable-model-invocation` に置換 |
| `allowed-tools` | 未定義 | 各スキルの必要最小ツールを明示 |
| `context` | 未定義 | 重い処理は `context: fork` でサブエージェント化 |
| `argument-hint` | 未定義 | `[task-id]` 等の引数ヒントを追加 |

**根拠:** Anthropic公式ドキュメントより — 「`description`フィールドはスキル発見を有効にし、スキルが何をするか、いつ使用するかの両方を含める必要があります。」「常に三人称で書いてください。」

**影響度: 致命的** — Claude Codeでの自動発見・自動トリガーが機能しない。

### 1.2 descriptionの品質

**悪い例（現状 a-002）:**

```yaml
description: プロジェクトのシステム概要・機能要件・非機能要件・ユーザーストーリーを体系的にヒアリングし、詳細なドキュメントを作成するワークフロー
```

**良い例（推奨）:**

```yaml
description: プロジェクトの要件を対話形式で収集し、要件定義書を生成する。新規プロジェクト開始時、または要件が未整備の場合に使用。
```

**改善ポイント:**

- 「ワークフロー」という自己言及を削除（Anthropicベストプラクティス: 三人称で書く）
- 「いつ使うか」のトリガー条件を追加
- 実装詳細（「体系的にヒアリング」）を削除し、効果（「要件定義書を生成する」）に集中

### 1.3 ファイル配置の非準拠

**現状:**

```
.windsurf/workflows/a-002-InitializeProject.md  # フラットファイル
```

**Claude Code標準:**

```
.claude/skills/initialize-project/
├── SKILL.md                    # メイン指示（500行以内）
├── templates/                  # テンプレートファイル群
│   ├── system-overview.md
│   └── user-stories.md
├── examples/                   # 出力例
│   └── sample-requirements.md
└── scripts/                    # 検証スクリプト
    └── validate-requirements.sh
```

**根拠:** 「SKILL.mdは、オンボーディングガイドの目次のように、Claudeを詳細な資料に指し示す概要として機能します。」（Anthropic Best Practices — 段階的開示パターン）

---

## 2. コンテンツ品質の問題

### 2.1 コンテキスト消費の過剰

**ベストプラクティスの原則:** 「コンテキストウィンドウは公共の財産です。」「SKILL.mdボディを最適なパフォーマンスのために500行以下に保つ。」

**現状の行数分析:**

| ファイル | 行数 | 判定 | 問題 |
|:--|:--|:--|:--|
| c-002-UpdateDocumentation | 1000+ | **超過** | 500行上限の2倍超 |
| c-001-ImplementTask | 521 | **超過** | 段階的開示で分割すべき |
| b-003-CreateTaskResearch | 453 | 要注意 | 参照ファイル分離推奨 |
| b-005-ReviewTask | 324 | 要注意 | チェック項目を外部化可能 |
| a-002-InitializeProject | 284 | 要注意 | テンプレート参照で短縮可能 |
| a-010-DefineDesignSystem | 211 | OK | ただし外部参照推奨 |
| その他 | 78-171 | OK | — |

**大胆な意見: c-002とc-001は、現状のままでは実用的でない。** コンテキストウィンドウの2-5%を1つのスキルが占有することは、他のスキルや会話履歴を圧迫する。

### 2.2 Claudeが既に知っていることの過剰説明

**アンチパターン例（b-003より）:**

```markdown
- Grep / find / IDE の検索で、類似ロジックやコンポーネントを洗い出す。

  ```bash
  rg "keyword" src/
  ```

```

**問題:** Claudeは `rg` コマンドの使い方を既に知っている。「Claudeが既に持っていないコンテキストのみを追加してください。」（Anthropic Best Practices）

**推奨:** 検索方法の指示を削除し、「何を探すか」のみを記載：
```markdown
- 類似ロジック・再利用候補を洗い出す（バリデーション、エラーハンドリング、APIクライアント等）
```

### 2.3 自由度の不適切な設定

Anthropic Best Practicesでは「タスクの脆弱性と可変性のレベルに特異性のレベルを合わせる」ことを推奨している。

**過剰に制約的な例（a-002 ヒアリング項目）:**

現状では30以上の具体的質問項目が列挙されている。これは**中〜高自由度が適切なタスク**（ヒアリングはコンテキスト依存で、プロジェクトごとに最適な質問が異なる）に対して、**低自由度の指示**を与えている。

**推奨:** ヒアリングの「観点」のみを示し、具体的な質問はClaudeの判断に委ねる：

```markdown
## ヒアリング観点
- システム概要（目的、対象ユーザー、ビジネス価値）
- 機能要件（実装済み、計画中、優先度）
- 非機能要件（性能、セキュリティ、可用性 — 数値化必須）
- ユーザーストーリー（役割、目的、理由の形式）

抽象表現（「使いやすい」等）は数値化を要求すること。
```

**逆に、制約が不足している例（c-001 Git操作）:**

```markdown
- Git コミット
```

Gitコミットメッセージのフォーマット、ブランチ戦略等は**低自由度が適切**（一貫性が重要）だが、現状は具体性が不足している箇所がある。

### 2.4 時間に敏感な情報

現在のワークフロー群には時間依存の情報は確認されなかった。この点は良好。

---

## 3. アーキテクチャの問題

### 3.1 段階的開示（Progressive Disclosure）の不在

**これが最も根本的な問題である。**

現状：全ワークフローがフラットな単一Markdownファイル。Claude Codeがスキルをロードすると、全文がコンテキストに投入される。

**Anthropic推奨パターン:**

```
SKILL.md              → 概要とナビゲーション（常にロード）
├── reference.md      → 必要時のみロード
├── templates/        → 必要時のみロード
└── scripts/          → 実行のみ、コンテキスト消費なし
```

**具体的な改善案（b-003-CreateTaskResearch を例に）:**

**Before（453行の単一ファイル）:**

```
b-003-CreateTaskResearch.md  # 全文ロード
```

**After（段階的開示）:**

```
create-task-research/
├── SKILL.md                          # 80行: 概要・手順・完了条件
├── reference/
│   ├── investigation-checklist.md    # 調査チェックリスト
│   ├── tech-comparison-template.md   # 技術比較表テンプレート
│   └── risk-assessment-guide.md      # リスク評価ガイド
└── examples/
    └── sample-research.md            # 出力例
```

**SKILL.md:**

```markdown
---
name: create-task-research
description: タスク実装前の技術調査を実行し、ベストプラクティス・既存コード・リスクを記録する。タスク定義完了後、実装計画作成前に使用。
disable-model-invocation: true
argument-hint: [task-id]
---

# タスクリサーチ作成

## 手順

1. `docs/tasks/$ARGUMENTS/a-definition.md` を読み、調査観点を整理
2. 既存コード・再利用候補を調査
3. 外部情報・ベストプラクティスを調査
4. 技術選定（比較表作成） → [tech-comparison-template.md](reference/tech-comparison-template.md)参照
5. リスク評価 → [risk-assessment-guide.md](reference/risk-assessment-guide.md)参照
6. `b-research.md` に記録

## 完了条件
- [ ] 調査チェックリストの全項目を網羅
- [ ] 技術選定に比較根拠あり
- [ ] リスクに軽減策が記載されている

## エスカレーション
- 技術選定で判断不能 → ユーザーに選択肢を提示
- 既存コードに重大な品質問題 → 警告を発する
```

### 3.2 テンプレートの二重管理

**現状:** テンプレートは `.windsurf/templates/` に格納され、ワークフロー内で `cp` コマンドでコピーする設計。

**問題:** スキルディレクトリ内にテンプレートを同梱すれば、`${CLAUDE_SKILL_DIR}` 変数で参照でき、パスのハードコーディングが不要になる。

**推奨:**

```markdown
テンプレートを `${CLAUDE_SKILL_DIR}/templates/` からコピー:
```bash
cp "${CLAUDE_SKILL_DIR}/templates/b-research.md" "docs/tasks/$0/b-research.md"
```

### 3.3 ワークフロー間依存の暗黙性

**現状:** `Call /workflow-name` パターンで相互参照しているが、これはWindsurf固有の連携機構であり、Claude Codeでは機能しない。

**推奨:** 各スキルの `前提` セクションに、依存スキルを明示的に記載し、Claude Codeでは `/skill-name` で呼び出す形に統一。または、オーケストレーション用の親スキルを作成：

```markdown
---
name: design-phase
description: プロジェクト設計フェーズ全体を順次実行する。新規プロジェクトの設計開始時に使用。
disable-model-invocation: true
---

以下のスキルを順次実行:
1. /setup-doc-structure
2. /initialize-project
3. /create-scenarios
...（ユーザー確認を挟みながら進行）
```

---

## 4. 命名規則の問題

### 4.1 ファイル名の非準拠

**現状:** `a-002-InitializeProject.md`（PascalCase + 番号プレフィックス）

**Claude Code標準:** スキル名は「小文字、数字、ハイフンのみ」（64文字以内）

**Anthropic推奨:** 動名詞形（verb + -ing）が最も明確。

| 現状 | 推奨（動名詞形） | 代替（アクション形） |
|:--|:--|:--|
| a-001-SetupDocStructure | setting-up-docs | setup-docs |
| a-002-InitializeProject | initializing-project | initialize-project |
| a-003-CreateScenarios | creating-scenarios | create-scenarios |
| b-001-CreateTaskDirectory | creating-task-directory | create-task-dir |
| b-003-CreateTaskResearch | researching-task | research-task |
| c-001-ImplementTask | implementing-task | implement-task |

**大胆な意見:** 番号プレフィックス（a-001, b-002等）は**削除すべき**。理由：

1. Claude Codeのスキル名に番号は意味を持たない（自動ソートされない）
2. ユーザーが `/a-001-setup-doc-structure` と入力するのは非現実的
3. 実行順序はオーケストレーション用親スキルで管理すべき

ただし、フェーズの概念（設計/タスク管理/実装）は有用であるため、ディレクトリ構造で表現する：

```
.claude/skills/
├── design/           # A フェーズ
│   ├── setup-docs/
│   ├── initialize-project/
│   └── ...
├── task-management/  # B フェーズ
│   ├── create-task-dir/
│   ├── define-task/
│   └── ...
└── implementation/   # C フェーズ
    ├── implement-task/
    └── update-docs/
```

### 4.2 一貫性のない用語

**問題:** 同じ概念に複数の用語を使用している。

| 概念 | 使用されている用語 |
|:--|:--|
| タスクディレクトリ | 「タスクディレクトリ」「タスクフォルダ」 |
| ワークフロー | 「ワークフロー」「コマンド」「スキル」 |
| ドキュメント | 「ドキュメント」「ドキュメンテーション」「資料」 |

**根拠:** 「1つの用語を選択して、スキル全体で使用してください。一貫性はClaudeが指示を理解して従うのに役立ちます。」（Anthropic Best Practices）

---

## 5. 欠落している機能

### 5.1 $ARGUMENTS（引数）の未活用

**現状:** ワークフローは引数を受け取らず、毎回対話でタスクIDやパスを確認している。

**推奨:**

```yaml
---
name: implement-task
argument-hint: [task-id]
---

`docs/tasks/$ARGUMENTS/` のタスクを実装する。
```

これにより `/implement-task task000003-auth-login` のように直接指定可能になり、対話のラウンドトリップが削減される。

### 5.2 動的コンテキスト注入（`!` コマンド）の未活用

**Claude Code固有機能:** `` !`command` `` 構文でシェルコマンドの結果をスキル内容に事前注入できる。

**活用例（b-005-ReviewTask）:**

```markdown
## 現在のタスク状態
- タスク定義: !`cat docs/tasks/$0/a-definition.md | head -20`
- リサーチ: !`cat docs/tasks/$0/b-research.md | head -20`
- 実装計画: !`cat docs/tasks/$0/c-implementation.md | head -20`
```

### 5.3 サブエージェント実行（`context: fork`）の未活用

**推奨スキル:** 以下は `context: fork` + `agent: Explore` でサブエージェント化すべき：

| スキル | 理由 |
|:--|:--|
| a-006 (ReviewRequirementsDomain) | 読み取り専用のレビュー作業 |
| a-015 (ReviewDesign) | 読み取り専用のレビュー作業 |
| b-005 (ReviewTask) | 読み取り専用のレビュー作業 |
| b-003 (CreateTaskResearch) | 調査はメイン会話と独立 |

```yaml
---
name: review-design
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---
```

### 5.4 フィードバックループの不足

**Anthropic推奨:** 「バリデータを実行 → エラーを修正 → 繰り返す。このパターンは出力品質を大幅に改善します。」

**現状:** c-001にテスト実行の言及はあるが、明示的な「検証→修正→再検証」ループが構造化されていない。

**推奨:**

```markdown
## 実装ステップごとのフィードバックループ

1. テストを先に書く（TDD）
2. 実装する
3. テスト実行: `npm test -- --related $FILE`
4. **テスト失敗の場合:**
   - エラーメッセージを分析
   - 実装を修正
   - ステップ3に戻る
5. **テスト成功の場合のみ** → 次のステップへ進む
```

### 5.5 検証可能な中間出力の欠如

**Anthropic推奨:** 「計画-検証-実行」パターン。複雑なタスクでは、実行前に計画をJSON等の構造化形式で出力し、バリデータで検証する。

**推奨（b-002 タスク定義に適用）:**

```markdown
1. ヒアリング結果を `task-plan.json` に構造化出力
2. 検証: `python ${CLAUDE_SKILL_DIR}/scripts/validate-task-plan.py task-plan.json`
3. 検証パス後に `a-definition.md` を生成
```

---

## 6. クロスIDE互換性の課題

### 6.1 現状の問題

Yodogawaは4つのIDE（Windsurf, Cursor, Antigravity, Claude Code）をサポートするが、現在のスキル設計はWindsurf中心。

**IDE間のスキル仕様差異:**

| 機能 | Windsurf | Cursor | Claude Code |
|:--|:--|:--|:--|
| スキルパス | `.windsurf/workflows/` | `.cursor/commands/` | `.claude/skills/` |
| Frontmatter | `auto_execution_mode` | 非標準 | `disable-model-invocation` 等 |
| 引数 | なし | `$ARGUMENTS` | `$ARGUMENTS`, `$0`, `$1` |
| 動的注入 | なし | なし | `` !`command` `` |
| サブエージェント | なし | なし | `context: fork` |
| 段階的開示 | なし | なし | ディレクトリ構造 |

**推奨:** CLIツール（`bin/cli.js`）にIDE別の変換ロジックを実装し、**ソースはClaude Code SKILL.md標準で管理**する。理由：

1. Claude Code標準が最も機能が豊富
2. 他IDEへのダウングレード（機能削除）は容易だが、アップグレードは困難
3. Agent Skills Open Standard準拠で将来性が高い

---

## 7. 個別ワークフローの改善優先度

### Tier 1: 即時対応（構造的問題）

| ワークフロー | 問題 | 推奨アクション |
|:--|:--|:--|
| c-002 (UpdateDocumentation) | **1000行超** | 3-4ファイルに分割（タスクDoc更新/プロジェクトDoc更新/検証） |
| c-001 (ImplementTask) | **521行** | 実行フロー/テスト戦略/Git操作を分離 |
| b-003 (CreateTaskResearch) | **453行** | 調査テンプレート/リスク評価を参照ファイルに |

### Tier 2: 品質改善（コンテンツ問題）

| ワークフロー | 問題 | 推奨アクション |
|:--|:--|:--|
| a-002 (InitializeProject) | ヒアリング項目が過剰 | 観点のみ提示し、Claudeの判断に委ねる |
| b-002 (CreateTaskDefinition) | テンプレートの全文埋め込み | テンプレートを参照ファイルに分離 |
| b-005 (ReviewTask) | チェック項目が冗長 | チェックリストを外部ファイルに |

### Tier 3: 機能拡張（新機能追加）

| 対象 | 推奨アクション |
|:--|:--|
| 全スキル | `$ARGUMENTS` サポート追加 |
| レビュー系（a-006, a-015, b-005） | `context: fork` でサブエージェント化 |
| 全スキル | `allowed-tools` の明示的定義 |
| オーケストレーション | フェーズ単位の親スキル作成 |

---

## 8. 推奨アクションプラン

### Phase 1: フォーマット標準化（1-2日）

1. 全ファイルのYAML frontmatterをClaude Code標準に変換
2. `name`, `description`, `disable-model-invocation` を追加
3. `description` を「何をするか + いつ使うか」の2文構成に修正
4. ファイル名を小文字ハイフン形式に変更

### Phase 2: アーキテクチャ再設計（3-5日）

1. `.claude/skills/` ディレクトリ構造に移行
2. 500行超のスキルを段階的開示構造に分割
3. テンプレートをスキルディレクトリ内に移動
4. `$ARGUMENTS` サポートを全スキルに追加

### Phase 3: 高度な機能活用（2-3日）

1. レビュー系スキルに `context: fork` を適用
2. 動的コンテキスト注入（`!` コマンド）を活用
3. 検証スクリプトをスキルにバンドル
4. フィードバックループの構造化

### Phase 4: CLIツール更新（1-2日）

1. `bin/cli.js` にClaude Code SKILL.md → 各IDE形式の変換を実装
2. ソース管理をClaude Code標準に一本化
3. テスト追加

---

## 9. 参考文献

1. **Claude Code Skills Documentation** — <https://code.claude.com/docs/en/skills>
   - SKILL.md構造、frontmatter仕様、段階的開示、サブエージェント実行
2. **Anthropic Agent Skills Best Practices** — <https://platform.claude.com/docs/ja/agents-and-tools/agent-skills/best-practices>
   - 簡潔性原則、自由度設定、命名規則、フィードバックループ、評価駆動開発
3. **Claude Code Desktop Skills** — <https://code.claude.com/docs/en/desktop#use-skills>
   - デスクトップ環境でのスキル活用
4. **Agent Skills Open Standard** — <https://agentskills.io>
   - クロスツール互換性の標準仕様

---

## 付録A: 全ワークフロー改善マッピング

| # | 現ファイル名 | 推奨スキル名 | 行数 | 分割要否 | `$ARGUMENTS` | `context:fork` |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | a-001-SetupDocStructure | setup-docs | 100 | 不要 | 不要 | 不要 |
| 2 | a-002-InitializeProject | initialize-project | 284 | 推奨 | 不要 | 不要 |
| 3 | a-003-CreateScenarios | create-scenarios | 141 | 不要 | 不要 | 不要 |
| 4 | a-004-DefineDomainModel | define-domain-model | 143 | 不要 | 不要 | 不要 |
| 5 | a-005-CreateDomainDiagram | create-domain-diagram | 120 | 不要 | 不要 | 不要 |
| 6 | a-006-ReviewRequirementsDomain | review-requirements | 144 | 不要 | 不要 | **推奨** |
| 7 | a-007-DefineTechStack | define-tech-stack | 129 | 不要 | 不要 | 不要 |
| 8 | a-008-DefineRepositoryStructure | define-repo-structure | 128 | 不要 | 不要 | 不要 |
| 9 | a-009-DefineScreenDesign | define-screen-design | 129 | 不要 | 不要 | 不要 |
| 10 | a-010-DefineDesignSystem | define-design-system | 211 | 推奨 | 不要 | 不要 |
| 11 | a-011-DefineDataModel | define-data-model | 133 | 不要 | 不要 | 不要 |
| 12 | a-012-DefineAPISpec | define-api-spec | 131 | 不要 | 不要 | 不要 |
| 13 | a-013-DefineArchitecture | define-architecture | 127 | 不要 | 不要 | 不要 |
| 14 | a-014-DefineInfrastructure | define-infrastructure | 129 | 不要 | 不要 | 不要 |
| 15 | a-015-ReviewDesign | review-design | 140 | 不要 | 不要 | **推奨** |
| 16 | b-001-CreateTaskDirectory | create-task-dir | 78 | 不要 | [task-slug] | 不要 |
| 17 | b-002-CreateTaskDefinition | define-task | 171 | 不要 | [task-id] | 不要 |
| 18 | b-003-CreateTaskResearch | research-task | 453 | **必須** | [task-id] | **推奨** |
| 19 | b-004-CreateTaskImplementation | plan-implementation | 99 | 不要 | [task-id] | 不要 |
| 20 | b-005-ReviewTask | review-task | 324 | 推奨 | [task-id] | **推奨** |
| 21 | c-001-ImplementTask | implement-task | 521 | **必須** | [task-id] | 不要 |
| 22 | c-002-UpdateDocumentation | update-docs | 1000+ | **必須** | [task-id] | 不要 |

---

## 付録B: 理想的なSKILL.md例（initialize-project）

```markdown
---
name: initialize-project
description: プロジェクトの要件を対話形式で収集し、要件定義書を生成する。新規プロジェクト開始時、または要件が未整備の場合に使用。
disable-model-invocation: true
argument-hint: [project-name]
---

# プロジェクト初期化

docs/project/01-requirements/ にプロジェクト要件ドキュメントを作成する。

## 前提
- `docs/project/01-requirements/` が存在すること（なければ `/setup-docs` を先に実行）

## 手順

### 1. コードベース分析
- 既存コードがあれば自動分析し、要件の初期案を提示

### 2. ヒアリング（以下の観点）
- **システム概要**: 目的、対象ユーザー、ビジネス価値、成功指標
- **機能要件**: 実装済み/計画中の機能一覧、優先度
- **非機能要件**: 性能・セキュリティ・可用性（必ず数値化）
- **ユーザーストーリー**: [役割]として[目的]がしたい、なぜなら[理由]

抽象表現（「使いやすい」等）は具体的な数値・基準に変換すること。

### 3. ドキュメント生成
テンプレートを使用: [templates/](templates/)

生成ファイル:
- `01-system-overview.md`
- `02-features-implemented.md`
- `03-features-planned.md`
- `04-non-functional-requirements.md`
- `05-user-stories.md`

### 4. レビュー
生成したドキュメントをユーザーに提示し、修正を反映。

## 完了条件
- [ ] 全5ファイルが作成されている
- [ ] 抽象表現がない（数値・基準で記述）
- [ ] ユーザーストーリーが[役割/目的/理由]形式
- [ ] ユーザーが内容を承認

## エスカレーション
- 目的が不明確 → 具体化を要求
- スコープが過大 → フェーズ分割を提案
```

**この例は現行の284行から約50行に削減されている。** Claudeが既に知っている情報（ヒアリング手法、Markdownの書き方等）を省略し、プロジェクト固有のルール（数値化必須、テンプレート構造等）のみを残した結果である。

---

## 第2部: 2026-04 追補 — 現状再評価と深化研究

## 10. 現状の再評価（2026-04-19 時点）

本レポート初版（2026-03-24）以降、Yodogawa は **既に大規模なアーキテクチャ移行を完了**している。追補にあたり事実確認した結果、初版の批判の多くは既に解消されている。

### 10.1 初版指摘事項の解消状況

| 初版の指摘 | 2026-04 時点の現状 | 判定 |
|:--|:--|:--|
| `.windsurf/workflows/` フラット構成 | `.claude/` と `.agents/` が配置先、ソースは `skills/{name}/SKILL.md` | **解消** |
| `auto_execution_mode` 等 Windsurf 固有 frontmatter | `name`, `description`, `disable-model-invocation`, `argument-hint`, `allowed-tools` の Claude Code 標準に移行済 | **解消** |
| PascalCase ファイル名 (`a-002-InitializeProject.md`) | kebab-case ディレクトリ (`a-002-initialize-project/SKILL.md`) | **解消** |
| c-002 が 1000 行超、c-001 が 521 行 | c-002 = **159 行**, c-001 = **186 行**。最長でも 186 行 | **解消** |
| 500 行上限超過 | 全 22 スキル中、最長が 186 行。平均 **109 行** | **解消** |
| `$ARGUMENTS` 未活用 | c-001 ほか複数が `argument-hint` 付きで対応済 | **解消** |
| description が実装詳細を含み長文 | 多くが「何を／いつ使うか」の 2 文構成に改訂済 | **解消（一部要確認）** |

### 10.2 初版と現状の方針対立点

**番号プレフィックス削除の推奨 → 撤回。**

初版 §4.1 は `a-001` 等の番号プレフィックスを削除し、フェーズはディレクトリ構造（`design/`, `task-management/`, `implementation/`）で表現することを推奨した。しかし本プロジェクトでは番号プレフィックス維持方針が確立している。撤回理由：

1. **順序性の可視化**: 仕様駆動開発は A→B→C の順序が本質で、ファイル名で順序が自明になる価値は大きい
2. **既存ユーザーの参照壊れ防止**: `Call /a-002-initialize-project` 形式の呼び出しが配布済インストール先に存在
3. **番号はフラットな kebab-case と両立する**: Claude Code 標準（小文字・数字・ハイフン、64 文字）に `a-002-initialize-project` は違反しない

### 10.3 未解消の課題（残存する改善余地）

| 課題 | 現状 | 優先度 |
|:--|:--|:--|
| **段階的開示の活用は限定的** | c-001 が `reference/implementation-loop.md` を外出ししているのみ。他スキルは単一ファイル | 中 |
| **`context: fork` 未導入** | レビュー系スキル（a-006, a-015, b-005）でサブエージェント化の余地 | 中 |
| **評価テストの不在** | スキルが期待通り動くかを検証する仕組みが未整備 | **高** |
| **MCP tool の `allowed-tools` 明示欠如** | 現状は Claude Code 標準ツールのみ列挙 | 低 |
| **description の英日ハイブリッド化** | 日本語のみ → 英語クエリからの discovery 精度低下 | 中 |

以降、未解消課題および新たに発見された論点を §11〜§18 で扱う。

---

## 11. 評価駆動開発（Evaluation-Driven Development）

### 11.1 なぜ評価が必要か

スキルは「書けば動く」ものではない。description が discovery に失敗する・手順が曖昧でモデルが迷走する・テンプレート参照が壊れる — これらは動かして初めて判る。Anthropic 公式は **実装前に評価シナリオを定義する** Evaluation-Driven Development を推奨している（[Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)）。

### 11.2 Yodogawa への適用モデル

**最小構成の評価フレームワーク:**

```
skills/{name}/
├── SKILL.md
├── reference/
└── evals/
    ├── cases/
    │   ├── 01-happy-path.md         # 期待されるトリガー入力
    │   ├── 02-missing-prereq.md     # 前提不足ケース
    │   └── 03-ambiguous-input.md    # 曖昧入力ケース
    ├── golden/                      # 期待出力スナップショット
    │   ├── 01-happy-path.md
    │   └── ...
    └── run.sh                       # 実行スクリプト
```

各 case ファイルは以下の構造:

```markdown
---
trigger_prompt: "/a-002-initialize-project my-new-app"
expected_skill: a-002-initialize-project  # discovery 精度テスト
expected_files:
  - docs/project/01-requirements/01-system-overview.md
  - docs/project/01-requirements/05-user-stories.md
acceptance:
  - 5 ファイル全てが生成される
  - 抽象表現（「使いやすい」等）がない
  - ユーザーストーリーが [役割/目的/理由] 形式
---
```

### 11.3 評価の 3 階層

| 階層 | 対象 | 実装方法 | 頻度 |
|:--|:--|:--|:--|
| **L1: Discovery 評価** | description で適切に選択されるか | 類似クエリを 10 個入れて、Claude が正しいスキルを選択する率を測定 | PR 毎 |
| **L2: 実行評価** | 手順通りに動くか（ファイル生成・形式） | `evals/run.sh` でスクリプト実行 → 差分検証 | PR 毎 |
| **L3: 品質評価（LLM-as-judge）** | 生成物の意味的品質 | 別の Claude セッションで評価基準を与えて採点 | リリース前 |

### 11.4 Regression 防止

`skills/{name}/evals/golden/` の expected output をスナップショットとしてコミット。新バージョンで SKILL.md を変更したら、golden との diff を人間がレビューしてから更新。Jest snapshot に相当する設計。

### 11.5 投資対効果

22 スキル × 3 ケース = 66 テストケース。各ケース 10 分の作成コスト = 11 時間。一度作れば、以降の全変更に対して自動検証が回る。特に **description のリライト時に discovery 精度が落ちていないか**を測れる価値は大きい。

---

## 12. Hooks 連携パターン

Hooks（`settings.json` / `settings.local.json`）は「決定論的自動実行」を担い、Skill は「判断が必要なプロセス」を担う。両者は独立した機構だが、以下のパターンで相補させられる。

### 12.1 Yodogawa に適用可能な 3 パターン

**パターン A: タスク完了時の自動レビュー起動**

```json
// settings.json
{
  "hooks": {
    "Stop": [
      {
        "matcher": ".*implement-task.*",
        "hooks": [
          { "type": "command", "command": "echo '実装が完了しました。/b-005-review-task で品質確認を推奨します。'" }
        ]
      }
    ]
  }
}
```

`c-001-implement-task` 実行後に `b-005-review-task` の起動を促す。Hook は **Claude にスキルを起動させることはできない**が、ユーザーへのリマインダとしては機能する。

**パターン B: タスクドキュメントの整合性自動検証**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/validate-task-docs.sh \"$CLAUDE_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

`a-definition.md` や `b-research.md` が編集されるたびに構造検証（必須セクション存在チェック等）を自動実行。

**パターン C: PreToolUse での危険操作ガード**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/guard-rm.sh \"$CLAUDE_COMMAND\""
          }
        ]
      }
    ]
  }
}
```

Yodogawa の `c-001-implement-task` は `rm` や `git reset` を含む可能性があり、タスクディレクトリ外を誤って削除するリスクがある。事前ガードで保護。

### 12.2 Hooks の配布

Yodogawa の CLI は現在 skills と templates のみをコピーしているが、`hooks/` ディレクトリを追加し、`.claude/settings.json` への merge を提案する設計に拡張可能。ただし **ユーザーの既存 settings を破壊しない配慮**（先に読み、diff を提示して承認を得る）が必須。

### 12.3 重要な制約

- **Hook から Skill は起動できない**。stdout に `/skill-name` を出しても Claude はそれを「会話」として解釈しない
- **Skill 内で Hook を登録することも不可**。Skill 実行中に shell を叩けるのは `allowed-tools` の Bash のみ
- したがって **一方向の補助関係**であり、自動パイプラインを組むなら親オーケストレータースキル（§3.3 の `design-phase`）の導入が現実的

根拠: [Automate workflows with hooks](https://code.claude.com/docs/en/hooks-guide), [Hooks reference](https://code.claude.com/docs/en/hooks)

---

## 13. Skill Discovery の精度最適化

### 13.1 Claude はどうスキルを選ぶか

Claude Code 内に「スキル選択アルゴリズム」は存在しない。起動時に全スキルの frontmatter（`name` + `description`）がシステムプロンプトに注入され、**ユーザー発話との意味マッチングを LLM が推論**して選ぶ。選ばれた後にのみ SKILL.md 本文がロードされる（遅延読み込み）。

これが意味すること:

1. **description の一字一句が発見精度を決める**。本文をいくら磨いても、description が弱いと呼ばれない
2. **全スキルの description が毎起動コンテキストに乗る**。22 スキル × 平均 120 文字の日本語 description ≒ **1,500〜2,000 tokens が固定消費**
3. **description 同士が似ていると混線する**。`a-010-define-design-system` と `a-009-define-screen-design` は人間でも区別が曖昧

### 13.2 description 改善の具体パターン

**Before（現状 a-010）:**

```yaml
description: デザインシステム（カラーパレット、タイポグラフィ、コンポーネント等）を定義する。
```

**After（トリガー語 + バイリンガル）:**

```yaml
description: Defines the design system (color palette, typography, spacing, component specs). Use when user requests 'design system', 'デザインシステム', 'デザイントークン', or starts UI component standardization.
```

改善点:

- **英語主旨 + 日本語トリガー語の併記** — 英語クエリから日本語クエリまで同一精度
- **使用タイミングの明示** — 「いつ」を具体的な動詞で記述
- **類似スキルとの差別化キーワード** — "component standardization" で `a-009-define-screen-design`（画面設計）と分離

### 13.3 日本語スキルのトークン効率

調査の結果、日本語は **1〜2 文字/token**、英語は **4 文字/token**（BPE 特性）。同じ意味を表現する description は日本語が英語の **2〜4 倍のトークンを消費**する。

Yodogawa の現状 description は日本語中心のため、起動時固定コストが英語 description の 2〜4 倍。1M context window では誤差だが、200K window（Sonnet 4 系）での運用や、将来のサブエージェント内並列実行ではボディブローとして効く。

**推奨: description は「英語主旨 + 日本語トリガー語のハイブリッド」**。本文は日本語のままで良い。

根拠: [Claude Multilingual Support](https://platform.claude.com/docs/en/build-with-claude/multilingual-support), [Language Model Tokenizers Introduce Unfairness (arXiv:2305.15425)](https://arxiv.org/pdf/2305.15425)

### 13.4 命名衝突の回避

Yodogawa の番号プレフィックスは `a-015-review-design` / `b-005-review-task` / `a-006-review-requirements-domain` と **review 系 3 種が存在**。description の when-to-use 節でスコープ差（「プロジェクト設計段階」vs「個別タスク」vs「要件とドメイン」）を **排他的に** 書き分ける必要がある。

---

## 14. コンテキストウィンドウ経済学（2026-04 実測）

### 14.1 2026-04 時点のモデル仕様

- **Claude Opus 4.6 / 4.7, Sonnet 4.6**: 1M トークン context（2026-03-13 GA）
- Opus 4.6 料金: $5 / $25 per MTok, Sonnet 4.6: $3 / $15 per MTok

### 14.2 Yodogawa 実測負荷（現行 22 スキル）

| 項目 | 行数 / トークン | 1M 比 |
|:--|:--|:--|
| 全スキル合計本文 | 2,408 行 ≒ **40K tokens** | 4.0% |
| 最長スキル (c-001) | 186 行 ≒ 3K tokens | 0.3% |
| **description 合計（常時ロード）** | 約 1,500〜2,500 tokens | 0.15〜0.25% |
| 平均スキル本文 | 109 行 ≒ 1.8K tokens | 0.18% |

**結論: 2026 年の 1M context 時代において、Yodogawa のコンテキスト消費は実用上問題ない水準。** 初版レポートの「500 行上限」は Sonnet 4（200K window, deprecated）時代の基準であり、現行モデルではより緩やかに運用可能。

ただし以下の局面では依然として最適化が効く:

1. **サブエージェント並列実行**: 複数エージェントが各々スキル集合を持つ場合、合算コストが嵩む
2. **長時間セッション**: 会話履歴の蓄積と合わせて context 汚染 → 判断精度低下
3. **コスト最適化**: $5/MTok × 22 スキル × 100 セッション/日 = 無視できない

### 14.3 Progressive Disclosure の新しい閾値

Anthropic 公式の「500 行」は 2025 年時点のガイドラインで、現在も生きている（[Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)）。ただし Yodogawa の全スキルは既にこの閾値を余裕でクリアしており、**本文分割の優先度は低い**。代わりに:

- **description の最適化（§13）** が最も費用対効果が高い
- **reference/ への外出しは、本当に「時々しか参照しない」情報だけ** にする（常に参照するなら分割する意味がない）

根拠: [1M context GA announcement](https://claude.com/blog/1m-context-ga), [Claude Context Windows docs](https://platform.claude.com/docs/en/build-with-claude/context-windows), [Agent Skills Open Standard](https://agentskills.io/specification)

---

## 15. クロス IDE 互換性の現実（2026-04）

### 15.1 Agent Skills Open Standard の確立

**2025-12-18 に Anthropic が Agent Skills Open Standard を公開**し、以下が SKILL.md 形式をサポート: Claude Code, Codex CLI, Gemini CLI, GitHub Copilot, Cursor, Cline, Windsurf, OpenCode。Yodogawa のソース形式（Claude Code SKILL.md 準拠）は **この標準に沿っており、将来性がある**。

### 15.2 各 IDE の現状比較

| 項目 | Claude Code | Cursor | Copilot | Codex / Antigravity | Windsurf |
|:--|:--|:--|:--|:--|:--|
| 設置先 | `.claude/skills/` | `.cursor/rules/` | `.github/instructions/` | `.agents/skills/` + `AGENTS.md` | `.windsurf/workflows/` + skills |
| Frontmatter | 標準 (name, description, allowed-tools, ...) | `.mdc` 独自 (globs, alwaysApply, description) | `applyTo`, `description`, `excludeAgent` | AGENTS.md は無、skills は標準 | Workflows 独自、Skills は標準 |
| 段階的開示 | 有 | glob で近似 | 無 | Skills は有 | Skills は有 |
| 条件付き読込 | description ベース | **glob ベース** | **applyTo ベース** | ディレクトリ階層 | 手動 `/name` |
| 引数 | `$ARGUMENTS` | 無 | 無 | 無 | 無 |

### 15.3 AGENTS.md のリポジトリ全体ルール

**2026 時点で `AGENTS.md` は Linux Foundation 傘下の Agentic AI Foundation が stewardship を担う標準**となり、60,000+ OSS プロジェクトで採用。Cursor / Codex / Antigravity / Claude Code / Amp / Factory / Jules が支持。

Yodogawa の `CLAUDE.md` は Claude Code 専用だが、**`AGENTS.md` を追加配置**することで Codex, Cursor, Antigravity からも認識される。ただし記述は簡素に保ち、詳細はスキルに委譲する設計が推奨。

### 15.4 配布戦略の再設計提案

現在の Yodogawa CLI は「Claude (`.claude/`) か Agents (`.agents/`) を選択してコピー」する。2026 の現実を踏まえた拡張案:

```
対話選択肢（提案）:
1. Claude Code のみ        → .claude/skills/
2. Cursor を含む           → .cursor/rules/ に変換コピー（.mdc 化）
3. 全 IDE 互換             → .agents/skills/ + AGENTS.md + .cursor/rules/ + .github/instructions/
4. Plugin Marketplace 配布 → .claude-plugin/ 構成へ変換（§16 参照）
```

根拠: [AGENTS.md (Agentic AI Foundation)](https://agents.md/), [Agent Skills Open Standard](https://agentskills.io/specification), [Cursor Rules Best Practices 2026](https://www.morphllm.com/cursor-rules-best-practices)

---

## 16. Plugin Marketplace 配布 vs npm 配布

### 16.1 トレードオフ

| 軸 | npm (現状) | Claude Code Plugin | ハイブリッド |
|:--|:--|:--|:--|
| 対応 IDE | 汎用（CLI で配置先選択） | Claude Code のみ | 両方 |
| インストール | `npm i -g yodogawa && yodogawa` | `/plugin add yodogawa/spec-driven` 1 コマンド | 両方 |
| 更新 | 手動 `npm update -g` | プラグインマネージャで半自動 | 両方 |
| バンドル可能物 | skills, templates, scripts | skills + **hooks** + **MCP server 設定** + commands | 両方 |
| Enterprise 対応 | 容易 | `extraKnownMarketplaces` で社内マーケット | — |
| バージョニング | Semver 標準 | Plugin manifest | — |

### 16.2 Plugin 化の最大の利点

**hooks と MCP 設定を skill と同梱できる**。例えば `c-001-implement-task` 用に `scripts/guard-rm.sh`（§12）を配布したい場合、npm 版ではユーザーが手動で `settings.json` に追記する必要があるが、Plugin 版なら `.claude-plugin/plugin.json` で一括登録できる。

### 16.3 推奨アプローチ: ハイブリッド配布

1. **ソースは Agent Skills Open Standard 準拠**（既に準拠済）
2. **npm 配布を継続**（Cursor, Copilot, Codex ユーザー向け）
3. **Claude Code Plugin を追加**（Claude Code ユーザーに最適化された体験を提供）
4. **CI で両方を自動生成**（package.json の `scripts.build:plugin` で `.claude-plugin/` 生成 → Plugin marketplace へ公開）

```
.claude-plugin/
├── plugin.json          # name, description, version, author
├── marketplace.json     # 配布メタデータ
└── (symlink to skills/ etc)
```

根拠: [Create and distribute a plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces), [Official Plugin Marketplace](https://github.com/anthropics/claude-plugins-official)

---

## 17. サブエージェント活用（`context: fork`）

### 17.1 対象スキルの再精査

初版 §5.3 で推奨されたレビュー系 3 スキルは、サブエージェント化の価値が高い。現在も未適用のため、以下のパターンを提案:

**a-015-review-design / a-006-review-requirements-domain / b-005-review-task:**

```yaml
---
name: a-015-review-design
description: ...
disable-model-invocation: true
allowed-tools: Read, Grep, Glob
context: fork
agent: Explore
---
```

効果:

1. **メイン会話のコンテキストを汚染しない**（レビューは読み取り専用なので戻り値だけが重要）
2. **並列実行が可能**（複数レビューを同時発火できる）
3. **集中した探索が可能**（Explore サブエージェントは検索に最適化）

### 17.2 b-003-create-task-research への適用

`b-003-create-task-research` は性質上「調査」であり、既存コード探索・外部情報収集を多く行う。現状 129 行だが、**調査結果のみが親に返ればよい**ため、サブエージェント化の恩恵が大きい。

```yaml
context: fork
agent: Explore
```

を加え、本文最後に「結論セクションのみ標準出力へ」と明記。

### 17.3 注意点

- サブエージェント内では `allowed-tools` の制約が SDK 実行時に異なる（[Agent Skills in the SDK](https://platform.claude.com/docs/en/agent-sdk/skills) 参照）
- 書き込みを行うスキル（a-002 等）にはサブエージェント化しない。fork した文脈で書き込まれた変更が親のコンテキストから見えなくなる問題を防ぐため

---

## 18. アンチパターン監査（現行 Yodogawa への適用）

Anthropic が明示するアンチパターン（[Best Practices](https://code.claude.com/docs/en/best-practices), [Common Mistakes](https://www.mindstudio.ai/blog/claude-code-skills-common-mistakes-guide)）を現行 Yodogawa に照らして監査した結果:

| アンチパターン | Yodogawa 現状 | 残存度 |
|:--|:--|:--|
| 500 行超 | 最長 186 行 | **解消** |
| 曖昧な description | 一部日本語のみ（§13） | 中 |
| 時間依存情報（「最新の」「最近の」等） | 未確認 | — |
| Windows パス（`\`）の混入 | Bash スクリプトは `/` 統一 | 低 |
| オプション過多（同じ目的の手段が複数） | 要確認 | 中 |
| Claude が既に知っている情報の冗長説明 | `rg` コマンド例など部分的に残存 | 中 |
| Trust-then-verify gap（テスト不足） | 評価フレームワーク不在（§11） | **高** |
| Kitchen-sink skill（複数目的） | 各スキル単一目的で設計済 | 低 |

**最重要の残存問題は §11「評価の不在」と §13「description のバイリンガル化」の 2 点。**

---

## 19. 破壊的変更の管理（push-based 配布固有のリスク）

### 19.1 Yodogawa の配布モデルの特殊性

一般的な npm パッケージは `require()` / `import` で**読み込まれる**。しかし Yodogawa の CLI は `.claude/` / `.agents/` にファイルを**コピー**する（push-based）。ユーザーがインストール後に **そのファイルを編集している可能性**があるため、通常の npm 破壊的変更管理よりリスクが高い。

### 19.2 リスクと対策

| リスク | 対策 |
|:--|:--|
| ユーザーが編集した skill を上書き | CLI に `--dry-run` と checksum 比較を実装。差分があれば `.bak.{timestamp}` に退避 |
| スキル rename による参照破壊 | 旧名の stub スキルを 1 メジャー残し、「{新名} に移動」と案内 |
| テンプレート形式変更 | `scripts/migrate/v{N}-to-v{N+1}.sh` を同梱し、CLI に `yodogawa migrate` サブコマンド追加 |
| 番号プレフィックス変更 | **行わない**（§10.2 に基づく方針） |

### 19.3 Semver + deprecate の適用

- **Major**: skill rename, frontmatter 必須項目変更, 依存スキル呼び出し規約変更
- **Minor**: 新規スキル追加, description 改善, reference/ 外出し
- **Patch**: typo 修正, 例の追加, バグ修正
- **Deprecation**: `npm deprecate yodogawa@1.x.x "v1 は 2026-06 にサポート終了。v2 へ移行: MIGRATION-v2.md"` を major リリース 1 ヶ月前に発行

### 19.4 推奨: MIGRATION.md 必須化

各 major リリースで `MIGRATION-v{N}.md` を必ず作成し、以下を記載:

1. 破壊的変更の一覧
2. 自動マイグレーション手順（`yodogawa migrate` の使い方）
3. 手動マイグレーションが必要なケース
4. ロールバック手順（`npm i -g yodogawa@{prev}`）

根拠: [npm deprecate docs](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/), [Semver Breaking Changes Guide 2026](https://www.pkgpulse.com/blog/semantic-versioning-guide-breaking-changes-2026)

---

## 20. 更新版アクションプラン（2026-04-19〜）

初版の Phase 1-4 は既に大部分が完了しているため、残課題に集中した新プランを提示する。

### Phase A: 評価基盤の構築（優先度: 高 / 工数: 3-5 日）

1. `skills/{name}/evals/` 構造を全 22 スキルに追加（最低 3 ケース）
2. `scripts/run-evals.sh` を実装（全スキルの golden 比較）
3. GitHub Actions で PR 毎に自動評価実行
4. README に評価結果バッジ追加

### Phase B: Discovery 精度向上（優先度: 高 / 工数: 1-2 日）

1. 全 22 スキルの description をバイリンガル化（英語主旨 + 日本語トリガー語）
2. 類似スキル間の排他的スコープを description に明記（`a-009` vs `a-010`, `a-015` vs `b-005` 等）
3. 評価ケースに「discovery 精度テスト」を追加

### Phase C: サブエージェント化（優先度: 中 / 工数: 1 日）

1. レビュー系 4 スキル（`a-006`, `a-015`, `b-003`, `b-005`）に `context: fork` + `agent: Explore` を追加
2. 評価で副作用がないことを確認

### Phase D: Hooks 同梱オプション（優先度: 中 / 工数: 2-3 日）

1. `hooks/` ディレクトリを新設し、タスク検証スクリプト群を配置
2. CLI に `--with-hooks` フラグ追加。`settings.json` への安全 merge を実装
3. 最小 3 つの hook テンプレート（PostToolUse 検証 / Stop リマインダ / PreToolUse ガード）

### Phase E: Plugin Marketplace 対応（優先度: 中 / 工数: 3-5 日）

1. `.claude-plugin/plugin.json` 生成スクリプトを `scripts/build-plugin.js` に実装
2. Claude Code official marketplace へ登録
3. npm / Plugin の両配布を README で案内

### Phase F: AGENTS.md 追加（優先度: 低 / 工数: 0.5 日）

1. リポジトリ root に `AGENTS.md` を追加（CLAUDE.md のサマリ版）
2. Codex / Antigravity / Cursor からも認識される状態に

---

## 21. 参考文献（追補）

### 公式ドキュメント

- [Extend Claude with skills — Claude Code](https://code.claude.com/docs/en/skills)
- [Skill authoring best practices — Anthropic API](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Agent Skills in the SDK — Anthropic API](https://platform.claude.com/docs/en/agent-sdk/skills)
- [Automate workflows with hooks — Claude Code](https://code.claude.com/docs/en/hooks-guide)
- [Hooks reference — Claude Code](https://code.claude.com/docs/en/hooks)
- [Create and distribute a plugin marketplace — Claude Code](https://code.claude.com/docs/en/plugin-marketplaces)
- [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Create custom subagents — Claude Code](https://code.claude.com/docs/en/sub-agents)
- [Claude Multilingual Support](https://platform.claude.com/docs/en/build-with-claude/multilingual-support)
- [Claude Context Windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)

### 標準仕様

- [Agent Skills Open Standard Specification](https://agentskills.io/specification)
- [AGENTS.md (Agentic AI Foundation)](https://agents.md/)

### 発表・分析記事

- [Anthropic: Extending Claude's capabilities with skills and MCP](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
- [Anthropic: Skills explained](https://claude.com/blog/skills-explained)
- [Anthropic: 1M context GA](https://claude.com/blog/1m-context-ga)
- [Anthropic Engineering: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Agent Skills: A First Principles Deep Dive (Lee Hanchung)](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [The Complete Guide to Testing Claude Code Skills](https://medium.com/@karkeralathesh/the-complete-guide-to-testing-claude-code-skills-with-the-skill-creator-1ae3821bd7b8)
- [Claude Code Skills 2.0: Evals, Benchmarks and A/B Testing](https://pasqualepillitteri.it/en/news/341/claude-code-skills-2-0-evals-benchmarks-guide)
- [Understanding Claude Code's Full Stack (alexop.dev)](https://alexop.dev/posts/understanding-claude-code-full-stack/)
- [Cursor Rules Best Practices 2026 (Morph)](https://www.morphllm.com/cursor-rules-best-practices)
- [Agent Skills Description Guide (smartscope)](https://smartscope.blog/en/blog/agent-skills-description-guide/)

### 研究論文

- [Language Model Tokenizers Introduce Unfairness (arXiv:2305.15425)](https://arxiv.org/pdf/2305.15425)

### 配布・Semver

- [npm deprecate docs](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/)
- [Semver Breaking Changes Guide 2026 (pkgpulse)](https://www.pkgpulse.com/blog/semantic-versioning-guide-breaking-changes-2026)
- [FOSSA: Rewriting npm Semver](https://fossa.com/blog/breaking-changes-rewriting-semantic-version/)

---

## 22. エグゼクティブサマリー（追補版）

初版レポートの 18 項目の指摘のうち、**11 項目は既に解消済み**（フォーマット準拠、ファイル名、行数、$ARGUMENTS 等）。残る主要課題は 3 点:

1. **評価フレームワークの不在** — スキルが期待通り動くかを検証する手段がない（§11）
2. **description のバイリンガル化** — 英語クエリからの discovery 精度と token 効率の両面で改善余地（§13）
3. **Hooks / Plugin / サブエージェント等の高度機能未活用** — Claude Code 固有の生産性向上手段を未導入（§12, §16, §17）

初版が提言した「アーキテクチャ再設計」は不要。現行のスキル体系は 2026-04 時点の Agent Skills Open Standard に準拠しており、**増分改善で十分**。番号プレフィックス削除の提言は撤回し、維持を推奨する。

**次の大きな一歩は「評価駆動開発」への移行。** これにより、今後のスキル追加・改訂が「動く保証」を持つ状態で進められる。Phase A の実行を最優先とする。
