---
name: plan-coding-and-verification
description: 事実確認(#1)・検証レディネス(#2)の後、コード実装に着手する前の計画段階で使用。Plan Mode で実装と検証を計画し、新規ブランチ作業とコミット先送りを徹底したいとき。実装・コミット・PR の前。
disable-model-invocation: false
allowed-tools: Read, Grep, Glob, Bash(gh issue view:*), Bash(gh pr view:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(npm ls:*), Agent, Write, ExitPlanMode, EnterPlanMode
argument-hint: "[issue番号 | 計画したい変更の説明]"
---

# PlanCodingAndVerification

## 目的

- 検証環境が整った後（#2 の後）に、**Plan Mode** で「実装」と「検証」を一体で計画する。
- 計画は **新規ブランチでの作業** と **コミット先送り** を前提に組む。
- 計画ファイルにまとめ、**ExitPlanMode で承認を得てから**実装に移る。

ワークフロー上の位置: `#1 事実確認 → #2 検証レディネス → 【このスキル】Plan Mode で実装&検証計画 → 承認 → 実装 → #4 検証実行 → (承認後) #5 出荷`。

## 制約（最重要）

<critical>
- **Plan Mode で動く。このスキル中はプランファイル以外を編集しない／コマンドで状態を変えない**（read-only ＋ 計画のみ）。未進入なら EnterPlanMode で入る。
- 計画には**必ず「新規ブランチを切る」を実装の最初の手順として明記**する（main 直作業は禁止）。ブランチ作成自体は承認後の実装フェーズで行い、Plan Mode 中は作らない。
- **コミット・PR はこのスキルの責務外**。計画の実行は「実装 → 検証 green」で止める。**コミット/PR はユーザーが明示的に指示したときだけ**行い、実装中に勝手にコミットしない（「小さくコミットしながら実装」も禁止）。
- `--no-verify` などフック迂回は禁止。husky の **pre-commit = `npm run lint:md`（markdownlint）** を通す前提で計画する。
- 不可逆・広域な操作（`npm publish`〔公開は取消困難〕、`package.json` の `files`・`bin` 変更〔配布物全体に波及〕、スキル・テンプレの破壊的改名〔既存利用者に影響〕）は計画に**ブラスト範囲と可逆性**を明記し、実行前のユーザー確認を必須にする。
</critical>

## 前提（#2 からの引き継ぎ）

- 直前の検証レディネス(#2)の「推奨検証方法 / 成功条件 / 環境ギャップ」を**そのまま土台にする**。#2 未実施なら先に実施する（または readiness を簡易診断）。
- 環境ギャップ（依存未インストール＝`npm i` 未済など）が残っていれば、計画の前段に「環境を整える手順」を入れる。

## 手順

Plan Mode の標準フロー（Explore → 設計 → 計画ファイル → ExitPlanMode）に、以下のプロジェクト固有を重ねる。

1. **仕様化**: 受け入れ基準（Issue 由来）を明文化し、サブタスクごとに pass/fail を定義する（spec-driven）。
2. **影響範囲調査**: Grep/Glob/serena で参照箇所・依存・**壊れる内部リンク**を特定。既存スキル・テンプレ・パターンを探して再利用する（DRY。新規作成は最後の手段。再利用先は file_path で示す）。
   - Yodogawa 固有の落とし穴を必ず確認する。例:
     - スキル/テンプレは**配置ディレクトリ起点の相対パス**で参照する（`../../templates/...`・`reference/...`）。NPM 配布 / Claude Code プラグイン / 手動コピーで CLI の配置先（`.claude/` か `.agents/`）やパス解決が変わりうる（Issue #3 の論点）。参照を足す/動かす変更は**導入形態をまたいで壊れないか**を確認する。
     - `.markdownlint.json` で無効化されたルール（MD013/MD024/MD033/MD036/MD040/MD041/MD001/MD060）を踏まえ lint-clean に保つ（`<critical>` タグや言語指定なしコードブロックは許容、末尾空白・連続空行・末尾改行などは守る）。
     - `package.json` の `files`（`bin`/`skills`/`templates`/`README.md`/`CHANGELOG.md`）の更新漏れで、新規ファイルが配布物に入らない事故。
     - frontmatter の `name:`（bare 名）とディレクトリ名（`###N` / `a-NNN` プレフィックス）の整合。
3. **設計 ＋ 敵対的レビュー**: 設計案を立て、**Plan サブエージェントに「見落とし・壊れる内部リンク・lint 違反・より良い再利用」を敵対的にレビューさせる**（この一手が致命的な見落としを潰す）。
4. **不明点の確定**: 設計のフォークは AskUserQuestion で確認してから確定する（提案 → 合意 → 実装）。
5. **計画ファイル作成**: 下記「プラン構成」に従って書く。
6. **ExitPlanMode で承認要求**。承認を得るまで実装に入らない。

## プラン構成（このフォーマットで計画ファイルに書く）

- **Context（なぜ）**: 問題・背景・期待される結果。
- **受け入れ基準**: Issue 由来の pass 条件（チェックリスト）。
- **実装方針**: 変更ファイルと**パターン**（繰り返しは1回記述＋代表パス。全ファイル列挙はしない）。再利用する既存スキル/テンプレ/関数を file_path 付きで。
- **作業の進め方**: 新規ブランチ名 `<type>/issue-<n>-<slug>`（type = feat/fix/refactor/chore）を実装の最初の手順に。**コミット/PR は検証 green 後にユーザー許可を得て別途**行う（この計画スコープには含めない＝**#5 ship-and-confirm**）。
- **検証計画**: 下記 A/B/C から変更種別で必要段を選び（md 内容のみ→A 中心、CLI 挙動の変更→A+B、配布物/公開を伴う→A+B+C）、**各段の pass 条件**と「**未検証段は完了報告で明示**」方針を書く。手順の本実行は再掲しない（**実行は #4 execute-verification**）。
  - **A 静的ゲート（必須・最初）**: `npm run lint:md`（markdownlint, 全 `**/*.md`, node_modules 除外）。加えて SKILL.md/テンプレの frontmatter 妥当性・**内部リンク切れ**（`[x](reference/...)` 等）・受け入れ基準の機械確認（grep/ファイル存在）。pass = lint エラー 0・リンク切れ 0・基準を満たすファイル/文言が grep でヒット。
  - **B 機能 smoke**（`bin/cli.js` や配布物を触る変更で実施）: 一時ターゲットディレクトリで `node bin/cli.js` を実行し、対話選択（Claude Code=`.claude/` / Other=`.agents/`）→ `skills/` と `templates/` が `{target}/skills`・`{target}/templates` に正しくコピーされるか／冪等性／既存ディレクトリ上書きプロンプト／コピー漏れを確認。pass = 期待ツリーが生成されコピー漏れなし。証拠=コマンド出力・生成ファイルツリー。終わったら一時ディレクトリを掃除（`rm -rf <temp>`）。
  - **C リリース**（公開するときのみ）: `npm pack --dry-run` で `files`（bin/skills/templates/README/CHANGELOG）の同梱物を確認 → ユーザーのリリース承認後 `npm version {patch|minor|major}` → `git push origin main && git push origin --tags` → `npm publish` → 公開後 `npx yodogawa@latest` を一時ディレクトリで install smoke。pass = 最新版が skills/templates を展開する。
- **リスク・可逆性**: ブラスト範囲、不可逆操作（`npm publish`・`files`/`bin` 変更・破壊的改名）、要ユーザー確認、レビューが要る箇所（CLI のコピー/上書きロジック・パス解決・配布対象の変更）。

## Red Flags — 計画段階で出たら止まる

- 「とりあえず main で」「あとでブランチに移す」→ 新規ブランチを実装の最初の手順にする。
- 「実装しながら細かくコミットする」→ **コミットは別フェーズ**。ユーザー許可まで一切しない。
- 「lint が通れば完了」→ それは正しさの一部。CLI 挙動の変更なら機能検証(B)・公開なら C、そして「未検証の明示」が要る。
- 「検証は最後に考える」→ 検証計画(A/B/C)は実装計画と**同時に**作る。
- 「フックがうるさいので --no-verify」→ 禁止。失敗の根本（lint 違反）を直す。
- いきなりコードを書き始める → ExitPlanMode の承認が先。

## 完了条件

- 実装計画と検証計画(A/B/C)が、受け入れ基準と pass/fail 付きで計画ファイルにある。
- 新規ブランチ運用とコミット先送りが計画に明記されている。
- 影響範囲（壊れる内部リンク・配布物への影響含む）・再利用箇所・リスク・可逆性が示されている。
- ExitPlanMode で承認を要求している（このスキル中の変更は計画ファイルのみ）。
