# Gherkinシナリオ一覧

<!--
何を書くか: Gherkin形式で記述した振る舞いシナリオ（BDD）

目的:
  - ユーザー視点での具体的な動作例を記述
  - 開発者、QA、ステークホルダーの共通理解を構築
  - 自動テストの基礎として活用（Cucumber、SpecFlow等）
  - ドメインイベントやコマンドの発見（Event Stormingの入力）

BDD（Behavior-Driven Development）とは:
  - Example First: 具体例から始める開発手法
  - Given-When-Then形式で振る舞いを記述
  - 実行可能なドキュメント（テストとして自動化可能）
  - 非技術者も理解できる平易な言葉で記述

Gherkinとは:
  - BDDのためのドメイン特化言語（DSL）
  - Feature, Scenario, Given, When, Thenなどのキーワードで構成
  - 人間が読みやすく、機械も解析可能
  - Cucumber、SpecFlow、Behatなどのツールで実行可能

ドキュメント構成:
  1. シナリオ一覧テーブル: 全シナリオの概要（検索性、トラッキング）
  2. シナリオ詳細: Feature単位でGherkin形式で記述

記載のポイント:
  - ユーザーストーリーから具体的なシナリオを抽出
  - 1シナリオ = 1つの具体的な例
  - ハッピーパス（正常系）から開始し、徐々にエッジケースを追加
  - 宣言的スタイル（What）で記述、実装詳細（How）は避ける

更新頻度:
  - ユーザーストーリー作成後に作成
  - スプリント計画時に詳細化
  - 実装完了後も Living Documentation として維持
-->

---

## シナリオ一覧

<!--
すべてのシナリオの概要リスト

目的:
  - シナリオの全体像を把握
  - 機能別のシナリオ数を確認
  - 優先度の管理
  - 実装状況の追跡（オプション）

【シナリオID】
  - 形式: SC-XXX（Scenario）
  - 採番ルール: 連番、一意の識別子
  - 用途: テスト自動化ツールとの紐付け、トレーサビリティ
  - Gherkin内では @SC-XXX タグで参照

【機能】
  - Featureに対応する機能名
  - 同じFeature内のシナリオをグループ化
  - 例: 「ユーザー登録」「注文処理」「検索機能」

【シナリオ名】
  - シナリオの内容を簡潔に表現（5-10単語程度）
  - ユーザーの視点で記述
  - 例: 「有効なメールアドレスで登録成功」「在庫切れ商品の購入エラー」

【優先度】
  - High: 必須シナリオ、リリース前に実装・テスト必須
  - Medium: 重要だが緊急ではない
  - Low: エッジケース、将来的に追加

【ステータス】（オプション - 追加する場合）
  - Todo: 未実装
  - In Progress: 実装中
  - Done: 完了（テストパス）
  - カラムを追加することで実装状況を追跡可能
-->

| シナリオID | 機能 | シナリオ名 | 優先度 |
|-----------|------|-----------|--------|
| <!-- 例: SC-001 --> | <!-- 例: ユーザー登録 --> | <!-- 例: 有効なメールアドレスでの登録成功 --> | <!-- 例: High --> |
| <!-- 例: SC-002 --> | <!-- 例: ユーザー登録 --> | <!-- 例: 無効なメールアドレスでの登録エラー --> | <!-- 例: High --> |
| <!-- 例: SC-003 --> | <!-- 例: ユーザー登録 --> | <!-- 例: 既存メールアドレスでの登録エラー --> | <!-- 例: Medium --> |
| <!-- 例: SC-004 --> | <!-- 例: 注文処理 --> | <!-- 例: 商品をカートに追加 --> | <!-- 例: High --> |

---

## シナリオ詳細

<!--
各FeatureをGherkin形式で記述

構成:
  - Feature単位でセクション化（### Feature: 機能名）
  - 各Feature内に複数のScenarioを含める
  - @SC-XXXタグでシナリオIDを紐付ける

Gherkinの主要キーワード:
  - Feature: 機能の説明
  - Background: すべてのシナリオ共通の前提条件
  - Scenario: 個別のシナリオ
  - Scenario Outline: パラメータ化されたシナリオ（複数の例を実行）
  - Given: 前提条件（システムの初期状態）
  - When: アクション（ユーザーの操作やイベント）
  - Then: 期待される結果（検証可能な結果）
  - And/But: Given、When、Thenの追加ステップ
  - Examples: Scenario Outlineで使用するデータテーブル

タグの活用:
  - @SC-XXX: シナリオIDとの紐付け
  - @smoke, @regression: テストカテゴリ
  - @wip: 作業中（Work In Progress）
  - @slow: 実行時間が長いテスト
  - 複数タグを同時に使用可能
-->

---

### Feature: [機能名 1]

<!--
Feature（フィーチャー）の記述

【構成】
  Feature: [機能名]
    [機能の説明 - 自由形式のテキスト]

    As a [役割]
    I want [機能]
    So that [価値]

【記載内容】
  - 機能の目的と価値を1-3文で説明
  - ユーザーストーリー形式で記述（As a, I want, So that）
  - 技術的詳細ではなく、ビジネス価値を記述

【Background（オプション）】
  - すべてのシナリオで共通する前提条件
  - 通常はGivenステップのみ
  - 重複を排除し、シナリオを簡潔にする（DRY原則）

【Scenario】
  - Given-When-Then構造で記述
  - @SC-XXXタグでシナリオIDを紐付ける
  - 1 Feature内に複数のScenarioを含める

【ベストプラクティス】
  1. **宣言的スタイル**: UIの操作詳細ではなく、ユーザーの意図を記述
     ❌ When "登録"ボタンをクリックし、"OK"ボタンをクリックする
     ✅ When 登録を完了する

  2. **1シナリオ1例**: 複数のケースは別シナリオまたはScenario Outlineで

  3. **具体的な値**: 抽象的ではなく、具体的なデータを使用
     ❌ Then エラーが表示される
     ✅ Then "無効なメールアドレスです"というエラーが表示される

  4. **実装から独立**: UIや技術が変わってもシナリオは変わらない

  5. **ユーザー視点**: 開発者用語ではなく、ユーザーが理解できる言葉

【例】
  Feature: ユーザー登録
    新しいユーザーがアカウントを作成できる機能

    As a 新規ユーザー
    I want メールアドレスとパスワードでアカウントを登録したい
    So that システムを利用できるようになる

    Background:
      Given システムが起動している

    @SC-001 @smoke @happy-path
    Scenario: 有効なメールアドレスでの登録成功
      Given ユーザーが登録ページにいる
      When 有効なメールアドレス "user@example.com" とパスワードで登録する
      Then アカウントが作成される
      And ウェルカムメールが送信される
      And ダッシュボードにリダイレクトされる

    @SC-002 @validation @error-handling
    Scenario: 無効なメールアドレスでの登録エラー
      Given ユーザーが登録ページにいる
      When 無効なメールアドレス "invalid-email" で登録する
      Then "無効なメールアドレスです"というエラーが表示される
      And アカウントは作成されない
-->

```gherkin
@smoke @regression
Feature: [機能名]
  [機能の説明]

  As a [役割]
  I want [機能]
  So that [価値]

  Background:
    Given [すべてのシナリオ共通の前提条件]
    And [追加の前提条件]

  @SC-001 @happy-path
  Scenario: [シナリオ名 1]
    Given [前提条件]
    When [ユーザーのアクション]
    Then [期待される結果]
    And [追加の検証]

  @SC-002 @error-handling
  Scenario: [シナリオ名 2]
    Given [前提条件]
    When [ユーザーのアクション]
    Then [期待される結果]

  @SC-003
  Scenario Outline: [パラメータ化されたシナリオ名]
    Given [前提条件 with <parameter>]
    When [アクション with <parameter>]
    Then [期待される結果 with <expected>]

    Examples:
      | parameter | expected |
      | value1    | result1  |
      | value2    | result2  |
```

---

### Feature: [機能名 2]

<!--
2つ目のFeature

【Scenario Outline（シナリオアウトライン）の使い方】

目的:
  - 同じシナリオ構造で異なるデータを複数回実行
  - データ駆動テストの実装
  - 境界値テストやエッジケースの網羅

構成:
  Scenario Outline: [シナリオテンプレート]
    Given [前提条件 with <パラメータ>]
    When [アクション with <パラメータ>]
    Then [結果 with <パラメータ>]

    Examples:
      | パラメータ1 | パラメータ2 | 期待結果 |
      | 値1        | 値2        | 結果1    |
      | 値3        | 値4        | 結果2    |

使用タイミング:
  - 入力バリデーションのテスト
  - 複数の類似ケースの検証
  - 正常値と異常値の組み合わせテスト

Examplesテーブル:
  - 1行目: ヘッダー（パラメータ名）
  - 2行目以降: 各行が1回の実行
  - シナリオは行数分実行される
  - <パラメータ名>でシナリオ内から参照

ベストプラクティス:
  - パラメータ名は明確に（<input>より<email>）
  - テーブルは読みやすく整列
  - 複雑になりすぎる場合は別シナリオに分割
  - 各行の意図をコメントで補足（オプション）
  - 複数のExamplesブロックで意味的にグループ化

例:
  @SC-005
  Scenario Outline: メールアドレスのバリデーション
    Given ユーザーが登録ページにいる
    When メールアドレス "<email>" で登録する
    Then "<result>" が表示される

    Examples: 有効なメールアドレス
      | email              | result     |
      | user@example.com   | 成功       |
      | test+tag@domain.jp | 成功       |

    Examples: 無効なメールアドレス
      | email              | result                   |
      | invalid            | メールアドレスが無効です |
      | @example.com       | メールアドレスが無効です |
      | user@              | メールアドレスが無効です |
-->

```gherkin
Feature: [機能名 2]
  [機能の説明]

  As a [役割]
  I want [機能]
  So that [価値]

  @SC-004
  Scenario: [シナリオ名]
    Given [前提条件]
    And [追加の前提条件]
    When [メインアクション]
    Then [期待結果1]
    And [期待結果2]
    And [期待結果3]
    But [対照的な結果]

  @SC-005 @validation
  Scenario Outline: [パラメータ化されたシナリオ名]
    Given [前提条件 with <param>]
    When [アクション with <param>]
    Then [結果 with <expected>]

    Examples: [正常系のケース]
      | param  | expected |
      | value1 | result1  |
      | value2 | result2  |

    Examples: [異常系のケース]
      | param  | expected |
      | value3 | error1   |
      | value4 | error2   |
```

---

## タグの活用

<!--
タグ（@tag）を使用したシナリオの分類と実行制御

【目的】
  - シナリオのグループ化
  - 選択的なテスト実行
  - テストスイートの管理
  - CI/CDでの柔軟な実行制御

【よく使われるタグ】
  @smoke: スモークテスト（重要な基本機能、最優先で実行）
  @regression: リグレッションテスト（すべての既存機能）
  @slow: 実行時間が長いテスト（通常のCIでスキップ）
  @wip: 作業中（Work In Progress、開発中のシナリオ）
  @bug-XXX: バグ修正に関連（Issue番号と紐付け）
  @integration: 統合テスト（外部システムと連携）
  @ui: UI関連テスト
  @api: API関連テスト
  @SC-XXX: シナリオIDとの紐付け

【記述位置】
  - Feature、Scenario、Scenario Outlineの直前
  - 複数タグを同時に使用可能（スペース区切り）
  - タグは継承される（FeatureのタグはすべてのScenarioに適用）

【実行例（Cucumber）】
  cucumber --tags "@smoke"              # smokeタグのみ実行
  cucumber --tags "not @slow"           # slowタグ以外を実行
  cucumber --tags "@smoke and @api"     # 両方のタグを持つもの
  cucumber --tags "@regression and not @wip"  # regressionでwip以外

【ベストプラクティス】
  - タグの命名規則をチームで統一
  - 過度なタグ付けを避ける（管理が煩雑になる）
  - CI/CDパイプラインに応じたタグ戦略を設計
  - タグの意味をドキュメント化
-->

---

## メモ

<!--
全体に関する補足情報

記載すべき内容:
  - テスト自動化ツールの設定（Cucumber、SpecFlow等）
  - ステップ定義の実装ファイルへのリンク
  - テストデータの管理方法
  - テスト環境の準備手順
  - CI/CDでの実行方法とパイプライン設定
  - カバレッジ目標（シナリオ数、実装機能のカバー率）
  - レビュープロセス（誰がシナリオをレビューするか）
  - シナリオの命名規則やスタイルガイド

シナリオ作成のワークフロー:
  1. ユーザーストーリーから具体例を抽出
  2. ハッピーパス（正常系）を最初に記述
  3. エラーケースや境界値を追加
  4. ステークホルダーとレビュー
  5. ステップ定義を実装（自動化）
  6. 継続的にメンテナンス

ドメインモデリングとの連携:
  - シナリオのGiven-When-Thenから、ドメインイベントを抽出
  - Whenがコマンド、Thenがドメインイベントに対応することが多い
  - シナリオで使われる用語をユビキタス言語に追加
  - Event Stormingの入力として活用

ベストプラクティス:
  - シナリオは短く保つ（5-10ステップ程度）
  - 1 Feature = 1ファイルも検討（大規模プロジェクトの場合）
  - 実装詳細（UIの操作手順）は避ける
  - ビジネス用語を使用（技術用語を避ける）
  - 定期的にリファクタリング（重複の排除、Background活用）
  - シナリオ間の依存を避ける（各シナリオは独立して実行可能に）
-->
