import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function CustomNavbar() {
  return (
    <Navbar expand="lg" className="navbar" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/home">Level Up Gamer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products">Productos</Nav.Link>
            <Nav.Link as={Link} to="/aboutus">Sobre Nosotros</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
            <Nav.Link as={Link} to="/register">Registro</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}