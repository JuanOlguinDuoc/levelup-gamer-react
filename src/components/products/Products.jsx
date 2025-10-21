import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos, getCategorias, addToCart, esOfertaActiva, getPrecioFinal, getPrecioOriginal } from '../../service/localStorage'
import { showErrorToast, showSuccessToast} from '../../utils/toast.js'
import './Product.css'

export default function Products() {
  const productos = getProductos();
  const categorias = getCategorias();
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = useMemo(() => {
    if (categoriaSeleccionada === 'todas') {
      return productos;
    }
    return productos.filter(producto => producto.categoria === categoriaSeleccionada);
  }, [productos, categoriaSeleccionada]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  }

  const handleVerDetalle = (producto) => {
    // Guardar el producto seleccionado en localStorage para el detalle
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
    // Navegar al detalle del producto
    navigate(`/product/${producto.id}`);
  }

  const handleAgregarCarrito = (producto) => {
    console.log('Agregar al carrito:', producto.titulo);
    addToCart(producto);
    showSuccessToast('Producto añadido al carrito');
    // Aquí puedes agregar la lógica del carrito
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

  const getProductCount = (categoria) => {
    if (categoria === 'todas') return productos.length;
    return productos.filter(p => p.categoria === categoria).length;
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">
          {categoriaSeleccionada === 'todas' 
            ? 'Todos los Productos' 
            : getCategoriaLabel(categoriaSeleccionada)
          }
        </h1>
        <p className="products-count">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtros de Categoría */}
      <div className="category-filters">
        <button 
          className={`filter-btn ${categoriaSeleccionada === 'todas' ? 'active' : ''}`}
          onClick={() => setCategoriaSeleccionada('todas')}
        >
           Todos ({productos.length})
        </button>
        {categorias.map(categoria => (
          <button 
            key={categoria}
            className={`filter-btn ${categoriaSeleccionada === categoria ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {getCategoriaLabel(categoria)} ({getProductCount(categoria)})
          </button>
        ))}
      </div>

      <div className="products-grid">
        {productosFiltrados.map(producto => {
          const tieneOferta = producto.enOferta && esOfertaActiva(producto);
          
          return (
            <div key={producto.id} className={`product-card ${tieneOferta ? 'has-offer' : ''}`}>
              {/* Badge de oferta */}
              {tieneOferta && (
                <div className="offer-badge">
                  -{producto.descuento}%
                </div>
              )}
              
              <div className="product-image">
                <img src={producto.imagenUrl} alt={producto.titulo} />
                {tieneOferta && (
                  <div className="offer-overlay">
                    <span className="offer-text">¡OFERTA!</span>
                  </div>
                )}
              </div>
              
              <div className="product-info">
                <div className="product-category-badge">
                  {getCategoriaLabel(producto.categoria)}
                </div>
                <h2 className="product-title">{producto.titulo}</h2>
                <p className="product-attributes">{producto.atributos}</p>
                
                {/* Sección de precios con lógica de ofertas */}
                <div className="price-section">
                  {tieneOferta ? (
                    <div className="price-with-offer">
                      <span className="price-original">
                        {formatPrice(getPrecioOriginal(producto))}
                      </span>
                      <span className="price-offer">
                        {formatPrice(getPrecioFinal(producto))}
                      </span>
                      <div className="savings-badge">
                        ¡Ahorras {formatPrice(getPrecioOriginal(producto) - getPrecioFinal(producto))}!
                      </div>
                    </div>
                  ) : (
                    <div className="product-price">{formatPrice(getPrecioFinal(producto))}</div>
                  )}
                </div>
                
                <div className="product-buttons">
                  <button 
                    className="btn-detail"
                    onClick={() => handleVerDetalle(producto)}
                  >
                    Ver detalle
                  </button>
                  <button 
                    className={`btn-cart ${tieneOferta ? 'btn-cart-offer' : ''}`}
                    onClick={() => handleAgregarCarrito(producto)}
                  >
                    {tieneOferta ? '🔥 ¡Aprovecha!' : 'Añadir al carrito'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
