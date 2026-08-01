/**
 * AgriGuardian AI — Backend Server
 * Node.js + Express
 *
 * Endpoints:
 *   POST /api/detect              — AI disease detection (Gemini Vision)
 *   POST /api/irrigation          — Smart irrigation advisor
 *   GET  /api/dashboard           — Farm health dashboard
 *   GET  /api/products            — List products (with ?category= filter)
 *   GET  /api/products/:id        — Single product detail
 *   GET  /api/produce             — List farmer produce listings
 *   POST /api/produce             — Farmer creates a produce listing
 *   PUT  /api/produce/:id/status  — Update listing status
 *   POST /api/orders              — Place order (checkout)
 *   GET  /api/orders/:id          — Get order by ID
 *   GET  /api/weather/:city       — 7-day weather forecast + irrigation advisory
 *   GET  /api/analytics           — Predictive risk analytics
 *   GET  /api/health              — Server health check
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────────────────────

// CORS — allow the frontend (Live Server on 5500, or file://)
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    // Allow requests with no origin (e.g. curl, Postman, file://)
    if (!origin || allowed.includes(origin)) return cb(null, true);
    // Allow any localhost regardless of port for dev
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return cb(null, true);
    }
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// ─── Routes ─────────────────────────────────────────────────────────────────

const detectRouter    = require('./routes/detect');
const irrigationRouter = require('./routes/irrigation');
const dashboardRouter  = require('./routes/dashboard');
const productsRouter   = require('./routes/products');
const ordersRouter     = require('./routes/orders');
const weatherRouter    = require('./routes/weather');
const analyticsRouter  = require('./routes/analytics');

app.use('/api/detect',    detectRouter);
app.use('/api/irrigation', irrigationRouter);
app.use('/api/dashboard',  dashboardRouter);
app.use('/api',            productsRouter);   // handles /api/products and /api/produce
app.use('/api/orders',     ordersRouter);
app.use('/api/weather',    weatherRouter);
app.use('/api/analytics',  analyticsRouter);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const geminiConfigured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    version: '1.0.0',
    gemini_configured: geminiConfigured,
    demo_mode: !geminiConfigured,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 AgriGuardian AI Backend running on http://localhost:${PORT}`);
  console.log(`   API health: http://localhost:${PORT}/api/health`);
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    console.log(`   ⚠  GEMINI_API_KEY not set — disease detection runs in demo mode`);
    console.log(`      Set it in backend/.env to enable real AI analysis`);
  } else {
    console.log(`   ✓  Gemini AI configured`);
  }
  console.log('');
});

module.exports = app;
