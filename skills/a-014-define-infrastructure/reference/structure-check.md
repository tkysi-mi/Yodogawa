# 構造チェックとレビュー観点

SKILL.md 手順6〜7 で使う確認コマンドとレビュー観点。

## セクション存在確認

```bash
# インフラ構成図の確認
grep "\`\`\`mermaid" docs/project/design/08-infrastructure.md && echo "OK" || echo "MISSING: Infra Diagram"
# 環境構成の確認
grep "## 環境構成" docs/project/design/08-infrastructure.md && echo "OK" || echo "MISSING: Environments"
# 運用方針の確認
grep "## 主要な運用方針" docs/project/design/08-infrastructure.md && echo "OK" || echo "MISSING: Operations"
```

## チェックリスト

- [ ] `docs/project/design/08-infrastructure.md` が作成されている
- [ ] 本番環境の構成（冗長化、Multi-AZ など）が明確
- [ ] ネットワーク分離（Public / Private / Data）が図示されている
- [ ] セキュリティグループ方針と WAF 設定が記録されている
- [ ] バックアップ頻度・保持期間が定義されている
- [ ] Auto Scaling ポリシーが定義されている
- [ ] 監視・アラート閾値が定義されている
- [ ] 環境ごとの差異（開発 / ステージング / 本番）が表形式で記録されている

## 非機能要件との対応確認

| 非機能要件 | インフラ設計での対応 |
|:--|:--|
| 可用性 99.9% | Multi-AZ、Auto Scaling、Health Check |
| p95 < 500ms | CDN、Read Replica、Redis キャッシュ |
| RPO 1 時間以内 | 自動バックアップ + PITR |
| RTO 30 分以内 | Multi-AZ フェイルオーバ |
| 監査ログ | CloudTrail、アクセスログ保持 |

## レビュー確認質問

- 「アーキテクチャ図のコンポーネントがすべてインフラに反映されていますか？」
- 「コスト試算は許容範囲ですか？」
- 「災害復旧（DR）の RPO / RTO を満たせますか？」
- 「セキュリティベストプラクティス（最小権限、暗号化）は守られていますか？」

## エスカレーション時の推奨応答

- **コスト過大**: 「冗長化によりコスト増。ステージング環境は Single-AZ にするなど最適化を検討しましょう。」
- **セキュリティリスク**: 「DB がパブリックサブネットに配置されています。プライベートサブネットへの移動を強く推奨します。」

## Git への追加（任意）

```bash
git add docs/project/design/08-infrastructure.md
git status
```

推奨コミットメッセージ:

```text
docs: インフラ設計の定義

- インフラ構成図（Mermaid）の作成
- 環境構成と運用方針の記録
```
