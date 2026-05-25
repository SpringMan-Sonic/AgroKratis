const firebaseService = require('../services/firebase.service');

exports.getAllRationCards = async (req, res) => {
  try {
    const cards = await firebaseService.getAllRationCards();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkRationCard = async (req, res) => {
  try {
    const card = await firebaseService.getRationCard(req.params.number);
    res.json({ canOrder: card.canOrder(), card });
  } catch (error) {
    res.status(404).json({ error: 'Ration card not found' });
  }
};