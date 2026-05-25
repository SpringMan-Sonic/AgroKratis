const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voice.controller');

// Twilio webhook endpoints
router.post('/', voiceController.handleIncomingCall);
router.post('/gather', voiceController.handleGather);
router.post('/hangup', voiceController.handleHangup);

// Test endpoint (GET for testing in browser)
router.get('/', (req, res) => {
  res.json({ 
    message: 'Voice endpoint ready',
    endpoints: {
      incoming: 'POST /api/voice',
      gather: 'POST /api/voice/gather',
      hangup: 'POST /api/voice/hangup'
    }
  });
});

module.exports = router;