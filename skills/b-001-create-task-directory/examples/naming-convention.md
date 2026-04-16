# タスクディレクトリの命名規則

SKILL.md 手順1〜3で使うタスク ID・スラッグの採番と命名ルール。

## 形式

```
task{6桁連番}-{スラッグ}
```

## 例

```
task000001-email-auth
task000002-user-profile-edit
task000003-payment-integration
```

## 採番ルール

- 既存がない場合は `task000001` から開始
- 既存がある場合は最大番号 + 1
- 6 桁ゼロパディング（例: 001, 010, 100, 1000）

## スラッグのルール

- 3〜5 語
- 英数字とハイフンのみ
- ユーザーへの質問例: 「タスクの内容を 3〜5 語の英数字とハイフンで表現してください（例: `user-profile-edit`）。」

## 検証コマンド

```bash
# 既存タスク一覧
ls -d docs/tasks/task*

# 作成後の確認
ls -ld docs/tasks/task{ID}-{SLUG} && echo "OK" || echo "FAILED"
```
