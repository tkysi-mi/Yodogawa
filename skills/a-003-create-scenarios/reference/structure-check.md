# 構造チェックとレビュー観点

SKILL.md 手順6〜7 で使う構造確認コマンドとレビュー観点。

## セクション存在確認

```bash
# Core Flow 一覧の確認
grep "## Core Flow 一覧" docs/project/02-behavior/01-core-scenarios.md && echo "OK" || echo "MISSING: Core Flow"
# Day 1 Happy Path の確認
grep "## Day 1 Happy Path" docs/project/02-behavior/01-core-scenarios.md && echo "OK" || echo "MISSING: Happy Path"
# Critical Failure の確認
grep "## Critical Failure" docs/project/02-behavior/01-core-scenarios.md && echo "OK" || echo "MISSING: Critical Failure"
# Not Covered in MVP の確認
grep "## Not Covered in MVP" docs/project/02-behavior/01-core-scenarios.md && echo "OK" || echo "MISSING: Not Covered"
```

## チェックリスト

- [ ] `docs/project/02-behavior/01-core-scenarios.md` が作成されている
- [ ] 対象が MVP Scope の Must 機能に絞られている（Not Now / Won't を扱っていない）
- [ ] Day 1 Happy Path が 1〜3 本に固定されている
- [ ] Critical Failure が「価値を壊す重大失敗」に限定されている（網羅していない）
- [ ] Not Covered in MVP が明示され、`02-mvp-scope.md` の Not Now / Won't と整合している
- [ ] User Story（要約 AC）と Core Scenario（実行時主要行動）が二重化していない

## レビュー確認質問

- 「Day 1 の成功体験を正しく表現していますか？」
- 「価値を壊す Critical Failure に漏れはありませんか？（法務・課金・権限・データ消失）」
- 「Not Covered in MVP は MVP Scope の Not Now / Won't と矛盾していませんか？」
- 「非技術者でも理解できる表現になっていますか？」
- 「UI 操作に依存せず、ユーザーの意図を表現できていますか？」

## Git への追加（任意）

```bash
git add docs/project/02-behavior/
git status
```

推奨コミットメッセージ:

```text
docs: Core Scenarios（MVP 主要行動）の作成

- Must 機能の Day 1 Happy Path と Critical Failure を定義
- Not Covered in MVP を明示
```
