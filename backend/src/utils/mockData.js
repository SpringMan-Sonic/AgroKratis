module.exports = {
 seeds: [
  { id: 1, name: 'Rice', nameLocal: { te: 'Vari', hi: 'Chawal', ta: 'Arisi', ml: 'Ari', kn: 'Akki' }, costPerKg: 50, stock: 5000 },
  { id: 2, name: 'Wheat', nameLocal: { te: 'Godhuma', hi: 'Gehun', ta: 'Godhumai', ml: 'Gothambu', kn: 'Godhi' }, costPerKg: 40, stock: 4500 },
  { id: 3, name: 'Corn', nameLocal: { te: 'Mokkajonna', hi: 'Makka', ta: 'Cholam', ml: 'Cholam', kn: 'Jola' }, costPerKg: 35, stock: 3000 },
  { id: 4, name: 'Tomato', nameLocal: { te: 'Tomato', hi: 'Tamatar', ta: 'Thakkaali', ml: 'Thakkaali', kn: 'Tomato' }, costPerKg: 80, stock: 2000 },
  { id: 5, name: 'Onion', nameLocal: { te: 'Ullipaaya', hi: 'Pyaaz', ta: 'Vengaayam', ml: 'Ulli', kn: 'Erulli' }, costPerKg: 30, stock: 3500 },
  { id: 6, name: 'Potato', nameLocal: { te: 'Bangala Dumpa', hi: 'Aloo', ta: 'Urulaikizhangu', ml: 'Urulakizhangu', kn: 'Aloo Gadde' }, costPerKg: 25, stock: 4000 },
  { id: 7, name: 'Chili', nameLocal: { te: 'Mirapakaaya', hi: 'Mirch', ta: 'Milagaai', ml: 'Mulaku', kn: 'Mensina Kaayi' }, costPerKg: 100, stock: 1500 },
  { id: 8, name: 'Cotton', nameLocal: { te: 'Patthi', hi: 'Kapaas', ta: 'Paruthi', ml: 'Paruthi', kn: 'Hatti' }, costPerKg: 60, stock: 2500 },
  { id: 9, name: 'Soybean', nameLocal: { te: 'Soyaabeen', hi: 'Soyabean', ta: 'Soyabean', ml: 'Soyabean', kn: 'Soya' }, costPerKg: 55, stock: 3200 },
  { id: 10, name: 'Groundnut', nameLocal: { te: 'Verusanaga', hi: 'Moongphali', ta: 'Kadalai', ml: 'Nilakkadala', kn: 'Kadlekayi' }, costPerKg: 70, stock: 2800 }
]
,
  rationCards: Array.from({ length: 20 }, (_, i) => ({
    number: `RC${String(i + 1).padStart(4, '0')}`,
    used: false,
    lastUsed: null
  })),
  orders: []
};