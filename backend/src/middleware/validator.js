const { validateRationCard, validateAadhaar, validateAmount } = require('../services/validation.service');

exports.validateSeedData = (req, res, next) => {
  const { name, nameLocal, costPerKg, stock } = req.body;
  
  if (!name || !nameLocal || costPerKg === undefined || stock === undefined) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['name', 'nameLocal', 'costPerKg', 'stock']
    });
  }
  
  if (costPerKg < 0) {
    return res.status(400).json({ error: 'Cost per KG cannot be negative' });
  }
  
  if (stock < 0) {
    return res.status(400).json({ error: 'Stock cannot be negative' });
  }

  if (!nameLocal.te || !nameLocal.hi || !nameLocal.ta || !nameLocal.ml || !nameLocal.kn) {
    return res.status(400).json({ error: 'All language translations required' });
  }
  
  next();
};

exports.validateOrderData = (req, res, next) => {
  const { seedName, amount, rationCard, aadhaar } = req.body;
  
  if (!seedName || !amount || !rationCard || !aadhaar) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['seedName', 'amount', 'rationCard', 'aadhaar']
    });
  }

  if (!validateAmount(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (!validateRationCard(rationCard)) {
    return res.status(400).json({ error: 'Invalid ration card format' });
  }

  if (!validateAadhaar(aadhaar)) {
    return res.status(400).json({ error: 'Invalid Aadhaar number' });
  }
  
  next();
};

exports.validateRationCardNumber = (req, res, next) => {
  const { number } = req.params;
  
  if (!validateRationCard(number)) {
    return res.status(400).json({ error: 'Invalid ration card format. Expected: RC0001' });
  }
  
  next();
};
