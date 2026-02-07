// src/services/chatService.js (ESM)

// If conversationModel is CommonJS (module.exports = ...), use default import:
import Conversation from "../models/conversationModel.js";

// If conversationModel is ESM (export default ...), the above is also correct.
// If it exports named exports, you'd do: import { Conversation } from ...

function generateCode(len = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

export async function createRoom({ name, creatorId }) {
    let code = generateCode();

    while (await Conversation.exists({ code })) {
        code = generateCode();
    }

    const room = await Conversation.create({
        name,
        code,
        createdBy: creatorId,
        members: [creatorId],
    });

    return { roomId: room._id.toString(), roomName: room.name, code: room.code };
}

export async function joinRoomByCode({ code, userId }) {
    const room = await Conversation.findOne({ code });
    if (!room) return null;

    if (!room.members.some((m) => m.toString() === userId)) {
        room.members.push(userId);
        await room.save();
    }

    return { roomId: room._id.toString(), roomName: room.name };
}

/**
 * ✅ Add these ONLY if your controller expects them.
 * If you store messages in the Conversation model, adapt accordingly.
 * If messages are in a separate Message model, use that instead.
 */
export async function saveMessage({ roomId, userId, text }) {
    const room = await Conversation.findById(roomId);
    if (!room) return null;

    room.messages = room.messages || [];
    room.messages.push({ userId, text, createdAt: new Date() });

    await room.save();
    return room.messages[room.messages.length - 1];
}

export async function getMessagesByRoom(roomId) {
    const room = await Conversation.findById(roomId);
    if (!room) return [];
    return room.messages || [];
}