# equipment-reserve

社内備品（会議室・撮影機材）の予約を管理する小さな API。総務チームが Excel 台帳の代わりに使っている。

## 使い方

```bash
npm install
npm start   # http://localhost:3000
```

## エンドポイント

- `GET /equipment` — 備品一覧
- `POST /equipment` — 備品の登録
- `GET /reservations` — 予約一覧（`?equipmentId=` で絞り込み）
- `POST /reservations` — 予約の作成（時間帯の重複はエラー）

予約が作成されると Slack の #soumu チャンネルに通知が飛ぶ（`SLACK_WEBHOOK_URL` を設定した場合のみ）。
