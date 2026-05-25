import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const RationCardGrid = ({ rationCards, loading }) => {
  if (loading) return <LoadingSpinner />;

  return (
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
            {card.used ? (
              <XCircle className="text-red-500" size={24} />
            ) : (
              <CheckCircle className="text-green-500" size={24} />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {card.used 
              ? `Used: ${new Date(card.lastUsed).toLocaleDateString()}`
              : 'Available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RationCardGrid;