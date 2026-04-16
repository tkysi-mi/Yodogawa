# 構造チェックとレビュー観点

SKILL.md 手順7〜8 で使う確認コマンドとレビュー観点。

## セクション存在確認

```bash
# エンティティ一覧の確認
grep "## エンティティ一覧" docs/project/design/05-data-model.md && echo "OK" || echo "MISSING: Entities"
# ERD の確認
grep "\`\`\`mermaid" docs/project/design/05-data-model.md && echo "OK" || echo "MISSING: ERD"
# リレーションシップ定義の確認
grep "## リレーションシップ" docs/project/design/05-data-model.md && echo "OK" || echo "MISSING: Relationships"
```

## チェックリスト

- [ ] `docs/project/design/05-data-model.md` が作成されている
- [ ] 全エンティティの物理名・論理名が定義されている
- [ ] 各カラムの型・制約・デフォルト値が定義されている
- [ ] 主キー戦略（Auto Increment / UUID / CUID）が明記されている
- [ ] 監査カラム（created_at, updated_at）の有無が決定している
- [ ] リレーション（1:1, 1:N, N:M）と外部キー動作（CASCADE / SET NULL / RESTRICT）が定義されている
- [ ] ERD が正しくレンダリングされる
- [ ] インデックス戦略が記録されている
- [ ] 意図的な非正規化があれば理由が記載されている

## 正規化レベルの目安

- **1NF**: 繰り返しグループを排除、原子値のみ
- **2NF**: 複合主キーの部分従属を排除
- **3NF**: 推移関数従属を排除
- 通常は 3NF を基本とし、パフォーマンス目的で意図的に非正規化する場合は理由を明記

## レビュー確認質問

- 「ドメインモデルの Aggregate 構造と整合していますか？」
- 「検索・集計のパフォーマンス要件を満たせそうですか？」
- 「ソフトデリート / 履歴保持の方針は決まっていますか？」
- 「機微情報（パスワード、PII）の扱いは適切ですか？」

## Git への追加（任意）

```bash
git add docs/project/design/05-data-model.md
git status
```

推奨コミットメッセージ:

```text
docs: データモデル（ERD）の定義

- エンティティ、属性、リレーションシップを定義
- Mermaid による ER 図を追加
```
