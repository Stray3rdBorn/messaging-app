const express = require('express');
const Room = require('../models/Room');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const room = await Room.create({ name, members: [req.userId] });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.userId });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;