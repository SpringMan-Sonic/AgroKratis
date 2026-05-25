class Seed {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.nameLocal = data.nameLocal;
    this.costPerKg = data.costPerKg;
    this.stock = data.stock;
  }

  static validate(data) {
    if (!data.name || !data.costPerKg || data.stock === undefined) {
      throw new Error('Missing required fields');
    }
    if (data.costPerKg < 0 || data.stock < 0) {
      throw new Error('Invalid values');
    }
    return true;
  }
}

module.exports = Seed;