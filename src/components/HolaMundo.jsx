import React, { useState } from 'react'
import api from '../service/api'

export default function HolaMundo() {

const [nombre  , setNombre] = useState("")
const [mensaje , setMensaje] = useState("")    

const handleClick = async () => {
    const respuesta = await api.get(`http://localhost:8080/holaMundo/${nombre}`)
    setMensaje(respuesta.data)

}

  return (
    <div>
        
        <h1>Hola Mundo - Test</h1>

        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        <button onClick={handleClick}>
            Enviar nombre
            </button>    

        { mensaje && <p> Respuesta de la api del back: {mensaje} </p>}
    </div>
  )
}
