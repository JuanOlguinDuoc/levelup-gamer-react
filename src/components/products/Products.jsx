import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos } from '../../service/localStorage'
import './Product.css'

export default function Products() {
  const productos = getProductos();
  const navigate = useNavigate();

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
    // Aquí puedes agregar la lógica del carrito
  }

  return (
    <div className="products-container">
      <div className="products-grid">
        {productos.map(producto => (
          <div key={producto.id} className="product-card">
            <div className="product-image">
              <img src={producto.imagenUrl} alt={producto.titulo} />
            </div>
            <div className="product-info">
              <h2 className="product-title">{producto.titulo}</h2>
              <p className="product-attributes">{producto.atributos}</p>
              <div className="product-price">{formatPrice(producto.precio)}</div>
              <div className="product-buttons">
                <button 
                  className="btn-detail"
                  onClick={() => handleVerDetalle(producto)}
                >
                  Ver detalle
                </button>
                <button 
                  className="btn-cart"
                  onClick={() => handleAgregarCarrito(producto)}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
