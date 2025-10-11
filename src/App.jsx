import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './components/login/Login'
import Register from './components/register/Register'

import './App.css'

function App() {
  return (
    <Router>
      {/* Contenedor global de notificaciones */}
      <ToastContainer />

      {/* Rutas principales */}
      <Routes>
        {/* Redirige la raíz "/" al login */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Login y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
