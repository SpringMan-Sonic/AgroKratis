class RationCard {
  constructor(data) {
    this.number = data.number;
    this.used = data.used || false;
    this.lastUsed = data.lastUsed || null;
  }

  isWithin30Days() {
    if (!this.used || !this.lastUsed) return false;
    const lastUsed = new Date(this.lastUsed);
    const now = new Date();
    const diffDays = Math.ceil((now - lastUsed) / (1000 * 60 * 60 * 24));
    return diffDays < 30;
  }

  canOrder() {
    return !this.used || !this.isWithin30Days();
  }
}

module.exports = RationCard;