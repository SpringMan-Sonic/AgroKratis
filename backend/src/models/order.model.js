class Order {
  constructor(data) {
    this.id = data.id;
    this.date = data.date || new Date().toISOString();
    this.seedName = data.seedName;
    this.amount = data.amount;
    this.rationCard = data.rationCard;
    this.aadhaar = data.aadhaar;
    this.language = data.language;
    this.status = data.status || 'pending';
  }

  static validate(data) {
    if (!data.seedName || !data.amount || !data.rationCard || !data.aadhaar) {
      throw new Error('Missing required order fields');
    }
    return true;
  }
}

module.exports = Order;