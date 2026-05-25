import { useState, useEffect } from 'react';
import { rationCardService } from '../services/rationCard.service';

export const useRationCards = () => {
  const [rationCards, setRationCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRationCards = async () => {
    try {
      setLoading(true);
      const data = await rationCardService.getAll();
      setRationCards(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRationCards();
  }, []);

  return { rationCards, loading, error, refetch: fetchRationCards };
};