const admin = require('firebase-admin');

const initializeFirebase = () => {
  if (process.env.NODE_ENV === 'production') {
    admin.initializeApp({
      credential: admin.credential.cert(require('../../serviceAccountKey.json'))
    });
    return admin.firestore();
  }
  return null;
};

module.exports = { initializeFirebase };