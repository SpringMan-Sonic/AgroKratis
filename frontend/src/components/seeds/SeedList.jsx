import React from 'react';
import SeedCard from './SeedCard';
import LoadingSpinner from '../common/LoadingSpinner';

const SeedList = ({ seeds, loading, onUpdateStock, onDelete }) => {
  if (loading) return <LoadingSpinner />;

  if (seeds.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No seeds available. Add some seeds to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {seeds.map(seed => (
        <SeedCard
          key={seed.id}
          seed={seed}
          onUpdateStock={onUpdateStock}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SeedList;