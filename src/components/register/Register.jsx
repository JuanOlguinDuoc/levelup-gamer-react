import React, { useState } from 'react'
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { useSearchParams ,Link, useNavigate } from 'react-router-dom'
import './Register.css'
import { registerUser } from '../../service/localStorage';
import api, { setAuthToken } from '../../service/api';
import { setUserSession } from '../../service/localStorage';
import {
    validationRun,
    validationName,
    validationApellidos,
    validationDireccion,
    validationEmail,
    validationPassword,
    validationConfirmPassword
} from './Validation'

export default function Register() {
    const navigate = useNavigate();
    const [run, setRun] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {}

        // Validación RUN
        if (!validationRun(run)) {
            newErrors.run = 'RUN inválido. Formato: 12345678-9';
            isValid = false;
        }

        // Validación Nombre
        if (!validationName(nombre)) {
            newErrors.nombre = 'Nombre inválido. Solo letras y espacios';
            isValid = false;
        }

        // Validación Apellidos
        if (!validationApellidos(apellidos)) {
            newErrors.apellidos = 'Apellidos inválidos. Solo letras y espacios';
            isValid = false;
        }

        // Validación Dirección
        if (!validationDireccion(direccion)) {
            newErrors.direccion = 'Dirección inválida. Debe ingresar una dirreción';
            isValid = false;
        }

        // Validación Email
        if (!validationEmail(email)) {
            newErrors.email = 'Email inválido';
            isValid = false;
        }

        // Validación Contraseña
        if (!validationPassword(password)) {
            newErrors.password = 'Contraseña debe tener al menos 4 caracteres y un máximo de 10';
            isValid = false;
        }

        // Validación Confirmar Contraseña
        if (!validationConfirmPassword(password, confirmPassword)) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
            // mapear nombres de tu form a los campos del backend
            const payload = {
                run,
                firstName: nombre,
                lastName: apellidos,
                email,
                password,
                role: "cliente" // o "cliente", "usuario", o enviar { "name": "..." } según tu API
            };

            // guardar token previo y quitar Authorization antes de llamar register
            const prevToken = localStorage.getItem('token');
            console.debug('[Register] prevToken:', prevToken, 'payload:', payload);
            setAuthToken(null);

            // luego llamar register sin Authorization
            const resp = await api.post('/api/auth/register', payload);
            const data = resp.data || {};
            console.debug('[Register] resp status:', resp.status, 'data:', data);

            if (data.token) {
                setAuthToken(data.token);
                                // establecer sesión mínima inmediatamente para actualizar UI
                                try {
                                    setUserSession({ email: data.email || email, name: data.name || nombre, run });
                                } catch (e) { /* noop */ }
                                // intentar obtener perfil completo del usuario desde backend y reemplazar la sesión
                                try {
                                    const respUser = await api.get(`/api/v1/users/by-email/${encodeURIComponent(data.email || email)}`);
                                    if (respUser?.data) {
                                        setUserSession(respUser.data);
                                    }
                                } catch (err) {
                                    // fallback: ya tenemos sesión mínima
                                }
                                localStorage.setItem('email', data.email || email);
                showSuccessToast(data.message || 'Registro exitoso');
                console.debug('[Register] localStorage after setUserSession:', {
                    token: localStorage.getItem('token'),
                    email: localStorage.getItem('email'),
                    isLoggedIn: localStorage.getItem('isLoggedIn'),
                    currentUser: localStorage.getItem('currentUser')
                });
                navigate(redirectTo);
            } else {
                showErrorToast(data.message || 'Error en registro');
            }
            // restaurar token previo si existía y la respuesta no entregó uno nuevo
            if (!data.token && prevToken) {
                setAuthToken(prevToken);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Error de red al registrar';
            showErrorToast(msg);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className='form'>
            <h2>Registro</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <input type="text" id="run" name="run" placeholder="RUN EJ: 12345678-9*" value={run} onChange={(e) => setRun(e.target.value)} />
                <input type="text" id="nombre" name="nombre" placeholder="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <input type="text" id="apellidos" name="apellidos" placeholder="Apellidos *" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                <input type="text" id="direccion" name="direccion" placeholder="Dirección *" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                <input type="email" id="email" name="email" placeholder="Correo Electrónico *" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" id="password" name="password" placeholder="Contraseña *" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmar Contraseña *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit" className="btn">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Crear cuenta
                </button>
            </form>
            <p className="message">¿Ya tienes una cuenta? <Link to="/login"> Iniciar sesión</Link></p>
        </div>
    )
}
