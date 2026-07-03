'use strict';

// メモリ上の備品台帳。再起動で消える（現状は運用でカバー）。
const items = [
  { id: 'eq-001', name: '会議室A', category: 'room' },
  { id: 'eq-002', name: '一眼レフカメラ', category: 'device' },
];

function list() {
  return items;
}

function register(name, category = 'device') {
  const item = { id: `eq-${String(items.length + 1).padStart(3, '0')}`, name, category };
  items.push(item);
  return item;
}

function exists(id) {
  return items.some((item) => item.id === id);
}

module.exports = { list, register, exists };
