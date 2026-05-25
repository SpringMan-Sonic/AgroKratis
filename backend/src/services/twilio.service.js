const twilio = require('twilio');
const translationService = require('./translation.service');
const firebaseService = require('./firebase.service');
const { findSeedByLocalName, calculateTotalCost } = require('../utils/helpers');
const RationCard = require('../models/rationCard.model');

exports.createLanguageMenu = (twiml) => {
  const gather = twiml.gather({
    numDigits: 1,
    action: '/api/voice/gather',
    method: 'POST'
  });

  gather.say({
    voice: 'alice',
    language: 'en-in'
  }, 'Hello, I am Agrokratis. 1 nokkandi Telugu kosam, Hindi ke liye 2 dabaiye, Tamizhukku 3-ai azhuthunga, Malayalaminu vendi 4 amarthuka, Kannadakke 5 oththiri');

  return twiml.toString();
};

exports.processStep = async (req, session, sessions) => {
  console.log('=== processStep called ===');
  console.log('Current step:', session.step);
  console.log('Digits:', req.body.Digits);
  console.log('Speech:', req.body.SpeechResult);
  
  const twiml = new twilio.twiml.VoiceResponse();
  const digits = req.body.Digits;
  const speechResult = req.body.SpeechResult;

  switch (session.step) {
    case 'language':
      console.log('Processing language selection');
      return this.handleLanguageSelection(twiml, session, digits);
    case 'ration':
      console.log('Processing ration verification');
      return await this.handleRationVerification(twiml, session, digits, speechResult);
    case 'seedMenu':
      console.log('Processing seed selection');
      return await this.handleSeedSelection(twiml, session, digits);
    case 'customSeed':
      console.log('Processing custom seed');
      return await this.handleCustomSeed(twiml, session, speechResult);
    case 'amount':
      console.log('Processing amount entry');
      return this.handleAmountEntry(twiml, session, digits, speechResult);
    case 'aadhaar':
      console.log('Processing aadhaar');
      return await this.handleAadhaarAndComplete(twiml, session, digits, speechResult);
    default:
      console.log('Invalid step:', session.step);
      twiml.say('Invalid step');
      return twiml.toString();
  }
};

exports.handleLanguageSelection = (twiml, session, digits) => {
  console.log('=== handleLanguageSelection ===');
  console.log('Selected digit:', digits);
  
  const langMap = { '1': 'te', '2': 'hi', '3': 'ta', '4': 'ml', '5': 'kn' };
  session.updateStep('ration', { language: langMap[digits] });
  
  console.log('Language set to:', session.language);

  const gather = twiml.gather({
    input: 'speech dtmf',
    action: '/api/voice/gather',
    method: 'POST',
    speechTimeout: 'auto',
    timeout: 5,
    numDigits: 4  
  });

  const translation = translationService.getTranslation(session.language);
  gather.say({
    voice: 'alice',
    language: 'en-in'
  }, translation.rationPrompt + '. Enter 4 digits using keypad or say your ration card number');

  return twiml.toString();
};

exports.handleRationVerification = async (twiml, session, digits, speechResult) => {
  console.log('=== handleRationVerification START ===');
  console.log('Received digits:', digits);
  console.log('Received speech:', speechResult);
  
  let rationNumber = null;
  
  if (digits) {
    if (digits.length === 4 && /^\d{4}$/.test(digits)) {
      rationNumber = 'RC' + digits;
    } 
    else if (digits.length === 6) {
      rationNumber = digits.toUpperCase();
    }
    else {
      rationNumber = digits.toString().trim().toUpperCase();
      if (!rationNumber.startsWith('RC') && /^\d{4}$/.test(rationNumber)) {
        rationNumber = 'RC' + rationNumber;
      }
    }
    console.log('Constructed from DTMF:', rationNumber);
  }
  // Handle Speech input
  else if (speechResult) {
    rationNumber = speechResult.toString().trim().toUpperCase().replace(/\s+/g, '');
    
    // If they said just 4 digits
    if (/^\d{4}$/.test(rationNumber)) {
      rationNumber = 'RC' + rationNumber;
    }
    
    // If missing RC prefix
    if (!rationNumber.startsWith('RC') && /\d{4}/.test(rationNumber)) {
      const numbers = rationNumber.match(/\d+/g);
      if (numbers && numbers.join('').length === 4) {
        rationNumber = 'RC' + numbers.join('');
      }
    }
    
    console.log('Constructed from Speech:', rationNumber);
  }
  
  console.log('Final rationNumber:', rationNumber);
  console.log('RationNumber length:', rationNumber?.length);
  
  // Validate format (should be RC0001 - 6 characters)
  if (!rationNumber || rationNumber.length !== 6 || !rationNumber.startsWith('RC')) {
    console.log('INVALID FORMAT');
    twiml.say({ voice: 'alice', language: 'en-in' }, 
      'Invalid ration card format. Please try again.');
    twiml.hangup();
    return twiml.toString();
  }
  
  try {
    // Look up in database
    console.log('Looking up ration card:', rationNumber);
    const cardData = await firebaseService.getRationCard(rationNumber);
    console.log('getRationCard returned:', cardData);
    
    if (!cardData) {
      console.log('CARD NOT FOUND');
      const allCards = await firebaseService.getAllRationCards();
      console.log('Total cards available:', allCards.length);
      console.log('First 3 cards:', allCards.slice(0, 3).map(c => c.number));
      
      twiml.say({ voice: 'alice', language: 'en-in' }, 
        'Ration card not found. Please check the number and try again.');
      twiml.hangup();
      return twiml.toString();
    }

    console.log('Card found! Checking if can order...');
    const rationCard = new RationCard(cardData);
    
    if (!rationCard.canOrder()) {
      console.log('CARD ALREADY USED');
      const translation = translationService.getTranslation(session.language);
      twiml.say({
        voice: 'alice',
        language: 'en-in'
      }, translation.rationUsed);
      twiml.hangup();
      return twiml.toString();
    }

    console.log('Card is valid! Moving to seed menu');
    session.updateStep('seedMenu', { rationCard: rationNumber });
    
    const gather = twiml.gather({
      numDigits: 1,
      action: '/api/voice/gather',
      method: 'POST'
    });

    const translation = translationService.getTranslation(session.language);
    gather.say({
      voice: 'alice',
      language: 'en-in'
    }, translation.seedMenu);

    console.log('=== handleRationVerification END (SUCCESS) ===');
    return twiml.toString();
    
  } catch (error) {
    console.error('ERROR in handleRationVerification:', error);
    twiml.say({ voice: 'alice', language: 'en-in' }, 
      'System error. Please try again later.');
    twiml.hangup();
    return twiml.toString();
  }
};

exports.handleSeedSelection = async (twiml, session, digits) => {
  console.log('=== handleSeedSelection ===');
  console.log('Selected seed digit:', digits);
  
  if (digits === '5') {
    console.log('Custom seed selected');
    session.updateStep('customSeed');
    const gather = twiml.gather({
      input: 'speech',
      action: '/api/voice/gather',
      method: 'POST',
      timeout: 5
    });
    gather.say({ voice: 'alice', language: 'en-in' }, 
      'Please say the seed name');
    return twiml.toString();
  }

  const seeds = await firebaseService.getAllSeeds();
  const seedIndex = parseInt(digits) - 1;
  const seed = seeds[seedIndex];
  
  console.log('Seed index:', seedIndex);
  console.log('Selected seed:', seed?.name);
  
  if (!seed || seed.stock <= 0) {
    console.log('Seed not available or out of stock');
    const translation = translationService.getTranslation(session.language);
    twiml.say({
      voice: 'alice',
      language: 'en-in'
    }, translation.seedNotAvailable);
    twiml.hangup();
    return twiml.toString();
  }

  console.log('Seed available, moving to amount entry');
  session.updateStep('amount', { selectedSeed: seed });
  
  const gather = twiml.gather({
    input: 'speech dtmf',
    action: '/api/voice/gather',
    method: 'POST',
    timeout: 5
  });

  // Use English seed name for clarity with en-in voice
  gather.say({
    voice: 'alice',
    language: 'en-in'
  }, `${seed.name}. Price ${seed.costPerKg} rupees per kilogram. How many grams do you need?`);

  return twiml.toString();
};

exports.handleCustomSeed = async (twiml, session, speechResult) => {
  console.log('=== handleCustomSeed ===');
  console.log('Spoken seed:', speechResult);
  
  const seeds = await firebaseService.getAllSeeds();
  const seed = findSeedByLocalName(speechResult, session.language, seeds);
  
  console.log('Found seed:', seed?.name);
  
  if (!seed || seed.stock <= 0) {
    console.log('Custom seed not found or out of stock');
    const translation = translationService.getTranslation(session.language);
    twiml.say({
      voice: 'alice',
      language: 'en-in'
    }, translation.seedNotAvailable);
    twiml.hangup();
    return twiml.toString();
  }

  console.log('Custom seed found, moving to amount entry');
  session.updateStep('amount', { selectedSeed: seed });
  
  const gather = twiml.gather({
    input: 'speech dtmf',
    action: '/api/voice/gather',
    method: 'POST',
    timeout: 5
  });

  gather.say({
    voice: 'alice',
    language: 'en-in'
  }, `${seed.name}. Price ${seed.costPerKg} rupees per kilogram. How many grams do you need?`);

  return twiml.toString();
};

exports.handleAmountEntry = (twiml, session, digits, speechResult) => {
  console.log('=== handleAmountEntry ===');
  console.log('Amount digits:', digits);
  console.log('Amount speech:', speechResult);
  
  if (digits === '9') {
    console.log('User pressed 9 to exit');
    twiml.say({ voice: 'alice', language: 'en-in' }, 
      'Thank you for calling. Goodbye.');
    twiml.hangup();
    session.updateStep('completed');
    return twiml.toString();
  }

  const amount = parseInt(digits || speechResult);
  const seed = session.selectedSeed;
  
  console.log('Parsed amount:', amount);
  console.log('Available stock:', seed.stock);
  
  if (isNaN(amount) || amount <= 0) {
    console.log('Invalid amount entered');
    twiml.say({ voice: 'alice', language: 'en-in' }, 
      'Invalid amount. Please enter a valid number.');
    
    const gather = twiml.gather({
      input: 'speech dtmf',
      action: '/api/voice/gather',
      method: 'POST',
      timeout: 5
    });
    
    gather.say({ voice: 'alice', language: 'en-in' }, 
      'How many grams do you need?');
    
    return twiml.toString();
  }
  
  if (amount > seed.stock) {
    console.log('Amount exceeds stock');
    const gather = twiml.gather({
      input: 'speech dtmf',
      action: '/api/voice/gather',
      method: 'POST',
      timeout: 5
    });

    gather.say({
      voice: 'alice',
      language: 'en-in'
    }, `Sorry, we only have ${seed.stock} grams available. Please enter a different amount or press 9 to exit.`);
    
    return twiml.toString();
  }

  console.log('Valid amount, moving to Aadhaar entry');
  session.updateStep('aadhaar', { amount });
  
  const totalCost = calculateTotalCost(amount, seed.costPerKg);
  console.log('Total cost:', totalCost);
  
  const gather = twiml.gather({
    input: 'speech dtmf',
    action: '/api/voice/gather',
    method: 'POST',
    timeout: 5,
    numDigits: 12
  });

  gather.say({
    voice: 'alice',
    language: 'en-in'
  }, `Total price ${totalCost} rupees. Please enter your 12 digit Aadhaar number using keypad.`);

  return twiml.toString();
};

exports.handleAadhaarAndComplete = async (twiml, session, digits, speechResult) => {
  console.log('=== handleAadhaarAndComplete ===');
  console.log('Aadhaar digits:', digits);
  console.log('Aadhaar speech:', speechResult);
  
  let aadhaar = (digits || speechResult || '').toString().replace(/\s+/g, '');
  
  console.log('Cleaned Aadhaar:', aadhaar);
  console.log('Aadhaar length:', aadhaar.length);
  
  // Validate Aadhaar (must be 12 digits)
  if (!/^\d{12}$/.test(aadhaar)) {
    console.log('Invalid Aadhaar format');
    twiml.say({ voice: 'alice', language: 'en-in' }, 
      'Invalid Aadhaar number. It must be exactly 12 digits. Please try again.');
    
    const gather = twiml.gather({
      input: 'speech dtmf',
      action: '/api/voice/gather',
      method: 'POST',
      timeout: 5,
      numDigits: 12
    });
    
    gather.say({ voice: 'alice', language: 'en-in' }, 
      'Please enter your 12 digit Aadhaar number');
    
    return twiml.toString();
  }
  
  try {
    console.log('Creating order...');
    
    // Create order
    const orderData = {
      date: new Date().toISOString(),
      seedName: session.selectedSeed.name,
      amount: session.amount,
      rationCard: session.rationCard,
      aadhaar: aadhaar,
      language: session.language
    };

    console.log('Order data:', orderData);

    await firebaseService.createOrder(orderData);
    console.log('Order created');
    
    // Update ration card
    await firebaseService.updateRationCard(session.rationCard, {
      used: true,
      lastUsed: new Date().toISOString()
    });
    console.log('Ration card updated');

    // Update stock
    await firebaseService.updateSeed(session.selectedSeed.id, {
      stock: session.selectedSeed.stock - session.amount
    });
    console.log('Stock updated');

    const translation = translationService.getTranslation(session.language);
    twiml.say({
      voice: 'alice',
      language: 'en-in'
    }, translation.orderConfirm);

    twiml.hangup();
    session.updateStep('completed');
    
    console.log('=== Order completed successfully! ===');
    return twiml.toString();
    
  } catch (error) {
    console.error('ERROR creating order:', error);
    twiml.say({ voice: 'alice', language: 'en-in' }, 
      'Error processing your order. Please try again later.');
    twiml.hangup();
    return twiml.toString();
  }
};