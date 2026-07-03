'use strict';

// SLACK_WEBHOOK_URL 未設定時は何もしない（ローカル開発用）。
async function notifyReservation(reservation) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `新しい予約: ${reservation.equipmentId} ${reservation.startsAt}〜${reservation.endsAt} (${reservation.userName})`,
    }),
  });
}

module.exports = { notifyReservation };
