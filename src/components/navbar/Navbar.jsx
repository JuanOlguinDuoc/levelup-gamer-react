import Container from 'react-bootstrap/Container';
import { clearUserSession, isUserLoggedIn } from '../../service/localStorage.js';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

export default function CustomNavbar() {
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();

  const handleLogout = () => {
    clearUserSession();
    navigate('/home'); // Redirige a home después del logout
  };

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
            <Nav.Link as={Link} to="/products">Productos</Nav.Link>
            <Nav.Link as={Link} to="/aboutus">Sobre Nosotros</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blogs</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              // Si hay sesión iniciada, mostrar "Cerrar Sesión" e icono de usuario
              <>
                <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                <img 
                  src="/images/icons/user.gif" 
                  alt="Usuario" 
                  style={{
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%',
                    marginLeft: '10px',
                    alignSelf: 'center'
                  }} 
                />
              </>
            ) : (
              // Si no hay sesión, mostrar "Iniciar Sesión" y "Registro"
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}