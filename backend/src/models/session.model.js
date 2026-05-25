class Session {
  constructor(callSid) {
    this.callSid = callSid;
    this.step = 'language';
    this.language = null;
    this.rationCard = null;
    this.selectedSeed = null;
    this.amount = null;
    this.createdAt = new Date();
  }

  updateStep(step, data = {}) {
    this.step = step;
    Object.assign(this, data);
  }
}

module.exports = Session;