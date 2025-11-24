import api from './api';

const BASE = '/api/v1/categories';

export const getCategories = () => api.get(BASE).then(r => r.data);
export const getCategory = (id) => api.get(`${BASE}/${id}`).then(r => r.data);
export const createCategory = (payload) => api.post(BASE, payload).then(r => r.data);
export const updateCategory = (id, payload) => api.put(`${BASE}/${id}`, payload).then(r => r.data);
export const deleteCategory = (id) => api.delete(`${BASE}/${id}`).then(r => r.data);

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
