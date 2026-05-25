import React from 'react';
import { Package } from 'lucide-react';

const SeedCard = ({ seed, onEdit, onDelete, onUpdateStock }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Package className="text-green-600" size={24} />
          <h3 className="font-bold text-lg">{seed.name}</h3>
        </div>
        <button
          onClick={() => onDelete(seed.id)}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        TE: {seed.nameLocal.te} | HI: {seed.nameLocal.hi} | TA: {seed.nameLocal.ta}
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="font-semibold">₹{seed.costPerKg}/kg</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Stock</p>
          <input
            type="number"
            value={seed.stock}
            onChange={(e) => onUpdateStock(seed.id, e.target.value)}
            className="w-full px-2 py-1 border rounded font-semibold"
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
  );
};

export default SeedCard;