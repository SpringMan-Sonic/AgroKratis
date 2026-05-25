import React, { useState, useEffect } from 'react';
import { Package, Users, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import axios from 'axios';
import dotenv from 'dotenv';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api';
console.log('API_URL:', API_URL); 


const useSeeds = () => {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSeeds = async () => {
    try {
      setLoading(true);
      console.log('Fetching seeds from:', `${API_URL}/seeds`);
      const response = await axios.get(`${API_URL}/seeds`);
      console.log('Seeds fetched:', response.data);
      setSeeds(response.data);
    } catch (error) {
      console.error('Error fetching seeds:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeeds();
    // Poll every 10 seconds
    const interval = setInterval(fetchSeeds, 10000);
    return () => clearInterval(interval);
  }, []);

  const addSeed = async (seedData) => {
    try {
      console.log('Adding seed:', seedData);
      const response = await axios.post(`${API_URL}/seeds`, seedData);
      console.log('Seed added:', response.data);
      setSeeds([...seeds, response.data]);
      return true;
    } catch (error) {
      console.error('Error adding seed:', error);
      return false;
    }
  };

  const updateSeed = async (id, updates) => {
    try {
      console.log('Updating seed:', id, updates);
      await axios.put(`${API_URL}/seeds/${id}`, updates);
      setSeeds(seeds.map(s => s.id === id ? { ...s, ...updates } : s));
      return true;
    } catch (error) {
      console.error('Error updating seed:', error);
      return false;
    }
  };

  const deleteSeed = async (id) => {
    try {
      console.log('Deleting seed:', id);
      await axios.delete(`${API_URL}/seeds/${id}`);
      setSeeds(seeds.filter(s => s.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting seed:', error);
      return false;
    }
  };

  return { seeds, loading, addSeed, updateSeed, deleteSeed, fetchSeeds };
};

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders from:', `${API_URL}/orders`);
      const response = await axios.get(`${API_URL}/orders`);
      console.log('Orders fetched:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return { orders, loading, fetchOrders };
};

const useRationCards = () => {
  const [rationCards, setRationCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRationCards = async () => {
    try {
      setLoading(true);
      console.log('Fetching ration cards from:', `${API_URL}/rationcards`);
      const response = await axios.get(`${API_URL}/rationcards`);
      console.log('Ration cards fetched:', response.data);
      setRationCards(response.data);
    } catch (error) {
      console.error('Error fetching ration cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRationCards();
    const interval = setInterval(fetchRationCards, 10000);
    return () => clearInterval(interval);
  }, []);

  return { rationCards, loading, fetchRationCards };
};


const Header = ({ title, subtitle }) => (
  <div className="bg-green-600 text-white shadow-lg">
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-green-100 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const SeedsPage = ({ seeds, loading, onAddSeed, onUpdateSeed, onDeleteSeed }) => {
  const [formData, setFormData] = useState({
    name: '',
    nameLocal: { te: '', hi: '', ta: '', ml: '', kn: '' },
    costPerKg: '',
    stock: ''
  });

  const handleSubmit = async () => {
    if (formData.name && formData.costPerKg && formData.stock) {
      const success = await onAddSeed(formData);
      if (success) {
        setFormData({
          name: '',
          nameLocal: { te: '', hi: '', ta: '', ml: '', kn: '' },
          costPerKg: '',
          stock: ''
        });
      }
    }
  };

  return (
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Telugu</label>
                <input
                  type="text"
                  value={formData.nameLocal.te}
                  onChange={(e) => setFormData({ ...formData, nameLocal: { ...formData.nameLocal, te: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hindi</label>
                <input
                  type="text"
                  value={formData.nameLocal.hi}
                  onChange={(e) => setFormData({ ...formData, nameLocal: { ...formData.nameLocal, hi: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tamil</label>
                <input
                  type="text"
                  value={formData.nameLocal.ta}
                  onChange={(e) => setFormData({ ...formData, nameLocal: { ...formData.nameLocal, ta: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Malayalam</label>
                <input
                  type="text"
                  value={formData.nameLocal.ml}
                  onChange={(e) => setFormData({ ...formData, nameLocal: { ...formData.nameLocal, ml: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Kannada</label>
                <input
                  type="text"
                  value={formData.nameLocal.kn}
                  onChange={(e) => setFormData({ ...formData, nameLocal: { ...formData.nameLocal, kn: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cost per KG (₹)</label>
              <input
                type="number"
                value={formData.costPerKg}
                onChange={(e) => setFormData({ ...formData, costPerKg: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock (grams)</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
            >
              Add Seed
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Current Inventory</h2>
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : (
            <div className="space-y-3">
              {seeds.map((seed) => (
                <div key={seed.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{seed.name}</h3>
                      <p className="text-sm text-gray-600">
                        TE: {seed.nameLocal?.te} | HI: {seed.nameLocal?.hi} | TA: {seed.nameLocal?.ta}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteSeed(seed.id)}
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
                        onChange={(e) => onUpdateSeed(seed.id, { stock: parseInt(e.target.value) })}
                        className="font-semibold w-full px-2 py-1 border rounded"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className={`font-semibold ${seed.stock > 1000 ? 'text-green-600' : 'text-orange-600'}`}>
                        {seed.stock > 1000 ? 'In Stock' : 'Low'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersPage = ({ orders, loading }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Recent Orders</h2>
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
        {orders.length} Orders
      </span>
    </div>
    {loading ? (
      <p className="text-center py-4">Loading orders...</p>
    ) : orders.length === 0 ? (
      <p className="text-center py-12 text-gray-500">No orders yet. Make a test call to create an order!</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Seed</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Ration Card</th>
              <th className="text-left py-3 px-4">Aadhaar</th>
              <th className="text-left py-3 px-4">Language</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{new Date(order.date).toLocaleString()}</td>
                <td className="py-3 px-4 font-medium">{order.seedName}</td>
                <td className="py-3 px-4">{order.amount}g</td>
                <td className="py-3 px-4">{order.rationCard}</td>
                <td className="py-3 px-4">{order.aadhaar}</td>
                <td className="py-3 px-4 uppercase">{order.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const RationCardsPage = ({ rationCards, loading }) => {
  const usedCount = rationCards.filter(c => c.used).length;
  const availableCount = rationCards.length - usedCount;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Ration Card Status</h2>
        <div className="flex gap-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {availableCount} Available
          </span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
            {usedCount} Used
          </span>
        </div>
      </div>
      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rationCards.map((card) => (
            <div
              key={card.number}
              className={`p-4 rounded-lg border-2 ${
                card.used ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{card.number}</span>
                <span className={`text-2xl ${card.used ? 'text-red-500' : 'text-green-500'}`}>
                  {card.used ? '✕' : '✓'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {card.used 
                  ? `Used: ${new Date(card.lastUsed).toLocaleString()}`
                  : 'Available'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App
const App = () => {
  const [activeTab, setActiveTab] = useState('seeds');
  
  const { seeds, loading: seedsLoading, addSeed, updateSeed, deleteSeed } = useSeeds();
  const { orders, loading: ordersLoading } = useOrders();
  const { rationCards, loading: cardsLoading } = useRationCards();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header 
        title="Agrokratis Admin Panel" 
        subtitle="Government Seed Distribution Management"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('seeds')}
              className={`px-6 py-4 font-semibold transition flex items-center gap-2 ${
                activeTab === 'seeds'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Package size={20} />
              Seed Inventory
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-semibold transition flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Users size={20} />
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('ration')}
              className={`px-6 py-4 font-semibold transition flex items-center gap-2 ${
                activeTab === 'ration'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Clock size={20} />
              Ration Cards
            </button>
          </div>
        </div>

        {activeTab === 'seeds' && (
          <SeedsPage
            seeds={seeds}
            loading={seedsLoading}
            onAddSeed={addSeed}
            onUpdateSeed={updateSeed}
            onDeleteSeed={deleteSeed}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersPage orders={orders} loading={ordersLoading} />
        )}

        {activeTab === 'ration' && (
          <RationCardsPage rationCards={rationCards} loading={cardsLoading} />
        )}
      </div>
    </div>
  );
};

export default App;