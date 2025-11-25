import api from './api';

const BASE = '/api/v1/roles';

export const getRoles = () => api.get(BASE).then(r => r.data);
export const getRole = (id) => api.get(`${BASE}/${id}`).then(r => r.data);
export const createRole = (payload) => api.post(BASE, payload).then(r => r.data);
export const updateRole = (id, payload) => api.put(`${BASE}/${id}`, payload).then(r => r.data);
export const deleteRole = (id) => api.delete(`${BASE}/${id}`).then(r => r.data);

export default {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
};
