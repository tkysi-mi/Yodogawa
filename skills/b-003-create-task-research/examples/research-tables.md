# リサーチ出力例（表テンプレート）

`b-research.md` に記載する各セクションの表形式サンプル。

## ベストプラクティス

| トピック | ベストプラクティス | 参考リンク |
|---------|-------------------|-----------|
| フォームバリデーション | React Hook Form + Zod を使用。パフォーマンスが良く、型安全性が高い | [React Hook Form 公式](https://react-hook-form.com/) |
| メール送信 | SendGrid や Resend などのサービスを利用。自前 SMTP は避ける | [Resend Best Practices](https://resend.com/docs) |

### アンチパターンの記録例

- 「フォームの全フィールドを state で管理すると再レンダリングが頻発 → React Hook Form を使用」
- 「パスワードを平文でログに出力 → 機密情報は絶対にログに出力しない」

## 既存コード調査サマリ

| 項目 | 内容 |
|------|------|
| 類似機能のファイルパス | `src/features/auth/PasswordResetForm.tsx` |
| 実装パターン | React Hook Form でフォーム管理、API 呼び出しは useMutation で非同期処理 |
| 参考にすべき点 | エラーハンドリングパターン、ローディング状態の管理、ユーザーへのフィードバック表示 |
| 改善すべき点 | エラーメッセージのハードコード → i18n 対応が必要／テストコードがない → 今回は必ず書く |

## 再利用可能なコンポーネント

| コンポーネント名 | ファイルパス | 使用方法 |
|-----------------|-------------|----------|
| `Button` | `src/components/Button.tsx` | `<Button variant="primary" onClick={handleClick}>送信</Button>` |
| `useToast` | `src/hooks/useToast.ts` | `const { showToast } = useToast(); showToast({ message: "成功", type: "success" });` |
| `apiClient` | `src/lib/apiClient.ts` | `await apiClient.post("/api/auth/verify", { token });` |

### 型定義の記録例

```typescript
// Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
  children: React.ReactNode;
}
```

## 技術選定比較表

| 技術・ライブラリ | 選定理由 | 代替案との比較 |
|----------------|---------|---------------|
| Zod | TypeScript の型定義からバリデーションスキーマを自動生成可能。React Hook Form との統合が容易。バンドルサイズも小さい（8KB gzip） | Yup は型推論が弱い。Joi はバンドルサイズが大きい（45KB gzip） |

## リスク一覧

| リスク | 影響 | 軽減策 |
|--------|------|--------|
| メール送信の遅延 | ユーザー登録完了までに時間がかかり、UX が悪化 | 非同期ジョブキューで処理。即座に「メール送信中」メッセージを表示 |
| SendGrid API の障害 | メール送信が完全に停止 | フォールバック先（Amazon SES）を用意。障害時の通知機能を実装 |
| トークンの総当たり攻撃 | 不正なメール認証の可能性 | UUID v4 でランダム性を確保（2^122の組み合わせ）。有効期限を24時間に制限。レート制限を実装 |

## メモ記載例

- 「既存のメール送信機能が古い実装のため、このタスクと一緒にリファクタリング検討」
- 「パフォーマンステストが必要（1000ユーザー同時登録時の負荷）」
- 「セキュリティレビューをチームリーダーに依頼予定」
