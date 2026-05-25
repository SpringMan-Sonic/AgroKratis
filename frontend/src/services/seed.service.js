import api from './api.service';

export const seedService = {
  getAll: async () => {
    const response = await api.get('/seeds');
    return response.data;
  },

  create: async (seedData) => {
    const response = await api.post('/seeds', seedData);
    return response.data;
  },

  update: async (id, seedData) => {
    const response = await api.put(`/seeds/${id}`, seedData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/seeds/${id}`);
    return response.data;
  }
};