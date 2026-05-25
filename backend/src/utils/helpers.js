exports.findSeedByLocalName = (spokenText, language, seeds) => {
  if (!spokenText) return null;
  
  const normalized = spokenText.toLowerCase().trim();
  
  let seed = seeds.find(s => 
    s.nameLocal[language]?.toLowerCase() === normalized
  );
  
  if (!seed) {
    seed = seeds.find(s => {
      const seedName = s.nameLocal[language]?.toLowerCase() || '';
      return seedName.includes(normalized) || normalized.includes(seedName);
    });
  }
  
  if (!seed) {
    seed = seeds.find(s => 
      s.name.toLowerCase() === normalized || 
      s.name.toLowerCase().includes(normalized)
    );
  }
  
  return seed;
};

exports.calculateTotalCost = (amount, costPerKg) => {
  return ((amount / 1000) * costPerKg).toFixed(2);
};

exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};
