'use strict';

// docs/project の正準構造の定義データ（Single Source of Truth）。
// 根拠は templates/project/ の実テンプレート。テンプレートの見出しを変更したら
// ここも合わせて更新すること。

// A-Series の作成順（フェーズ順）。structure チェックはこの順序で
// 「自分より後のファイルが存在するのに欠けているファイル」を Error にする
// （フェーズ・フロンティア方式。未着手フェーズのファイルは報告しない）。
const CANONICAL_FILES = [
  '01-requirements/01-product-brief.md',
  '01-requirements/02-mvp-scope.md',
  '01-requirements/03-parking-lot.md',
  '01-requirements/05-user-stories.md',
  '02-behavior/01-core-scenarios.md',
  '03-domain/01-domain-sketch.md',
  '03-domain/02-ubiquitous-language.md',
  '04-design/01-tech-stack.md',
  '04-design/02-repository-structure.md',
  '04-design/03-screen-design.md',
  '04-design/04-design-system.md',
  '04-design/05-data-model.md',
  '04-design/06-api-spec.md',
  '04-design/07-architecture.md',
  '04-design/08-infrastructure.md',
];

// 常に任意のファイル（06 は existing モードのみ、01-domain-model は Full DDD のみ）
const OPTIONAL_FILES = [
  '01-requirements/06-features-implemented.md',
  '03-domain/01-domain-model.md',
];

// 「このキーで始まる見出し」が存在すること（前方一致。ユーザーが括弧の補足を
// 削っても壊れないよう、安定した骨格キーのみを要求する）。
const REQUIRED_HEADINGS = {
  '01-requirements/01-product-brief.md': [
    '背景',
    'ターゲットユーザー',
    '価値提案',
    '成功指標',
    'クリティカル制約',
    '非ゴール',
  ],
  '01-requirements/02-mvp-scope.md': ['検証する仮説', 'MVP Scope', 'Out of Scope'],
  '02-behavior/01-core-scenarios.md': [
    'Core Flow 一覧',
    'Day 1 Happy Path',
    'Critical Failure',
    'Not Covered in MVP',
  ],
  '03-domain/01-domain-sketch.md': [
    '主要用語',
    'アクター',
    '中核エンティティ',
    '重要なビジネスルール',
    'MVP では作らない',
  ],
  '03-domain/02-ubiquitous-language.md': ['禁止用語'],
  '04-design/01-tech-stack.md': ['テックスタック一覧', '技術選定の基準'],
  '04-design/02-repository-structure.md': ['ディレクトリ構造', 'アーキテクチャパターン'],
  '04-design/03-screen-design.md': ['画面一覧', '画面遷移図'],
  '04-design/04-design-system.md': ['カラーパレット', 'タイポグラフィ'],
  '04-design/05-data-model.md': ['エンティティ一覧', 'リレーションシップ'],
  '04-design/06-api-spec.md': ['認証・認可', 'エンドポイント一覧'],
  '04-design/07-architecture.md': ['システムアーキテクチャ図', 'ADR'],
  '04-design/08-infrastructure.md': ['インフラ構成図', '環境構成'],
};

// 見出しが乏しいファイルは代表テーブルのヘッダセルで骨格を検査する。
const REQUIRED_TABLE_HEADERS = {
  '01-requirements/03-parking-lot.md': 'Category 1',
  '01-requirements/05-user-stories.md': 'ストーリーID',
};

// a-006（PM Gate）が docs/project/ 直下に生成するレビュー成果物。
// 04-design に着手しているのに無い場合は a-006 未実施の示唆として Warning。
const REVIEW_ARTIFACTS = ['AI_CONTEXT.md', 'STAKEHOLDER-SUMMARY.md'];

// templates/project/ 由来の意味プレースホルダ（placeholder チェックが検出）。
// コメント外に残っていたらテンプレート未記入とみなす。汎用の \[.+\] は
// チェックボックスや Markdown リンクと衝突するため、既知トークンのみ検出する。
// テンプレートとの同期は test/project-spec-sync.test.js が検証する。
const KNOWN_TOKENS = [
  '[役割]',
  '[目的]',
  '[理由]',
  '[課題]',
  '[画面名]',
  '[コンテキスト名]',
  '[Bounded Context名]',
];

// ID 体系（trace の SSoT）。definitionFiles 内の出現を定義とみなす
// （headingDefinition の族は見出し行の出現のみが定義）。
// orphanScanFiles: 定義済み ID がここから 1 度も参照されなければ孤児 Warning。
// degradeWhenNoDefinitions: 定義集合が空のとき参照ごとの Error ではなく
// 族全体で縮退 Warning 1 件にする（FN は定義元が任意ファイルのため）。
const ID_FAMILIES = [
  {
    family: 'P',
    definitionFiles: ['01-requirements/01-product-brief.md'],
    orphanScanFiles: ['01-requirements/05-user-stories.md'],
  },
  {
    family: 'US',
    definitionFiles: ['01-requirements/05-user-stories.md'],
  },
  {
    family: 'FN',
    definitionFiles: [
      '01-requirements/02-mvp-scope.md',
      '01-requirements/06-features-implemented.md',
    ],
    orphanScanFiles: ['02-behavior/01-core-scenarios.md'],
    degradeWhenNoDefinitions: true,
  },
  {
    family: 'CS',
    definitionFiles: ['02-behavior/01-core-scenarios.md'],
    headingDefinition: true,
  },
  {
    family: 'CF',
    definitionFiles: ['02-behavior/01-core-scenarios.md'],
    headingDefinition: true,
  },
];

module.exports = {
  CANONICAL_FILES,
  OPTIONAL_FILES,
  REQUIRED_HEADINGS,
  REQUIRED_TABLE_HEADERS,
  REVIEW_ARTIFACTS,
  KNOWN_TOKENS,
  ID_FAMILIES,
};
