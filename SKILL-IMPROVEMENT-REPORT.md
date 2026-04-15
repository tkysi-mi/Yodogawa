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

docs/project/requirements/ にプロジェクト要件ドキュメントを作成する。

## 前提
- `docs/project/requirements/` が存在すること（なければ `/setup-docs` を先に実行）

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
