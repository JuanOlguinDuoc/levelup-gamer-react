import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/navbar/Navbar'
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
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path='/offer' element={<Offer />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/shoppingcart' element={<ShoppingCart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:slug" element={<DetailBlog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </Router>
  )
}

export default App
