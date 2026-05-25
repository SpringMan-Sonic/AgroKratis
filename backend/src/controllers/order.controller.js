const Order = require('../models/order.model');
const firebaseService = require('../services/firebase.service');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await firebaseService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    Order.validate(req.body);
    const order = await firebaseService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};