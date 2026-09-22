const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow localhost, render.com subdomains, or any custom client URL
    if (
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /\.onrender\.com$/.test(origin) ||
      origin === process.env.CLIENT_URL ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    // Permissive fallback so production frontend is never blocked
    return callback(null, true);
  },
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure req.body is always an object even if empty
app.use((req, res, next) => {
  if (!req.body || typeof req.body !== 'object') {
    req.body = {};
  }
  next();
});

// Root Health & API Info Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AlumniConnect Backend API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      alumni: '/api/alumni',
      students: '/api/students',
      events: '/api/events',
      mentorships: '/api/mentorships',
      messages: '/api/messages',
      referrals: '/api/referrals',
      notifications: '/api/notifications',
      analytics: '/api/analytics',
      health: '/api/health'
    }
  });
});

// API Routes (mounted both on /api and root / for Postman flexibility)
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Fallback & Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
