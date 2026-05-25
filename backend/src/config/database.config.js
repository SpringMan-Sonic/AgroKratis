const mockDB = require('../utils/mockData');
//const { initializeFirebase } = require('./firebase.config');

const db = process.env.NODE_ENV === 'production'
  ? initializeFirebase()
  : mockDB;

module.exports = { db };
