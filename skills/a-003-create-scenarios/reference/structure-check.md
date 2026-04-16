# 構造チェックとレビュー観点

SKILL.md 手順6〜7 で使う構造確認コマンドとレビュー観点。

## セクション存在確認

```bash
# シナリオ一覧テーブルの確認
grep "| シナリオID | 機能 |" docs/project/behavior/01-scenarios.md && echo "OK" || echo "MISSING: Table Header"
# Feature 定義の確認
grep "Feature:" docs/project/behavior/01-scenarios.md && echo "OK" || echo "MISSING: Feature definition"
# Scenario 定義の確認
grep "Scenario:" docs/project/behavior/01-scenarios.md && echo "OK" || echo "MISSING: Scenario definition"
```

## チェックリスト

- [ ] `docs/project/behavior/01-scenarios.md` が作成されている
- [ ] シナリオ一覧テーブルが更新されている
- [ ] 各 Feature が Gherkin 形式で記述されている
- [ ] 正常系と異常系のシナリオが網羅されている
- [ ] Empty State や境界値も考慮されている
- [ ] タグ（@SC-XXX, @smoke 等）が付与されている

## レビュー確認質問

- 「シナリオは実際の動作を正しく表現していますか？」
- 「漏れているケース（エラー、境界値）はありませんか？」
- 「非技術者でも理解できる表現になっていますか？」
- 「UI 操作に依存せず、ユーザーの意図を表現できていますか？」

## Git への追加（任意）

```bash
git add docs/project/behavior/
git status
```

推奨コミットメッセージ:

```text
docs: 振る舞い仕様（シナリオ）の作成

- ユーザーストーリーに基づく Gherkin シナリオを追加
- 正常系・異常系・境界値ケースを定義
```
