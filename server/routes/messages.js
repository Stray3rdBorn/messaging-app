const express = require("express");
const Message = require("../models/Message");
const Room = require("../models/Room");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/:roomId", authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.members.includes(req.userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    const messages = await Message.find({ room: room._id }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
