const { db } = require('../config/database.config');

exports.getAllSeeds = async () => {
  if (Array.isArray(db.seeds)) return db.seeds;
  const snapshot = await db.collection('seeds').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.createSeed = async (seedData) => {
  if (Array.isArray(db.seeds)) {
    const seed = { id: Date.now(), ...seedData };
    db.seeds.push(seed);
    return seed;
  }
  const docRef = await db.collection('seeds').add(seedData);
  return { id: docRef.id, ...seedData };
};

exports.updateSeed = async (id, updates) => {
  if (Array.isArray(db.seeds)) {
    const index = db.seeds.findIndex(s => s.id == id);
    if (index !== -1) {
      db.seeds[index] = { ...db.seeds[index], ...updates };
      return db.seeds[index];
    }
    throw new Error('Seed not found');
  }
  await db.collection('seeds').doc(id).update(updates);
  return { id, ...updates };
};

exports.deleteSeed = async (id) => {
  if (Array.isArray(db.seeds)) {
    db.seeds = db.seeds.filter(s => s.id != id);
    return;
  }
  await db.collection('seeds').doc(id).delete();
};

exports.getAllOrders = async () => {
  if (Array.isArray(db.orders)) return db.orders;
  const snapshot = await db.collection('orders').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.createOrder = async (orderData) => {
  if (Array.isArray(db.orders)) {
    const order = { id: Date.now(), ...orderData };
    db.orders.push(order);
    return order;
  }
  const docRef = await db.collection('orders').add(orderData);
  return { id: docRef.id, ...orderData };
};

exports.getAllRationCards = async () => {
  if (Array.isArray(db.rationCards)) return db.rationCards;
  const snapshot = await db.collection('rationCards').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.getRationCard = async (number) => {
  if (Array.isArray(db.rationCards)) {
    const card = db.rationCards.find(rc => rc.number === number);
    return card;
  }
  const doc = await db.collection('rationCards').doc(number).get();
  return doc.exists ? doc.data() : null;
};

exports.updateRationCard = async (number, updates) => {
  if (Array.isArray(db.rationCards)) {
    const card = db.rationCards.find(rc => rc.number === number);
    Object.assign(card, updates);
    return card;
  }
  await db.collection('rationCards').doc(number).update(updates);
  return { number, ...updates };
};
