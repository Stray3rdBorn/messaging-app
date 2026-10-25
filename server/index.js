const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const Message = require("./models/Message");
const messageRoutes = require("./routes/messages");
const path = require("path");
const jwt = require("jsonwebtoken");
const Room = require("./models/Room");

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", async (roomId) => {
    try {
      if (typeof roomId !== "string") return;
      const room = await Room.findById(roomId);
      if (!room || !room.members.includes(socket.userId)) return;
      socket.join(room._id.toString());
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("sendMessage", async (payload) => {
    try {
      const { roomId, text } = payload || {};
      if (typeof roomId !== "string" || typeof text !== "string") return;

      const cleanText = text.trim();
      if (!cleanText || cleanText.length > 1000) return;
      if (!socket.rooms.has(roomId)) return;

      const message = await Message.create({
        room: roomId,
        sender: socket.userId,
        text: cleanText,
      });
      io.to(roomId).emit("receiveMessage", message);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(express.static(path.join(__dirname, "../client/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
