import api from './api';

const BASE = '/api/v1/platforms';

export const getPlatforms = () => api.get(BASE).then(r => r.data);
export const getPlatform = (id) => api.get(`${BASE}/${id}`).then(r => r.data);
export const createPlatform = (payload) => api.post(BASE, payload).then(r => r.data);
export const updatePlatform = (id, payload) => api.put(`${BASE}/${id}`, payload).then(r => r.data);
export const deletePlatform = (id) => api.delete(`${BASE}/${id}`).then(r => r.data);

export default {
  getPlatforms,
  getPlatform,
  createPlatform,
  updatePlatform,
  deletePlatform,
};
