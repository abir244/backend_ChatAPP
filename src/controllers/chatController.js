import Chat from '../models/chatModel.js';

export const saveMessage = async (data) => {
  const chat = new Chat(data);
  return await chat.save();
};

export const getMessages = async () => {
  return await Chat.find().sort({ timestamp: 1 }).limit(50);
};
