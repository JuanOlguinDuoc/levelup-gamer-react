import React from 'react'
import api from '../../service/api';
import { useState, useEffect } from 'react';

export default function ListarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const email = 'cliente@duoc.cl';
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get(`http://localhost:8080/api/v1/users/by-email/${encodeURIComponent(email)}`);
        setUsuarios([response.data]);
      } catch (error) {
        console.error('Error al listar usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>{usuario.email}</li>
        ))}
      </ul>
    </div>
  )
}
