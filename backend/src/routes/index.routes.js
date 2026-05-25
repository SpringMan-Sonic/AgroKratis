const express = require('express');
const router = express.Router();
const voiceRoutes = require('./voice.routes');
const apiRoutes = require('./api.routes');

// Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Agrokratis Backend API',
    timestamp: new Date().toISOString()
  });
});

// Voice routes (for Twilio webhooks)
router.use('/api/voice', voiceRoutes);

// API routes (for frontend dashboard)
router.use('/api', apiRoutes);

module.exports = router;