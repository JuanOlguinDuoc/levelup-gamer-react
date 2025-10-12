import React, { useState } from 'react'
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { Link, useNavigate } from 'react-router-dom'
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
    const [run, setRun] = useState('');
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('')
    const [apellidos, setApellidos] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})

    const handleSubmit = (e) => {
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
        if (isValid) {
            showSuccessToast('Registro exitoso')
            navigate('/home');
            console.log('Formulario válido:', { run, nombre, apellidos, direccion, email, password });
        } else {
            const errorMessages = Object.values(newErrors)
                .filter(msg => msg !== '')
                .forEach(msg => showErrorToast(msg));
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
