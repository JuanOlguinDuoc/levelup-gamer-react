import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import { getProductos, getProductosByCategoria } from '../../service/localStorage'
import { isUserLoggedIn, getCurrentUser } from '../../service/localStorage'
import './Home.css'
import Carrousel from './Carrousel.jsx'

export default function Home() {
  const productos = getProductos();
  const isLoggedIn = isUserLoggedIn();
  const currentUser = getCurrentUser();
  
  // Obtener productos por categorías para mostrar variedad
  const juegos = getProductosByCategoria('juegos').slice(0, 2);
  const monitores = getProductosByCategoria('monitores').slice(0, 2);
  const consolas = getProductosByCategoria('consolas').slice(0, 2);
  
  // Combinar productos destacados de diferentes categorías
  const productosDestacados = [...juegos, ...monitores, ...consolas];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  }

  return (
    <div className="home-container">
      {/* Hero Section con Carrusel */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {isLoggedIn ? `¡Bienvenido, ${currentUser?.name || currentUser?.nombre || 'Gamer'}!` : '¡Bienvenido a Level Up Gamer!'}
          </h1>
          <p className="hero-subtitle">
            Tu tienda gaming completa: Juegos, Hardware, Consolas y más
          </p>
        </div>
        <Carrousel />
      </section>

      {/* Productos Destacados */}
      <section className="featured-products">
        <div className="section-header">
          <h2>🔥 Productos Destacados</h2>
          <Link to="/products" className="view-all-link">Ver todos →</Link>
        </div>
        
        <div className="products-grid">
          {productosDestacados.map(producto => (
            <div key={producto.id} className="product-card-home">
              <div className="product-image-container">
                <img 
                  src={producto.imagenUrl} 
                  alt={producto.titulo}
                  className="product-image-home"
                />
                <div className="product-overlay">
                  <Link 
                    to={`/product/${producto.id}`} 
                    className="view-details-btn"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
              <div className="product-info-home">
                <div className="product-category-badge">
                  {producto.categoria === 'juegos' && '🎮 Juego'}
                  {producto.categoria === 'monitores' && '🖥️ Monitor'}
                  {producto.categoria === 'pc-armados' && '💻 PC Gaming'}
                  {producto.categoria === 'controles' && '🎯 Control'}
                  {producto.categoria === 'consolas' && '🎮 Consola'}
                </div>
                <h3 className="product-title-home">{producto.titulo}</h3>
                <p className="product-price-home">{formatPrice(producto.precio)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="categories-section">
        <div className="section-header">
          <h2>🛍️ Explora por Categorías</h2>
        </div>
        <div className="categories-grid">
          <Link to="/products" className="category-card">
            <div className="category-icon">🎮</div>
            <h3>Juegos</h3>
            <p>{getProductosByCategoria('juegos').length} productos</p>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-icon">🖥️</div>
            <h3>Monitores</h3>
            <p>{getProductosByCategoria('monitores').length} productos</p>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-icon">💻</div>
            <h3>PC Gaming</h3>
            <p>{getProductosByCategoria('pc-armados').length} productos</p>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-icon">🎯</div>
            <h3>Controles</h3>
            <p>{getProductosByCategoria('controles').length} productos</p>
          </Link>
          <Link to="/products" className="category-card">
            <div className="category-icon">🎮</div>
            <h3>Consolas</h3>
            <p>{getProductosByCategoria('consolas').length} productos</p>
          </Link>
        </div>
      </section>

      {/* Estadísticas de la tienda */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{productos.length}+</div>
            <div className="stat-label">Productos Disponibles</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5</div>
            <div className="stat-label">Categorías</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Soporte</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">⭐⭐⭐⭐⭐</div>
            <div className="stat-label">Valoración</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isLoggedIn && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>¿Listo para empezar tu aventura?</h2>
            <p>Únete a miles de gamers y arma tu setup perfecto</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">Crear Cuenta</Link>
              <Link to="/products" className="cta-btn secondary">Explorar Productos</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
