import api from './api.service';

export const rationCardService = {
  getAll: async () => {
    const response = await api.get('/rationcards');
    return response.data;
  },

  check: async (number) => {
    const response = await api.get(`/rationcards/${number}`);
    return response.data;
  }
};