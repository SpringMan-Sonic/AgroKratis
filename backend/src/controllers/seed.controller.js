const Seed = require('../models/seed.model');
const firebaseService = require('../services/firebase.service');

exports.getAllSeeds = async (req, res) => {
  try {
    const seeds = await firebaseService.getAllSeeds();
    res.json(seeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSeed = async (req, res) => {
  try {
    Seed.validate(req.body);
    const seed = await firebaseService.createSeed(req.body);
    res.status(201).json(seed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSeed = async (req, res) => {
  try {
    const seed = await firebaseService.updateSeed(req.params.id, req.body);
    res.json(seed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSeed = async (req, res) => {
  try {
    await firebaseService.deleteSeed(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};