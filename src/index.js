import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/database.js";
import { saveMessage, getMessagesByRoom } from "./controllers/chatController.js";
import Conversation from "./models/conversationModel.js";

// ✅ Railway injects PORT automatically
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

// ✅ Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Start listening FIRST (Railway can reach your app immediately)
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Connect DB after server is already reachable
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Failed to connect to DB:", err.message));

// ✅ helper
function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("join_room", async (conversationId) => {
    socket.join(conversationId);
    console.log(`👤 User joined room: ${conversationId}`);

    try {
      const messages = await getMessagesByRoom(conversationId);
      socket.emit("chat_history", messages);
    } catch (err) {
      console.error("❌ Error fetching history:", err.message);
      socket.emit("error", { message: "Failed to load chat history" });
    }
  });

  socket.on("create_room", async ({ roomName, creatorId }) => {
    try {
      if (!roomName || roomName.trim().length < 2) {
        socket.emit("room_error", { message: "Room name is too short" });
        return;
      }

      let code = generateRoomCode();
      while (await Conversation.exists({ code })) {
        code = generateRoomCode();
      }

      const room = await Conversation.create({
        name: roomName.trim(),
        code,
        createdBy: creatorId || null,
        members: creatorId ? [creatorId] : [],
      });

      const roomId = room._id.toString();
      socket.join(roomId);

      socket.emit("room_created", {
        roomId,
        roomName: room.name,
        code: room.code,
      });
    } catch (err) {
      console.error("❌ create_room error:", err.message);
      socket.emit("room_error", { message: "Failed to create room" });
    }
  });

  socket.on("join_room_by_code", async ({ code, userId }) => {
    try {
      if (!code || code.trim().length < 4) {
        socket.emit("join_error", { message: "Invalid code" });
        return;
      }

      const room = await Conversation.findOne({
        code: code.trim().toUpperCase(),
      });

      if (!room) {
        socket.emit("join_error", { message: "Room code not found" });
        return;
      }

      if (userId) {
        const exists = room.members?.some((m) => m.toString() === userId);
        if (!exists) {
          room.members.push(userId);
          await room.save();
        }
      }

      const roomId = room._id.toString();
      socket.join(roomId);

      const messages = await getMessagesByRoom(roomId);
      socket.emit("chat_history", messages);

      socket.emit("joined_room", {
        roomId,
        roomName: room.name,
      });
    } catch (err) {
      console.error("❌ join_room_by_code error:", err.message);
      socket.emit("join_error", { message: "Failed to join room" });
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const saved = await saveMessage(data);
      io.to(data.conversationId).emit("receive_message", saved);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});