'use strict';

const express = require('express');
const equipment = require('./equipment');
const reservations = require('./reservations');

const app = express();
app.use(express.json());

app.get('/equipment', (req, res) => {
  res.json(equipment.list());
});

app.post('/equipment', (req, res) => {
  const { name, category } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  res.status(201).json(equipment.register(name, category));
});

app.get('/reservations', (req, res) => {
  res.json(reservations.list(req.query.equipmentId));
});

app.post('/reservations', async (req, res) => {
  const { equipmentId, userName, startsAt, endsAt } = req.body;
  try {
    const created = await reservations.create({ equipmentId, userName, startsAt, endsAt });
    res.status(201).json(created);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`equipment-reserve listening on :${port}`));
