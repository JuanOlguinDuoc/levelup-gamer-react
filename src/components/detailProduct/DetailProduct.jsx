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

  const platform = getPlatformInfo(producto.plataforma);

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
            <h1 className="product-title-detail">
              {producto.titulo}
            </h1>
            
            <div className="product-platform">
              <div className="platform-icon">{platform.icon}</div>
              <span>{platform.name}</span>
              <span style={{ marginLeft: 'auto', color: '#4ecdc4' }}>✓ En stock</span>
              <span style={{ color: '#4ecdc4' }}>✓ Descarga digital</span>
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
                🛒 Añadir a la cesta
              </button>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          {/* Sección de Atributos */}
          <div className="attributes-section">
            <h2>Atributos</h2>
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
