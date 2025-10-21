import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductosEnOferta, getCategorias, addToCart, esOfertaActiva, getPrecioFinal, getPrecioOriginal } from '../../service/localStorage'
import { showErrorToast, showSuccessToast } from '../../utils/toast.js'
import './Offer.css'

export default function Offer() {
  const productosEnOferta = getProductosEnOferta();
  const categorias = getCategorias();
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

  // Filtrar productos en oferta según la categoría seleccionada
  const ofertasFiltradas = useMemo(() => {
    let ofertas = productosEnOferta;
    
    // Filtrar solo ofertas activas
    ofertas = ofertas.filter(producto => esOfertaActiva(producto));
    
    if (categoriaSeleccionada === 'todas') {
      return ofertas;
    }
    return ofertas.filter(producto => producto.categoria === categoriaSeleccionada);
  }, [productosEnOferta, categoriaSeleccionada]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  }

  const getDiasRestantes = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diffTime = fin - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  const handleVerDetalle = (producto) => {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
    navigate(`/product/${producto.id}`);
  }

  const handleAgregarCarrito = (producto) => {
    console.log('Agregar al carrito:', producto.titulo);
    addToCart(producto);
    showSuccessToast('¡Producto en oferta añadido al carrito!');
  }

  const getCategoriaLabel = (categoria) => {
    const labels = {
      'juegos': '🎮 Juegos',
      'monitores': '🖥️ Monitores', 
      'pc-armados': '💻 PC Gaming',
      'controles': '🎯 Controles',
      'consolas': '🎮 Consolas'
    };
    return labels[categoria] || categoria;
  };

  const getOfertasCount = (categoria) => {
    const ofertas = productosEnOferta.filter(p => esOfertaActiva(p));
    if (categoria === 'todas') return ofertas.length;
    return ofertas.filter(p => p.categoria === categoria).length;
  };

  // Filtrar categorías que tengan ofertas activas
  const categoriasConOfertas = categorias.filter(categoria => 
    getOfertasCount(categoria) > 0
  );

  return (
    <div className="offers-container">
      <div className="offers-header">
        <div className="offers-title-section">
          <h1 className="offers-title">
            🔥 Ofertas Especiales de Halloween
          </h1>
          <p className="offers-subtitle">
            ¡Aprovecha estos descuentos increíbles antes de que terminen!
          </p>
          <p className="offers-count">
            {ofertasFiltradas.length} oferta{ofertasFiltradas.length !== 1 ? 's' : ''} activa{ofertasFiltradas.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="offers-banner">
          <div className="flash-sale-badge">
            ⚡ FLASH SALE
          </div>
        </div>
      </div>

      {/* Filtros de Categoría */}
      {categoriasConOfertas.length > 0 && (
        <div className="category-filters">
          <button 
            className={`filter-btn ${categoriaSeleccionada === 'todas' ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada('todas')}
          >
            🔥 Todas las Ofertas ({getOfertasCount('todas')})
          </button>
          {categoriasConOfertas.map(categoria => (
            <button 
              key={categoria}
              className={`filter-btn ${categoriaSeleccionada === categoria ? 'active' : ''}`}
              onClick={() => setCategoriaSeleccionada(categoria)}
            >
              {getCategoriaLabel(categoria)} ({getOfertasCount(categoria)})
            </button>
          ))}
        </div>
      )}

      {ofertasFiltradas.length === 0 ? (
        <div className="no-offers">
          <div className="no-offers-icon">🎯</div>
          <h3>No hay ofertas activas en esta categoría</h3>
          <p>¡Mantente atento! Pronto tendremos nuevas ofertas increíbles</p>
        </div>
      ) : (
        <div className="offers-grid">
          {ofertasFiltradas.map(producto => (
            <div key={producto.id} className="offer-card">
              {/* Badge de descuento */}
              <div className="discount-badge">
                -{producto.descuento}%
              </div>
              
              {/* Timer de oferta */}
              <div className="offer-timer">
                ⏰ {getDiasRestantes(producto.fechaFinOferta)} días restantes
              </div>

              <div className="product-image">
                <img src={producto.imagenUrl} alt={producto.titulo} />
                <div className="offer-overlay">
                  <span className="offer-text">¡OFERTA!</span>
                </div>
              </div>
              
              <div className="product-info">
                <div className="product-category-badge">
                  {getCategoriaLabel(producto.categoria)}
                </div>
                
                <h3 className="product-title">{producto.titulo}</h3>
                <p className="product-attributes">{producto.atributos}</p>
                
                <div className="price-section">
                  <div className="price-comparison">
                    <span className="original-price">
                      {formatPrice(getPrecioOriginal(producto))}
                    </span>
                    <span className="current-price">
                      {formatPrice(getPrecioFinal(producto))}
                    </span>
                  </div>
                  <div className="savings">
                    ¡Ahorras {formatPrice(getPrecioOriginal(producto) - getPrecioFinal(producto))}!
                  </div>
                </div>

                <div className="product-actions">
                  <button 
                    className="btn-detail"
                    onClick={() => handleVerDetalle(producto)}
                  >
                    Ver Detalle
                  </button>
                  <button 
                    className="btn-cart-offer"
                    onClick={() => handleAgregarCarrito(producto)}
                  >
                    🛒 Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="offers-info">
        <div className="info-card">
          <h4>🔥 ¿Por qué aprovechar nuestras ofertas?</h4>
          <ul>
            <li>✅ Descuentos reales de hasta 25%</li>
            <li>✅ Productos originales y garantizados</li>
            <li>✅ Envío gratis en compras sobre $50.000</li>
            <li>✅ Ofertas por tiempo limitado</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
