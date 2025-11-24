import Container from 'react-bootstrap/Container';
import { clearUserSession, isUserLoggedIn, isUserAdmin, isUserVendedor } from '../../service/localStorage.js';
import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { toast } from 'react-toastify';
import { confirmLogout } from '../../utils/alert.js';

export default function CustomNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [isAdmin, setIsAdmin] = useState(isUserAdmin());
  const [isVendedor, setIsVendedor] = useState(isUserVendedor());

  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(isUserLoggedIn());
      setIsAdmin(isUserAdmin());
      setIsVendedor(isUserVendedor());
    };
    window.addEventListener('authChanged', handler);
    return () => window.removeEventListener('authChanged', handler);
  }, []);

  const handleLogout = () => {
    confirmLogout(navigate); // ← Pasar navigate como parámetro
  }

  return (
    <Navbar expand="lg" className="navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="navbar-brand-custom">
          <img
            src="/images/logos/logo.png"
            alt="Level Up Gamer Logo"
            className="navbar-logo"
          />
          Level Up Gamer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isVendedor && <Nav.Link as={Link} to="/products">Productos</Nav.Link>}
            {!isVendedor && <Nav.Link as={Link} to="/aboutus">Sobre Nosotros</Nav.Link>}
            {!isVendedor && <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>}
            {!isVendedor && <Nav.Link as={Link} to="/blog">Blogs</Nav.Link>}
            {!isVendedor && <Nav.Link as={Link} to="/offer">Ofertas</Nav.Link>}
            {isAdmin && <Nav.Link as={Link} to="/admin">Administración</Nav.Link>}
            {isVendedor && <Nav.Link as={Link} to="/vendedor">Vendedor</Nav.Link>}
          </Nav>
          <Nav className="navbar-right-section">
            {/* Carrito visible solo para usuarios que NO son vendedores */}
            {!isVendedor && (
              <Nav.Link as={Link} to="/shoppingcart" className="nav-link-cart">
                <img
                  src="/images/icons/trolley-cart.png"
                  alt="Shopping Cart Icon"
                  className="cart-icon"
                />
              </Nav.Link>
            )}

            {isLoggedIn ? (
              // Si hay sesión iniciada, mostrar "Cerrar Sesión" e icono de usuario
              <div className="user-session-container">
                <Nav.Link onClick={handleLogout} className="nav-link-logout">
                  Cerrar Sesión
                </Nav.Link>
                <div className="user-avatar-container">
                  <img
                    src="/images/icons/profile.png"
                    alt="Usuario"
                    className="user-avatar"
                  />
                </div>
              </div>
            ) : (
              // Si no hay sesión, mostrar "Iniciar Sesión" y "Registro"
              <div className="auth-buttons-container">
                <Nav.Link as={Link} to="/login" className="nav-link-auth">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-auth">
                  Registro
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}