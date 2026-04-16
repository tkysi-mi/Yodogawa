# 構造チェックとレビュー観点

SKILL.md 手順6〜7で使う構造確認コマンドとチェックリスト。

## 必須セクションの存在確認

```bash
grep "## 実装フェーズ" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
  && grep "## ステップ一覧" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
  && grep "## テスト計画" docs/tasks/task{ID}-{SLUG}/c-implementation.md \
  && echo "OK" || echo "MISSING SECTION"
```

## チェックリスト

- [ ] すべてのフェーズに目的・完了条件・依存関係が記載されている
- [ ] 各ステップに成果物と検証方法がある
- [ ] テスト計画が網羅的に記載されている
- [ ] 懸念点や未決事項がメモ欄に整理されている

## Git への追加（任意）

```bash
git add docs/tasks/task{ID}-{SLUG}/c-implementation.md
git commit -m "docs(task): 実装計画の作成 task{ID}"
```

## レビュー時のよくある指摘

- **フェーズが大きすぎる**: 1 フェーズが 3 日以上になりそうなら分割
- **ステップが抽象的**: 成果物が特定できない場合、ファイル名や検証手順を明記
- **テスト計画不足**: ユニット / 統合 / E2E の戦略を再検討
- **リスク対策未反映**: b-research.md で挙げたリスクへの対策ステップを計画に組み込む
- **依存関係不明**: 並行実行可能なフェーズと、順序が必要なフェーズを明示
