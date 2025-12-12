import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setAuthToken } from './service/api';
import api from './service/api';
import { setUserSession, getCurrentUser } from './service/localStorage';
import './index.css';

const token = localStorage.getItem('token');
console.log('Rehidratando token:', token);
if (token) {
	setAuthToken(token);

	// Si hay token pero no hay currentUser rehidratado, intentar obtenerlo desde backend
	const currentUser = getCurrentUser();
	if (!currentUser) {
		const email = localStorage.getItem('email');
		if (email) {
			api.get(`/api/v1/users/by-email/${encodeURIComponent(email)}`)
				.then(resp => {
					if (resp?.data) {
						setUserSession(resp.data);
					}
				})
				.catch(() => {
					// fallback: crear sesión mínima con email para no romper páginas como checkout
					setUserSession({ email });
				});
		} else {
			// fallback mínimo: preservar token pero crear sesión vacía para evitar redirect
			setUserSession({});
		}
	}
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
