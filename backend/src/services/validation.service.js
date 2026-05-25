exports.validateRationCard = (number) => {
  const pattern = /^RC\d{4}$/;
  return pattern.test(number);
};

exports.validateAadhaar = (number) => {
  const cleaned = number.toString().replace(/\s/g, '');
  
  if (!/^\d{12}$/.test(cleaned)) {
    return false;
  }
  
  if (cleaned[0] === '0' || cleaned[0] === '1') {
    return false;
  }
  
  return true;
};

exports.validateAmount = (amount) => {
  const num = parseInt(amount);
  return !isNaN(num) && num > 0 && num <= 100000; // Max 100kg
};

exports.validatePhoneNumber = (phone) => {
  // Indian phone number: 10 digits
  const pattern = /^[6-9]\d{9}$/;
  return pattern.test(phone.replace(/\s/g, ''));
};

exports.validateLanguage = (lang) => {
  const validLanguages = ['te', 'hi', 'ta', 'ml', 'kn'];
  return validLanguages.includes(lang);
};
