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

// interceptor para detectar 401 y cerrar sesión automáticamente
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      setAuthToken(null);
      // redirigir a login (ajusta la ruta si usas base diferente)
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
