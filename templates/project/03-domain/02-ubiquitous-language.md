# ユビキタス言語一覧

<!--
何のドキュメントか: プロジェクト全体で共有する共通言語の定義集（DDD）。ビジネス用語と技術用語の橋渡し。
使い方:
  - ドメインエキスパートが使う言葉を優先し、ビジネス用語で記述する。クラス名・メソッド名にも反映する。
  - Bounded Context ごとに用語を定義する（同じ語でも Context が違えば意味が異なる場合がある）。
  - 記載のポイント・禁止用語の選び方・Living Document としての運用は
    skills/a-004-define-domain-model/reference/ubiquitous-language-guide.md を参照。
-->

## [Bounded Context名]: 用語定義

<!-- Context ごとに節を分ける。全体共通の用語は [Bounded Context共通] 節にまとめる。 -->

| 用語 | 定義 | 使用例 |
|------|------|--------|
| <!-- 例: Order --> | <!-- 例: 顧客が商品を購入する意思を示した取引単位。確定後は変更不可 --> | <!-- 例: `class Order`, `createOrder()` --> |
| <!-- 例: Customer --> | <!-- 例: 商品を購入する個人または組織。アカウント登録の有無は問わない --> | <!-- 例: `class Customer`, `customer.placeOrder()` --> |

## 禁止用語

<!-- 曖昧・誤解を招く用語と、その理由・推奨代替語を記録する。 -->

| 禁止用語 | 理由 | 推奨用語 |
|----------|------|----------|
| <!-- 例: Data --> | <!-- 例: 何を指すか不明（Order Data? Customer Data?） --> | <!-- 例: Order, Customer, OrderDetails --> |
| <!-- 例: User --> | <!-- 例: この Context では Customer と Admin を区別する必要がある --> | <!-- 例: Customer（顧客）, Admin（管理者） --> |

## メモ

<!-- 命名規則 / 表記規則（単複・大文字小文字）/ 英日の使い分け / 参考資料など。運用詳細は ubiquitous-language-guide.md 参照。 -->
