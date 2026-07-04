# Core Scenarios

> **Owner**: 田中
> **Status**: in-review
> **Last-updated**: 2026-06-30

## 参照: MVP Scope

[MVP Scope](../01-requirements/02-mvp-scope.md) の Must 機能を対象とする。

## Core Flow 一覧

| フロー | 主アクター | 価値 | 対応 Must |
|-------|-----------|------|----------|
| 日程調整フロー | 勉強会主催者 | 開催までを短縮 | 日程調整 |
| 告知配信フロー | 参加者 | 見逃し防止 | 告知配信 |

## Day 1 Happy Path（1〜3本）

### CS-001: 候補日の提示から確定まで

- Given: 主催者がログインしている
- When: 候補日を 3 件登録する
- Then: 参加者に調整依頼が送られる

### CS-002: 開催通知の受信

- Given: 開催日が確定している
- When: 主催者が告知を配信する
- Then: 参加者に開催通知が届く

## Critical Failure（価値を壊す重大失敗）

### CF-001: 確定日が参加者に通知されない

- 対策: 配信失敗時に再送キューへ入れる

## Not Covered in MVP（MVP で対応しない行動・エラー）

- 社外ゲストの参加動線（Out of Scope）

## AI 実装時の振る舞い注意点

- 通知はモックでよい
