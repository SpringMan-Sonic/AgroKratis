const firebaseService = require('../services/firebase.service');
const RationCard = require('../models/rationCard.model');

const sessions = {};

const translations = {
  te: {
    welcome: "Namaskaram. Nenu Agrokratis. Telugu kosam okati nokkandi, Hindi ke liye do dabaiye, Tamil ke liye tin dabaiye, Malayalam ke liye char dabaiye, Kannada ke liye panch dabaiye.",
    rationPrompt: "Dayachesi mee ration card number cheppandi",
    invalidRation: "Invalid ration card. Please try again.",
    seedMenu: "Viththanaalu enchukondi. Vari kosam okati nokkandi, godhumalu kosam rendu nokkandi, mokkajonna kosam moodu nokkandi",
    amountPrompt: "How many grams do you need?",
    aadhaarPrompt: "Please enter your 12 digit Aadhaar number",
    confirmation: "Mee order nirdharincha badindi. Dhanyavaadalu"
  },
  hi: {
    welcome: "Namaste. Main Agrokratis hoon. Telugu ke liye ek dabaiye, Hindi ke liye do dabaiye, Tamil ke liye tin dabaiye, Malayalam ke liye char dabaiye, Kannada ke liye panch dabaiye.",
    rationPrompt: "Kripya apna ration card number bataiye",
    invalidRation: "Invalid ration card. Kripya phir se koshish karein.",
    seedMenu: "Beej chuniye. Chawal ke liye ek dabaiye, gehun ke liye do dabaiye, makka ke liye tin dabaiye",
    amountPrompt: "Kitne gram chahiye?",
    aadhaarPrompt: "Kripya apna 12 digit Aadhaar number daalen",
    confirmation: "Aapka order confirm ho gaya hai. Dhanyavaad"
  },
  ta: {
    welcome: "Vanakkam. Naan Agrokratis. Telugu kku ondru, Hindi kku irandu, Tamil kku moondru, Malayalam kku naangu, Kannada kku ainthu.",
    rationPrompt: "Ungal ration card number sollungal",
    invalidRation: "Invalid ration card. Please try again.",
    seedMenu: "Seeds teervu seyyavum. Arisi kku ondru, godhumai kku irandu, cholam kku moondru",
    amountPrompt: "Evvalavu gram vendhum?",
    aadhaarPrompt: "Ungal 12 digit Aadhaar number enter seyyavum",
    confirmation: "Ungal order confirm aagiyathu. Nandri"
  },
  ml: {
    welcome: "Namaskaram. Njaan Agrokratis. Telugu kku onnu, Hindi kku randu, Tamil kku moonnu, Malayalam kku naalu, Kannada kku anchu.",
    rationPrompt: "Ningalude ration card number parayuka",
    invalidRation: "Invalid ration card. Please try again.",
    seedMenu: "Seeds thiranjedukuka. Ari kku onnu, gothambu kku randu, cholam kku moonnu",
    amountPrompt: "Ethra gram venam?",
    aadhaarPrompt: "Ningalude 12 digit Aadhaar number kodukuka",
    confirmation: "Ningalude order confirm cheythu. Nanni"
  },
  kn: {
    welcome: "Namaskara. Naanu Agrokratis. Telugu kke ondu, Hindi kke eradu, Tamil kke mooru, Malayalam kke naalku, Kannada kke aidu.",
    rationPrompt: "Nimma ration card number heli",
    invalidRation: "Invalid ration card. Please try again.",
    seedMenu: "Seeds choice maadi. Akki kke ondu, godhi kke eradu, jola kke mooru",
    amountPrompt: "Estu gram beku?",
    aadhaarPrompt: "Nimma 12 digit Aadhaar number kodi",
    confirmation: "Nimma order confirm aagide. Dhanyavaadagalu"
  }
};

function generateTwiML(say, gather = null, hangup = false) {
  let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';
  
  if (gather) {
    twiml += `<Gather numDigits="${gather.numDigits}" action="${gather.action}" timeout="${gather.timeout || 5}" input="${gather.input || 'dtmf'}">`;
    twiml += `<Say voice="alice" language="en-IN">${say}</Say>`;
    twiml += '</Gather>';
  } else {
    twiml += `<Say voice="alice" language="en-IN">${say}</Say>`;
  }
  
  if (hangup) {
    twiml += '<Hangup/>';
  }
  
  twiml += '</Response>';
  return twiml;
}

exports.handleIncomingCall = async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    
    console.log(`Incoming call: ${callSid}`);
    
    // Create new session
    sessions[callSid] = {
      callSid,
      step: 'language',
      language: null,
      rationCard: null,
      selectedSeed: null,
      amount: null
    };
    
    const welcomeMsg = "Hello, I am Agrokratis. 1 nokkandi Telugu kosam, Hindi ke liye 2 dabaiye, Tamizhukku 3-ai azhuthunga, Malayalaminu vendi 4 amarthuka, Kannadakke 5 oththiri";
    
    const twiml = generateTwiML(welcomeMsg, {
      numDigits: 1,
      action: '/api/voice/gather',
      timeout: 5
    });
    
    res.type('text/xml');
    res.send(twiml);
    
  } catch (error) {
    console.error('Error in handleIncomingCall:', error);
    const errorTwiml = generateTwiML('Sorry, there was an error. Please try again later.', null, true);
    res.type('text/xml');
    res.send(errorTwiml);
  }
};

exports.handleGather = async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    const session = sessions[callSid];
    
    if (!session) {
      console.error(`Session not found for call: ${callSid}`);
      const errorTwiml = generateTwiML('Session expired. Please call again.', null, true);
      return res.type('text/xml').send(errorTwiml);
    }
    
    console.log(`🔄 Processing step: ${session.step}`);
    
    let twiml;
    
    switch (session.step) {
      case 'language':
        twiml = await handleLanguageSelection(req, session);
        break;
      case 'ration':
        twiml = await handleRationVerification(req, session);
        break;
      case 'seedMenu':
        twiml = await handleSeedSelection(req, session);
        break;
      case 'amount':
        twiml = await handleAmountEntry(req, session);
        break;
      case 'aadhaar':
        twiml = await handleAadhaarAndComplete(req, session);
        break;
      default:
        twiml = generateTwiML('Invalid step. Please call again.', null, true);
    }
    
    res.type('text/xml');
    res.send(twiml);
    
  } catch (error) {
    console.error('Error in handleGather:', error);
    const errorTwiml = generateTwiML('An error occurred. Please try again.', null, true);
    res.type('text/xml').send(errorTwiml);
  }
};

exports.handleHangup = async (req, res) => {
  try {
    const callSid = req.body.CallSid;
    
    if (sessions[callSid]) {
      delete sessions[callSid];
      console.log(`🔚 Session cleaned up: ${callSid}`);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in handleHangup:', error);
    res.status(500).send('Error');
  }
};


async function handleLanguageSelection(req, session) {
  const digits = req.body.Digits;
  
  const languageMap = {
    '1': 'te',
    '2': 'hi',
    '3': 'ta',
    '4': 'ml',
    '5': 'kn'
  };
  
  const language = languageMap[digits];
  
  if (!language) {
    return generateTwiML(
      'Invalid selection. Press 1 for Telugu, 2 for Hindi, 3 for Tamil, 4 for Malayalam, 5 for Kannada.',
      { numDigits: 1, action: '/api/voice/gather' }
    );
  }
  
  session.language = language;
  session.step = 'ration';
  
  console.log(`Language selected: ${language}`);
  
  const prompt = translations[language].rationPrompt;
  
  return generateTwiML(prompt, {
    numDigits: 4,
    action: '/api/voice/gather',
    input: 'dtmf speech',
    timeout: 5
  });
}

async function handleRationVerification(req, session) {
  const digits = req.body.Digits;
  const speechResult = req.body.SpeechResult;
  
  let rationNumber = null;
  
  if (digits && /^\d{4}$/.test(digits)) {
    rationNumber = 'RC' + digits;
  } else if (speechResult) {
    const cleaned = speechResult.toUpperCase().replace(/\s+/g, '');
    if (/RC\d{4}/.test(cleaned)) {
      rationNumber = cleaned;
    } else if (/^\d{4}$/.test(cleaned)) {
      rationNumber = 'RC' + cleaned;
    }
  }
  
  if (!rationNumber) {
    const prompt = translations[session.language].invalidRation;
    return generateTwiML(prompt, {
      numDigits: 4,
      action: '/api/voice/gather',
      input: 'dtmf speech'
    });
  }
  
  console.log(`Checking ration card: ${rationNumber}`);
  
  // Check ration card in database
  const cardData = await firebaseService.getRationCard(rationNumber);
  
  if (!cardData) {
    return generateTwiML(
      'Ration card not found. Please enter a valid 4 digit number.',
      { numDigits: 4, action: '/api/voice/gather', input: 'dtmf speech' }
    );
  }
  
  // Check eligibility
  const card = new RationCard(cardData);
  
  if (!card.canOrder()) {
    const daysRemaining = card.getDaysRemaining();
    return generateTwiML(
      `This card was used recently. You can order again in ${daysRemaining} days. Thank you.`,
      null,
      true
    );
  }
  
  session.rationCard = rationNumber;
  session.step = 'seedMenu';
  
  console.log(`Ration card verified: ${rationNumber}`);
  
  const prompt = translations[session.language].seedMenu;
  
  return generateTwiML(prompt, {
    numDigits: 1,
    action: '/api/voice/gather'
  });
}

async function handleSeedSelection(req, session) {
  const digits = req.body.Digits;
  
  const seedMap = {
    '1': 'Rice',
    '2': 'Wheat',
    '3': 'Corn'
  };
  
  const seedName = seedMap[digits];
  
  if (!seedName) {
    const prompt = translations[session.language].seedMenu;
    return generateTwiML('Invalid selection. ' + prompt, {
      numDigits: 1,
      action: '/api/voice/gather'
    });
  }
  
  // Get seeds from database
  const seeds = await firebaseService.getAllSeeds();
  const seed = seeds.find(s => s.name === seedName);
  
  if (!seed || seed.stock <= 0) {
    const prompt = translations[session.language].seedMenu;
    return generateTwiML('Seed out of stock. ' + prompt, {
      numDigits: 1,
      action: '/api/voice/gather'
    });
  }
  
  session.selectedSeed = seed;
  session.step = 'amount';
  
  console.log(`Seed selected: ${seedName}`);
  
  const pricePerKg = seed.costPerKg;
  const amountPrompt = `${seedName}. Price ${pricePerKg} rupees per kilogram. ${translations[session.language].amountPrompt}`;
  
  return generateTwiML(amountPrompt, {
    numDigits: 4,
    action: '/api/voice/gather',
    input: 'dtmf speech',
    timeout: 5
  });
}

async function handleAmountEntry(req, session) {
  const digits = req.body.Digits;
  const amount = parseInt(digits);
  
  if (isNaN(amount) || amount <= 0) {
    return generateTwiML(
      'Invalid amount. Please enter a valid number in grams.',
      { numDigits: 4, action: '/api/voice/gather', input: 'dtmf speech' }
    );
  }
  
  if (amount > session.selectedSeed.stock) {
    return generateTwiML(
      `Amount exceeds available stock of ${session.selectedSeed.stock} grams. Please enter a smaller amount.`,
      { numDigits: 4, action: '/api/voice/gather', input: 'dtmf speech' }
    );
  }
  
  session.amount = amount;
  session.step = 'aadhaar';
  
  console.log(`Amount entered: ${amount}g`);
  
  const totalPrice = ((amount / 1000) * session.selectedSeed.costPerKg).toFixed(2);
  const prompt = `Total price ${totalPrice} rupees. ${translations[session.language].aadhaarPrompt}`;
  
  return generateTwiML(prompt, {
    numDigits: 12,
    action: '/api/voice/gather',
    timeout: 10
  });
}

async function handleAadhaarAndComplete(req, session) {
  const aadhaar = req.body.Digits;
  
  if (!aadhaar || aadhaar.length !== 12) {
    return generateTwiML(
      'Invalid Aadhaar. Please enter exactly 12 digits.',
      { numDigits: 12, action: '/api/voice/gather', timeout: 10 }
    );
  }
  
  try {
    console.log(`Processing order for Aadhaar: ${aadhaar.slice(0, 4)}****`);
    
    // Create order
    await firebaseService.createOrder({
      seedName: session.selectedSeed.name,
      amount: session.amount,
      rationCard: session.rationCard,
      aadhaar: aadhaar,
      language: session.language,
      date: new Date().toISOString()
    });
    
    // Update ration card
    await firebaseService.updateRationCard(session.rationCard, {
      used: true,
      lastUsed: new Date().toISOString()
    });
    
    // Update seed stock
    await firebaseService.updateSeed(session.selectedSeed.id, {
      stock: session.selectedSeed.stock - session.amount
    });
    
    console.log(`Order completed successfully`);
    
    session.step = 'completed';
    
    const confirmMsg = translations[session.language].confirmation;
    
    return generateTwiML(confirmMsg, null, true);
    
  } catch (error) {
    console.error('Error completing order:', error);
    return generateTwiML(
      'Error processing your order. Please try again later.',
      null,
      true
    );
  }
}