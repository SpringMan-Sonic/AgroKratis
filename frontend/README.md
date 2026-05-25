# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





app.jsx
// This is the complete Admin Panel integrated with all components
// For actual implementation, create separate files as shown in the structure guide

import React, { useState, useEffect } from 'react';
import { Plus, Package, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock Firebase functions - replace with actual Firebase in production
const mockFirebase = {
  seeds: [
    { id: 1, name: 'Rice', nameLocal: { te: 'వరి', hi: 'चावल', ta: 'அரிசி', ml: 'അരി', kn: 'ಅಕ್ಕಿ' }, costPerKg: 50, stock: 5000 },
    { id: 2, name: 'Wheat', nameLocal: { te: 'గోధుమ', hi: 'गेहूं', ta: 'கோதுமை', ml: 'ഗോതമ്പ്', kn: 'ಗೋಧಿ' }, costPerKg: 40, stock: 4500 },
    { id: 3, name: 'Corn', nameLocal: { te: 'మొక్కజొన్న', hi: 'मक्का', ta: 'சோளம்', ml: 'ചോളം', kn: 'ಜೋಳ' }, costPerKg: 35, stock: 3000 },
    { id: 4, name: 'Tomato', nameLocal: { te: 'టొమాటో', hi: 'टमाटर', ta: 'தக்காளி', ml: 'തക്കാളി', kn: 'ಟೊಮೆಟೊ' }, costPerKg: 80, stock: 2000 }
  ],
  rationCards: Array.from({ length: 20 }, (_, i) => ({
    number: `RC${String(i + 1).padStart(4, '0')}`,
    used: false,
    lastUsed: null
  })),
  orders: []
};

const App = () => {
  const [seeds, setSeeds] = useState(mockFirebase.seeds);
  const [orders, setOrders] = useState(mockFirebase.orders);
  const [rationCards, setRationCards] = useState(mockFirebase.rationCards);
  const [activeTab, setActiveTab] = useState('seeds');
  
  const [newSeed, setNewSeed] = useState({
    name: '',
    nameLocal: { te: '', hi: '', ta: '', ml: '', kn: '' },
    costPerKg: '',
    stock: ''
  });

  useEffect(() => {
    // Load from localStorage to simulate persistence
    const savedSeeds = localStorage.getItem('agrokratis_seeds');
    const savedOrders = localStorage.getItem('agrokratis_orders');
    const savedRationCards = localStorage.getItem('agrokratis_rationCards');
    
    if (savedSeeds) setSeeds(JSON.parse(savedSeeds));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedRationCards) setRationCards(JSON.parse(savedRationCards));
  }, []);

  const handleAddSeed = () => {
    if (!newSeed.name || !newSeed.costPerKg || !newSeed.stock) return;
    
    const seed = {
      id: Date.now(),
      name: newSeed.name,
      nameLocal: newSeed.nameLocal,
      costPerKg: parseFloat(newSeed.costPerKg),
      stock: parseFloat(newSeed.stock)
    };
    
    const updatedSeeds = [...seeds, seed];
    setSeeds(updatedSeeds);
    localStorage.setItem('agrokratis_seeds', JSON.stringify(updatedSeeds));
    
    setNewSeed({
      name: '',
      nameLocal: { te: '', hi: '', ta: '', ml: '', kn: '' },
      costPerKg: '',
      stock: ''
    });
  };

  const handleDeleteSeed = (id) => {
    const updatedSeeds = seeds.filter(s => s.id !== id);
    setSeeds(updatedSeeds);
    localStorage.setItem('agrokratis_seeds', JSON.stringify(updatedSeeds));
  };

  const updateStock = (id, newStock) => {
    const updatedSeeds = seeds.map(s => 
      s.id === id ? { ...s, stock: parseFloat(newStock) } : s
    );
    setSeeds(updatedSeeds);
    localStorage.setItem('agrokratis_seeds', JSON.stringify(updatedSeeds));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Agrokratis Admin Panel</h1>
          <p className="text-green-100 mt-1">Government Seed Distribution Management</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('seeds')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'seeds'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Package className="inline mr-2" size={20} />
              Seed Inventory
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'orders'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Users className="inline mr-2" size={20} />
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('ration')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'ration'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Clock className="inline mr-2" size={20} />
              Ration Cards
            </button>
          </div>
        </div>

        {activeTab === 'seeds' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Plus className="mr-2" />
                  Add New Seed
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Seed Name (English)</label>
                    <input
                      type="text"
                      value={newSeed.name}
                      onChange={(e) => setNewSeed({ ...newSeed, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Telugu</label>
                      <input
                        type="text"
                        value={newSeed.nameLocal.te}
                        onChange={(e) => setNewSeed({ ...newSeed, nameLocal: { ...newSeed.nameLocal, te: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Hindi</label>
                      <input
                        type="text"
                        value={newSeed.nameLocal.hi}
                        onChange={(e) => setNewSeed({ ...newSeed, nameLocal: { ...newSeed.nameLocal, hi: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tamil</label>
                      <input
                        type="text"
                        value={newSeed.nameLocal.ta}
                        onChange={(e) => setNewSeed({ ...newSeed, nameLocal: { ...newSeed.nameLocal, ta: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Malayalam</label>
                      <input
                        type="text"
                        value={newSeed.nameLocal.ml}
                        onChange={(e) => setNewSeed({ ...newSeed, nameLocal: { ...newSeed.nameLocal, ml: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Kannada</label>
                      <input
                        type="text"
                        value={newSeed.nameLocal.kn}
                        onChange={(e) => setNewSeed({ ...newSeed, nameLocal: { ...newSeed.nameLocal, kn: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cost per KG (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSeed.costPerKg}
                      onChange={(e) => setNewSeed({ ...newSeed, costPerKg: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Stock (grams)</label>
                    <input
                      type="number"
                      min="0"
                      value={newSeed.stock}
                      onChange={(e) => setNewSeed({ ...newSeed, stock: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    onClick={handleAddSeed}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Add Seed
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Current Inventory</h2>
                <div className="space-y-3">
                  {seeds.map((seed) => (
                    <div key={seed.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{seed.name}</h3>
                          <p className="text-sm text-gray-600">
                            TE: {seed.nameLocal.te} | HI: {seed.nameLocal.hi} | TA: {seed.nameLocal.ta} | ML: {seed.nameLocal.ml} | KN: {seed.nameLocal.kn}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSeed(seed.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-semibold">₹{seed.costPerKg}/kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Stock</p>
                          <input
                            type="number"
                            value={seed.stock}
                            onChange={(e) => updateStock(seed.id, e.target.value)}
                            className="font-semibold w-full px-2 py-1 border rounded"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className={`font-semibold ${seed.stock > 1000 ? 'text-green-600' : 'text-orange-600'}`}>
                            {seed.stock > 1000 ? 'In Stock' : 'Low Stock'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Seed</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Ration Card</th>
                      <th className="text-left py-3 px-4">Aadhaar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">2026-01-29</td>
                        <td className="py-3 px-4">Wheat</td>
                        <td className="py-3 px-4">0.04 rupees</td>
                        <td className="py-3 px-4">RC0001</td>
                        <td className="py-3 px-4">123456789854</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ration' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Ration Card Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rationCards.map((card) => (
                <div
                  key={card.number}
                  className={`p-4 rounded-lg border-2 ${
                    card.used ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{card.number}</span>
                    {card.used ? (
                      <XCircle className="text-red-500" size={20} />
                    ) : (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {card.used ? `Used: ${card.lastUsed}` : 'Available'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

