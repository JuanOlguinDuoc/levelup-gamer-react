import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
