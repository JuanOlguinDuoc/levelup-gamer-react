import { useState } from 'react'
import { validationPassword, validationEmail } from './Validation.js';
import { showErrorToast, showSuccessToast } from '../../utils/toast.js';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
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
        if (isValid) {
            showSuccessToast('Inicio de sesión exitoso')
            navigate('/home');
            console.log('Formulario enviado');
        } else {
            const errorMessages = Object.values(newErrors)
                .filter(msg => msg !== '')
                .forEach(msg => showErrorToast(msg));
        }
    };

    return (
        <div className="form">
            <h2>Inicio de sesión</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input type="email" id="email" name="email" placeholder="Correo Electrónico *" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                <input type="password" id="password" name="password" placeholder="Contraseña *" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                <Button type="submit" className="btn" >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Iniciar sesión
                </Button>
            </form>
            <p className="message">¿No tienes una cuenta? <Link to="/register"> Crear cuenta</Link></p>
        </div>
    )
}
