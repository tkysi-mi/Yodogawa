# Mermaid 図のテンプレート集

SKILL.md 手順3〜4 で使用する Mermaid 記述例。

## Context Map（Bounded Context 間の関係）

```mermaid
flowchart LR
  Order[Order Context]:::core
  Customer[Customer Context]:::supporting
  Payment[Payment Context]:::generic

  Order -->|Customer/Supplier| Customer
  Order -->|Published Language| Payment

  classDef core fill:#FFD700,stroke:#333,stroke-width:2px;
  classDef supporting fill:#87CEEB,stroke:#333,stroke-width:1px;
  classDef generic fill:#D3D3D3,stroke:#333,stroke-width:1px;
```

### スタイル定義

- Core Domain: 金色 `fill:#FFD700`
- Supporting Domain: 水色 `fill:#87CEEB`
- Generic Domain: グレー `fill:#D3D3D3`

### エッジ（関係）のラベル例

- `-->|Customer/Supplier|`
- `-->|Conformist|`
- `-->|Published Language|`
- `-->|Anti-Corruption Layer|`
- `-->|Shared Kernel|`

## Aggregate 構造図（クラス図形式）

```mermaid
classDiagram
  class Order {
    +OrderId id
    +CustomerId customerId
    +OrderStatus status
    +place()
    +cancel()
  }
  class OrderItem {
    +ProductId productId
    +int quantity
  }
  Order "1" *-- "N" OrderItem : contains
```

## イベントフロー図（シーケンス図形式）

```mermaid
sequenceDiagram
  participant U as User
  participant O as OrderAggregate
  participant P as PaymentPolicy

  U->>O: PlaceOrder (Command)
  O-->>P: OrderPlaced (Event)
  P->>P: trigger ProcessPayment
```

## コミットメッセージ例

```text
docs: ドメインモデル図（Context Map）の追加

- Bounded Context 間の関係を Mermaid 図で視覚化
- 戦略的分類に基づく色分けを追加
```
