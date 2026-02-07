import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Default route
app.get('/', (req, res) => res.send('Backend is running!'));

export default app;
