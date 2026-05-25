const { translations } = require('../utils/constants');

exports.getTranslation = (language) => {
  return translations[language] || translations.te;
};

exports.getVoiceLanguage = (lang) => {
  const voiceMap = {
    'te': 'en-in',  
    'hi': 'en-in',  
    'ta': 'en-in',  
    'ml': 'en-in',  
    'kn': 'en-in'   
  };
  return voiceMap[lang] || 'en-in';
};