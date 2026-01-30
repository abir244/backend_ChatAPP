// src/app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS Configuration for Flutter
const corsOptions = {
  origin: [
    'http://localhost:3000',           // Flutter web
    'http://localhost:8081',           // Flutter dev server
    'http://127.0.0.1:3000',          // iOS simulator
    'http://127.0.0.1:8081',          // iOS simulator dev
    'http://10.0.2.2:3000',           // Android emulator
    'http://10.0.2.2:8081',           // Android emulator dev
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from backend!',
    routes: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    serverTime: new Date().toISOString()
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all for frontend routes (non-API)
app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ 
    message: 'API route not found',
    path: req.path
  });
});

export default app;
