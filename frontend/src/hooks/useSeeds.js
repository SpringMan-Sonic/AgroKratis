import { useState, useEffect } from 'react';
import { seedService } from '../services/seed.service';

export const useSeeds = () => {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeeds = async () => {
    try {
      setLoading(true);
      const data = await seedService.getAll();
      setSeeds(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSeed = async (seedData) => {
    try {
      const newSeed = await seedService.create(seedData);
      setSeeds([...seeds, newSeed]);
      return newSeed;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSeed = async (id, seedData) => {
    try {
      const updated = await seedService.update(id, seedData);
      setSeeds(seeds.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSeed = async (id) => {
    try {
      await seedService.delete(id);
      setSeeds(seeds.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSeeds();
  }, []);

  return { seeds, loading, error, addSeed, updateSeed, deleteSeed, refetch: fetchSeeds };
};