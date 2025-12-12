import React, { useState } from 'react'
import api from '../service/api'

export default function Hola() {

    const nombre = "prueba"
    const [mensaje, setMensaje] = useState('')
    const token = localStorage.getItem('token');

    const click = async () => {
        const resp = await api.get(`http://localhost:8080/mundo/${nombre}`)
        setMensaje(resp.data)
    }

    return (
        <div>
            <h1>Prueba hola mundo</h1>
            <p>{token}</p>
            <input type="text" placeholder='ingrese nombre' value={nombre} onChange={e => setNombre(e.target.value)} />
            <button onClick={click}>Enviar nombre:</button>
            {mensaje && <p>Respuesta backend: {mensaje}</p>}
        </div>
    )
}
