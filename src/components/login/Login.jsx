import React, { useState } from 'react'
import { validationPassword, validationEmail } from './Validation.js';
import { showErrorToast, showSuccessToast } from '../../utils/toast.js';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import './Login.css'

import api, { setAuthToken } from '../../service/api';
import { setUserSession } from '../../service/localStorage';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = { email: '', password: '' }

        if (!validationEmail(email)) {
            newErrors.email = 'Correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com'
            isValid = false;
        }

        if (!validationPassword(password)) {
            newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) {
            Object.values(newErrors)
                .filter(msg => msg !== '')
                .forEach(msg => showErrorToast(msg));
            return;
        }

        setLoading(true);
        try {
            const resp = await api.post('/api/auth/login', { email, password });
            const data = resp.data || {};
            const token = data.token;

                        if (token) {
                                // guardar token y configurar instancia api
                                setAuthToken(token);
                                // establecer sesión mínima inmediatamente para actualizar UI (Navbar, Checkout)
                                try {
                                    setUserSession({ email: data.email || email, name: data.name || data.firstName || '' });
                                } catch (e) { /* noop */ }
                                // intentar obtener perfil completo del usuario desde backend y reemplazar la sesión
                                try {
                                    const respUser = await api.get(`/api/v1/users/by-email/${encodeURIComponent(data.email || email)}`);
                                    if (respUser?.data) {
                                        setUserSession(respUser.data);
                                    }
                                } catch (err) {
                                    // si falla, ya tenemos una sesión mínima
                                }
                                localStorage.setItem('email', data.email || email);

                showSuccessToast(data.message || 'Inicio de sesión exitoso');
                navigate(redirectTo);
            } else {
                showErrorToast(data.message || 'Credenciales inválidas');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Error de red al intentar iniciar sesión';
            showErrorToast(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form">
            <h2>Inicio de sesión</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Correo Electrónico *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Contraseña *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit" className="btn" disabled={loading}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
            </form>
            <p className="message">¿No tienes una cuenta?
                <Link to={`/register${redirectTo ? `?redirect=${redirectTo}` : ''}`}>
                    Crear Cuenta
                </Link>
            </p>
        </div>
    )
}
