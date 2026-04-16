# Gherkin シナリオ記述例とタグ

SKILL.md 手順3〜5 で使用する Gherkin 形式のテンプレートとタグ付けのサンプル。

## Feature 定義の形式

```gherkin
Feature: [機能名]
  As a [役割]
  I want [やりたいこと]
  So that [得られる価値]

  Background:
    Given [共通の前提条件]
```

## ハッピーパスのシナリオ例

```gherkin
@SC-001 @smoke @happy-path
Scenario: 正常にログインできる
  Given ユーザーは登録済みである
  When 正しいメールアドレスとパスワードを入力する
  And ログインボタンを押下する
  Then ダッシュボード画面が表示される
```

- UI 操作（「ボタンをクリック」）ではなく、ユーザーの意図（「ログインする」）を優先する。
- 複数ステップは `And` / `But` で繋ぐ。

## エラーケース・境界値（Scenario Outline）

```gherkin
@SC-002 @error-handling
Scenario Outline: 不正な入力でログインに失敗する
  Given ユーザーは登録済みである
  When <email> と <password> を入力する
  Then <message> が表示される

  Examples:
    | email             | password   | message              |
    | invalid@mail      | correctPw1 | メール形式が不正です  |
    | test@example.com  |            | パスワードが必要です  |
    | test@example.com  | wrong      | 認証に失敗しました    |
```

## タグ付けガイド

- `@SC-XXX`: シナリオ ID（必須）
- `@smoke`: リリース前の最小確認対象
- `@happy-path`: 正常系
- `@error-handling`: エラーケース
- `@regression`: 実装済み機能のリグレッション
- 優先度別: `@high`, `@medium`, `@low`

## シナリオ一覧テーブル例

| シナリオID | 機能 | シナリオ名 | 優先度 |
|:--|:--|:--|:--|
| SC-001 | 認証 | 正常ログイン | High |
| SC-002 | 認証 | 入力エラー | High |
| SC-003 | 登録 | メール認証完了 | Medium |

## コミットメッセージ例

```text
docs: 振る舞い仕様（シナリオ）の作成

- ユーザーストーリーに基づく Gherkin シナリオを追加
- 正常系・異常系・境界値ケースを定義
```
