'use strict';

const equipment = require('./equipment');
const { notifyReservation } = require('./notify-slack');

const reservations = [];

function list(equipmentId) {
  if (!equipmentId) return reservations;
  return reservations.filter((r) => r.equipmentId === equipmentId);
}

function overlaps(a, b) {
  return a.equipmentId === b.equipmentId && a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

async function create({ equipmentId, userName, startsAt, endsAt }) {
  if (!equipment.exists(equipmentId)) throw new Error(`unknown equipment: ${equipmentId}`);
  if (!userName || !startsAt || !endsAt || startsAt >= endsAt) {
    throw new Error('invalid reservation');
  }
  const candidate = { equipmentId, userName, startsAt, endsAt };
  if (reservations.some((r) => overlaps(r, candidate))) {
    throw new Error('time slot already reserved');
  }
  const created = { id: `rsv-${reservations.length + 1}`, ...candidate };
  reservations.push(created);
  await notifyReservation(created);
  return created;
}

module.exports = { list, create };
