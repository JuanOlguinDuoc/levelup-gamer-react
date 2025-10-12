import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar/Navbar'
import './utils/colors.css'
import  Button  from 'react-bootstrap/Button';

import Login from './components/login/Login'
import Register from './components/register/Register'
import AboutUs from './components/aboutUs/AboutUs';

import './App.css'

function App() {
  return (
    
    <Router>
      <Navbar />
      {/* Contenedor global de notificaciones */}
      <ToastContainer />

      {/* Rutas principales */}
      <Routes>
        {/* Redirige la raíz "/" al home */}
        
        {/* Login y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </Router>
  )
}

export default App
