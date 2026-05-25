import React, { useState } from 'react';
import { useSeeds } from '../hooks/useSeeds';
import SeedList from '../components/seeds/SeedList';
import SeedForm from '../components/seeds/SeedForm';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Plus } from 'lucide-react';

const SeedsPage = () => {
  const { seeds, loading, addSeed, updateSeed, deleteSeed } = useSeeds();
  const [showModal, setShowModal] = useState(false);

  const handleAddSeed = async (seedData) => {
    await addSeed(seedData);
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add New Seed</h2>
            <Plus className="text-green-600" />
          </div>
          <SeedForm onSubmit={handleAddSeed} />
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Seed Inventory</h2>
          <SeedList
            seeds={seeds}
            loading={loading}
            onUpdateStock={updateSeed}
            onDelete={deleteSeed}
          />
        </div>
      </div>
    </div>
  );
};

export default SeedsPage;