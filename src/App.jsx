import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar/Navbar'
import { isUserVendedor } from './service/localStorage'
import './utils/colors.css'
import './service/localStorage'
import Swal from "sweetalert2";

import Login from './components/login/Login'
import Register from './components/register/Register'
import AboutUs from './components/aboutUs/AboutUs';
import Home from './components/home/Home';
import Products from './components/products/Products';
import DetailProduct from './components/detailProduct/DetailProduct';
import NotFound from './components/notFound/NotFound';
import Contact from './components/contact';
import Blog from './components/blog';
import DetailBlog from './components/detailBlog/DetailBlog';
import ShoppingCart from './components/shoppingCart/ShoppingCart';
import Checkout from './components/checkout/Checkout';
import Payment from './components/payment/Payment';
import Offer from './components/offer/Offer';
import Admin from './components/admin';
import Vendedor from './components/vendedor';
import VendedorRoute from './components/VendedorRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import ListarUsuarios from './components/prueba/ListarUsuarios';
import './App.css'

function App() {
  return (

    <Router>
      <Navbar />
      {/* Contenedor global de notificaciones */}
      <ToastContainer />

      {/* Rutas principales */}
      <Routes>
        {/* Redirige la raíz "/" al home o vendedor según el rol */}
        <Route path="/" element={<RoleBasedRedirect />} />
        
        {/* Rutas protegidas - NO accesibles para vendedores */}
        <Route path="/home" element={<VendedorRoute><Home /></VendedorRoute>} />
        <Route path="/prueba" element={<VendedorRoute><ListarUsuarios/></VendedorRoute>}/>
        <Route path='/offer' element={<VendedorRoute><Offer /></VendedorRoute>} />
        <Route path='/payment' element={<VendedorRoute><Payment /></VendedorRoute>} />
        <Route path='/checkout' element={<VendedorRoute><Checkout /></VendedorRoute>} />
        <Route path='/shoppingcart' element={<VendedorRoute><ShoppingCart /></VendedorRoute>} />
        <Route path="/blog/:slug" element={<VendedorRoute><DetailBlog /></VendedorRoute>} />
        <Route path="/contact" element={<VendedorRoute><Contact /></VendedorRoute>} />
        <Route path="/blog" element={<VendedorRoute><Blog /></VendedorRoute>} />
        <Route path="/aboutus" element={<VendedorRoute><AboutUs /></VendedorRoute>} />
        <Route path="/products" element={<VendedorRoute><Products /></VendedorRoute>} />
        <Route path="/product/:id" element={<VendedorRoute><DetailProduct /></VendedorRoute>} />
        
        {/* Rutas de autenticación - accesibles para todos */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas de administración y vendedor */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/vendedor" element={<Vendedor />} />
        
        {/* Ruta 404 */}
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </Router>
  )
}

export default App
