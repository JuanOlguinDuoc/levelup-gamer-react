import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductoById, getSelectedProduct } from '../../service/localStorage'
import './DetailProduct.css'

export default function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let productoEncontrado = getProductoById(id);
    
    if (!productoEncontrado) {
      productoEncontrado = getSelectedProduct();
    }

    if (productoEncontrado) {
      setProducto(productoEncontrado);
    } else {
      navigate('/products');
    }

    // Asignamos un texto de Lorem Ipsum provisional
    const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Curabitur venenatis nisl vel enim consectetur, in elementum libero sollicitudin. Nulla facilisi. Phasellus posuere mi ut est ullamcorper, sit amet convallis elit elementum. Integer feugiat, enim in efficitur tincidunt, metus lectus interdum ligula, eu dapibus odio ligula id sapien. Sed porttitor est vel turpis scelerisque, at varius sem posuere.`;

    setDescripcion(loremIpsumText);

  }, [id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  }

  const handleAgregarCarrito = () => {
    console.log('Agregar al carrito:', producto.titulo);
    alert(`${producto.titulo} agregado al carrito!`);
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log('Toggle favorite:', producto.titulo);
  }

  const getProductInfo = (producto) => {
    const categoria = producto.categoria;
    
    switch (categoria) {
      case 'juegos':
        return {
          type: 'Videojuego',
          compatibility: getPlatformInfo(producto.plataforma),
          features: ['✓ En stock', '✓ Descarga digital'],
          icon: '🎮'
        };
      case 'monitores':
        return {
          type: 'Monitor Gaming',
          compatibility: { name: 'Compatible con PC/Consolas', icon: '🖥️' },
          features: ['✓ En stock', '✓ Garantía 2 años'],
          icon: '🖥️'
        };
      case 'pc-armados':
        return {
          type: 'PC Gaming',
          compatibility: { name: 'Sistema Completo', icon: '💻' },
          features: ['✓ En stock', '✓ Garantía 3 años'],
          icon: '💻'
        };
      case 'controles':
        return {
          type: 'Control/Joystick',
          compatibility: getPlatformInfo(producto.plataforma),
          features: ['✓ En stock', '✓ Garantía 1 año'],
          icon: '🎯'
        };
      case 'consolas':
        return {
          type: 'Consola de Videojuegos',
          compatibility: { name: 'Sistema Completo', icon: '🎮' },
          features: ['✓ En stock', '✓ Garantía oficial'],
          icon: '🎮'
        };
      default:
        return {
          type: 'Producto Gaming',
          compatibility: { name: 'Compatible', icon: '🛍️' },
          features: ['✓ En stock', '✓ Garantía incluida'],
          icon: '🛍️'
        };
    }
  };

  const getPlatformInfo = (plataformas) => {
    if (!plataformas || plataformas.length === 0) {
      return { name: 'Plataforma no especificada', icon: '?' };
    }
    
    if (plataformas.length === 1) {
      const plat = plataformas[0];
      switch (plat) {
        case 'PC': return { name: 'PC', icon: 'PC' };
        case 'PS': return { name: 'PlayStation', icon: 'PS' };
        case 'Xbox': return { name: 'Xbox', icon: 'XB' };
        case 'NS': return { name: 'Nintendo Switch', icon: 'NS' };
        default: return { name: plat, icon: plat.substring(0, 2) };
      }
    }
    
    // Si tiene múltiples plataformas
    const platformNames = plataformas.map(plat => {
      switch (plat) {
        case 'PC': return 'PC';
        case 'PS': return 'PS';
        case 'Xbox': return 'Xbox';
        case 'NS': return 'NS';
        default: return plat;
      }
    }).join(', ');
    
    return { name: platformNames, icon: 'MP' };
  }

  if (!producto) {
    return (
      <div className="detail-container">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Cargando producto...</h2>
        </div>
      </div>
    );
  }

  const productInfo = getProductInfo(producto);

  return (
    <div className="detail-container">  
      <div className="detail-content">
        <div className="top-section">
          <div className="image-section">
            <img 
              src={producto.imagenUrl} 
              alt={producto.titulo}
              className="product-image-detail"
            />
          </div>
          
          <div className="info-section">
            <div className="product-category-tag">
              <span className="category-text">{productInfo.type}</span>
            </div>
            
            <h1 className="product-title-detail">
              {producto.titulo}
            </h1>
            
            <div className="product-platform">
              <div className="platform-icon">{productInfo.compatibility.icon}</div>
              <span>{productInfo.compatibility.name}</span>
              <div className="product-features">
                {productInfo.features.map((feature, index) => (
                  <span key={index} style={{ color: '#4ecdc4' }}>{feature}</span>
                ))}
              </div>
            </div>

            <div className="price-section-detail">
              <div className="current-price-detail">
                {formatPrice(producto.precio)}
              </div>
            </div>
            
            <div className="buttons-section-instant">
              <button 
                onClick={handleToggleFavorite} 
                className="favorite-button-instant"
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
              
              <button onClick={handleAgregarCarrito} className="add-to-cart-instant">
                <svg 
                  className="cart-icon" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                Añadir a la cesta
              </button>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          {/* Sección de Especificaciones */}
          <div className="attributes-section">
            <h2>
              {producto.categoria === 'juegos' ? 'Características del Juego' : 
               producto.categoria === 'monitores' ? 'Especificaciones Técnicas' :
               producto.categoria === 'pc-armados' ? 'Especificaciones del Sistema' :
               producto.categoria === 'controles' ? 'Características del Control' :
               producto.categoria === 'consolas' ? 'Especificaciones de la Consola' :
               'Especificaciones'}
            </h2>
            <div className="product-attributes-detail">
              {producto.atributos}
            </div>
          </div>

          {/* Sección de Descripción */}
          <div className="description-section">
            <h2>Descripción</h2>
            <p>{descripcion}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
