import { getCart, clearCart, getPriceCart, removeFromCart, updateQuantity, getCurrentUser, getPrecioFinal, getPrecioOriginal, esOfertaActiva } from "../../service/localStorage"
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmClearCart, confirmDeleteProduct } from "../../utils/alert.js";
import "./ShoppingCart.css";

export default function ShoppingCart() {
  const [productos, setProductos] = useState(getCart());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  // Actualizar productos cuando cambie el carrito
  useEffect(() => {
    setProductos(getCart());
  }, []);

  const refreshCart = () => {
    setProductos(getCart());
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
    refreshCart();
    showNotification(`Cantidad actualizada`);
  };

  const handleRemoveFromCart = (productId, productTitle) => {
    confirmDeleteProduct(() => {
      removeFromCart(productId);
      refreshCart();
      showNotification(`${productTitle} eliminado del carrito`);
    });
  };

  const handleClearCart = () => {
    confirmClearCart(() => {
      clearCart();
      refreshCart();
      showNotification('Carrito vaciado');
    });
  };

  const handleVerDetalle = (producto) => {
    localStorage.setItem('selectedProduct', JSON.stringify(producto));
    navigate(`/product/${producto.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

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

  const checkLoggedIn = () => {
    const user = getCurrentUser();
    if (user == null) {
      navigate('/login?redirect=/shoppingcart');
    } else {
      navigate('/checkout');
      console.log('si está logueado');
    }
  }

  const getPlatformLabel = (plataforma) => {
    if (!plataforma || !Array.isArray(plataforma)) return '';
    return plataforma.map(p => {
      const platforms = {
        'PC': 'PC',
        'PS': 'PlayStation',
        'Xbox': 'Xbox',
        'NS': 'Nintendo Switch'
      };
      return platforms[p] || p;
    }).join(', ');
  };

  const subtotal = getPriceCart();
  const descuento = 0; // Puedes agregar lógica de descuentos aquí
  const total = subtotal - descuento;

  if (productos.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Carrito de compras</h1>
        </div>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <img src="/images/icons/add-to-basket.png" alt="Carrito vacío" />
          </div>
          <p className="cart-empty-message">Tu carrito está vacío</p>
          <p>¡Agrega algunos productos increíbles!</p>
          <Link to="/products" className="continue-shopping-btn">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Carrito de compras</h1>
      </div>

      <div className="cart-main">
        <div className="cart-items-section">
          <h2>Cesta ({productos.length} {productos.length === 1 ? 'producto' : 'productos'})</h2>
          
          {productos.map(producto => (
            <div key={producto.id} className="cart-item">
              <div className="cart-item-image">
                <img src={producto.imagenUrl} alt={producto.titulo} />
              </div>
              
              <div className="cart-item-info">
                <h3 className="cart-item-title">{producto.titulo}</h3>
                <p className="cart-item-category">{getCategoriaLabel(producto.categoria)}</p>
                {producto.plataforma && (
                  <span className="cart-item-platform">
                    {getPlatformLabel(producto.plataforma)}
                  </span>
                )}
                
                {/* Mostrar información de descuento si el producto está en oferta */}
                {esOfertaActiva(producto) && (
                  <div className="cart-item-offer">
                    <span className="offer-badge-cart">-{producto.descuento}% OFF</span>
                    <div className="price-comparison-cart">
                      <span className="original-price-cart">{formatPrice(getPrecioOriginal(producto))}</span>
                      <span className="current-price-cart">{formatPrice(getPrecioFinal(producto))}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleUpdateQuantity(producto.id, producto.cantidad - 1)}
                  disabled={producto.cantidad <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  className="quantity-input"
                  value={producto.cantidad}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    if (newQuantity > 0) {
                      handleUpdateQuantity(producto.id, newQuantity);
                    }
                  }}
                  min="1"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => handleUpdateQuantity(producto.id, producto.cantidad + 1)}
                >
                  +
                </button>
              </div>

              <div className="cart-item-price">
                <div>{formatPrice(getPrecioFinal(producto) * producto.cantidad)}</div>
                {producto.cantidad > 1 && (
                  <div className="cart-item-subtotal">
                    {formatPrice(getPrecioFinal(producto))} c/u
                  </div>
                )}
              </div>

              <button 
                className="remove-btn"
                onClick={() => handleRemoveFromCart(producto.id, producto.titulo)}
                title="Eliminar producto"
              >
                <img src="/images/icons/delete.png" alt="Eliminar" className="delete-icon" />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Resumen</h3>
          
          <div className="summary-line subtotal">
            <span>Precio oficial</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {descuento > 0 && (
            <div className="summary-line">
              <span>Descuento</span>
              <span className="summary-discount">-{formatPrice(descuento)}</span>
            </div>
          )}
          
          <div className="summary-line total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button className="checkout-btn" onClick={checkLoggedIn}>
            Proceder al pago
          </button>

          <button 
            className="clear-cart-btn"
            onClick={handleClearCart}
          >
            Vaciar carrito
          </button>

          <Link to="/products" className="continue-shopping-btn" style={{ 
            marginTop: '1rem', 
            textAlign: 'center', 
            display: 'block',
            textDecoration: 'none'
          }}>
            Continuar comprando
          </Link>
        </div>
      </div>

      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
