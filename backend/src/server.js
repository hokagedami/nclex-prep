import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log(`[${timestamp}] Origin: ${req.headers.origin || 'none'}`);
  console.log(`[${timestamp}] User-Agent: ${req.headers['user-agent'] || 'none'}`);

  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
    originalSend.call(this, data);
  };

  next();
});

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      /\.onrender\.com$/,
      /\.render\.com$/
    ].filter(Boolean);

    console.log(`[CORS] Checking origin: ${origin}`);

    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      console.log('[CORS] No origin - allowing');
      return callback(null, true);
    }

    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      console.log(`[CORS] Origin allowed: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`[CORS] Origin blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Log environment info on startup
console.log('=== Server Configuration ===');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${PORT}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '[SET]' : '[NOT SET]'}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || '[NOT SET]'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '[SET]' : '[NOT SET]'}`);
console.log('===========================');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/health', (req, res) => {
  console.log('[HEALTH] Health check requested');
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  console.warn(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/questions/next',
      'POST /api/questions/:id/answer',
      'GET /api/progress/dashboard',
      'GET /health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, err.message);
  console.error(`[${timestamp}] Stack:`, err.stack);
  console.error(`[${timestamp}] Request: ${req.method} ${req.url}`);
  console.error(`[${timestamp}] Body:`, JSON.stringify(req.body, null, 2));

  res.status(err.status || 500).json({
    error: 'Server Error',
    message: err.message,
    timestamp,
    path: req.url,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`\n⏰ Server started at: ${new Date().toISOString()}\n`);
});
