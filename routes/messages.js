const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:roomId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;