import React from 'react';
import { useRationCards } from '../hooks/useRationCards';
import RationCardGrid from '../components/rationCards/RationCardGrid';

const RationCardsPage = () => {
  const { rationCards, loading } = useRationCards();

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
      <RationCardGrid rationCards={rationCards} loading={loading} />
    </div>
  );
};

export default RationCardsPage;