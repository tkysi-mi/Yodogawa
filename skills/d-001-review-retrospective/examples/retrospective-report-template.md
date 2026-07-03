# 振り返りレポート詳細テンプレート

SKILL.md 手順4「レポート作成」で利用する詳細版テンプレート。

## 詳細テンプレート

```markdown
# 振り返りレポート: task{ID}-{SLUG}（複数タスク対象時は対象一覧を記載）

**実施日**: YYYY-MM-DD
**対象タスク**: task000003-auth-login, task000004-password-reset

## 摩擦点一覧

| # | 分類 | タスクID | 該当スキル | 根拠（file:line） | 優先度 |
|--:|:--|:--|:--|:--|:--:|
|1|手戻り|task000003-auth-login|`b-004-create-task-implementation`|`docs/tasks/task000003-auth-login/c-implementation.md:88`: 「テスト計画に異常系が無く後から追加した」|高|
|2|詰まり|task000004-password-reset|`b-003-create-task-research`|`docs/tasks/task000004-password-reset/b-research.md:12`: 「外部APIのレート制限調査に時間がかかった」|中|

## 対象SKILL.mdごとの修正案（diff形式）

### `skills/b-004-create-task-implementation/SKILL.md`

理由: 摩擦点#1（テスト計画に「正常系／異常系」の観点が明記されておらず、異常系テストの記載漏れが手戻りの原因になった。b-002の受け入れ基準策定（正常系/異常系/性能/セキュリティの観点を明記）と対称的な記述にする）

\`\`\`diff
 ### 4. テスト計画
 
-フェーズ／ステップ単位で必要なテスト（ユニット、API、UI、E2E、負荷）とカバレッジ目標、検証コマンド（`npm test`, `playwright test` 等）を記載。例は [examples/phase-step-template.md](examples/phase-step-template.md#テスト計画の記載例) を参照。
+フェーズ／ステップ単位で必要なテスト（ユニット、API、UI、E2E、負荷）を**正常系／異常系**の観点で記載し、カバレッジ目標、検証コマンド（`npm test`, `playwright test` 等）を記載。例は [examples/phase-step-template.md](examples/phase-step-template.md#テスト計画の記載例) を参照。
\`\`\`

**適用要否はユーザー判断**（このレポートは提案のみ。SKILL.mdは編集していない）。

## docs/LESSONS.md への追記内容

- 追記した: `### YYYY-MM-DD — task000003-auth-login: テスト計画に異常系観点の明記が無く手戻りが発生`
- スキップした（重複）: なし

## 所見

### 強み
（今回のA〜Cサイクルで機能した点）

### 改善点
（今回検出できなかった摩擦点、次回のretrospectiveで補強すべき観点）

### 推奨事項
（優先度「高」の修正案から着手することを推奨、等）
```
