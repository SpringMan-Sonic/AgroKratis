const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seed.controller');
const orderController = require('../controllers/order.controller');
const rationCardController = require('../controllers/rationCard.controller');

// Seed routes
router.get('/seeds', seedController.getAllSeeds);
router.post('/seeds', seedController.createSeed);
router.put('/seeds/:id', seedController.updateSeed);
router.delete('/seeds/:id', seedController.deleteSeed);

// Order routes
router.get('/orders', orderController.getAllOrders);
router.post('/orders', orderController.createOrder);

// Ration card routes
router.get('/rationcards', rationCardController.getAllRationCards);
router.get('/rationcards/:number', rationCardController.checkRationCard);

// Health check for API
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;