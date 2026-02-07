import express from 'express';
import { saveMessage, getMessagesByRoom } from '../controllers/chatController.js';

const router = express.Router();

// Get chat history for a room
router.get('/:conversationId', async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await getMessagesByRoom(conversationId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a new message
router.post('/', async (req, res) => {
  try {
    const saved = await saveMessage(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
