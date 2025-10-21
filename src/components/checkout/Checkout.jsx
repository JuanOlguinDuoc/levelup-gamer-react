import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getPriceCart, getCurrentUser, clearCart, getPrecioFinal, getPrecioOriginal, esOfertaActiva } from '../../service/localStorage';
import Payment from '../payment';
import './Checkout.css';
import { successAlert, paymentErrorAlert } from '../../utils/alert';

export default function Checkout() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [useRegisteredAddress, setUseRegisteredAddress] = useState(true);
  const [deliveryData, setDeliveryData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    run: '',
    direccion: '',
    departamento: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    indicacionesEntrega: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [paymentData, setPaymentData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener productos del carrito
    const cartItems = getCart();
    setProductos(cartItems);

    // Obtener usuario actual
    const user = getCurrentUser();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    setCurrentUser(user);
    
    // Pre-llenar formulario con datos del usuario
    setDeliveryData({
      nombre: user.nombre || user.name || '',
      apellido: user.apellido || '',
      email: user.email || '',
      telefono: user.telefono || '',
      run: user.run || '',
      direccion: user.direccion || '',
      departamento: user.departamento || '',
      ciudad: user.ciudad || '',
      region: user.region || '',
      codigoPostal: user.codigoPostal || '',
      indicacionesEntrega: user.indicacionesEntrega || ''
    });
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressToggle = (useRegistered) => {
    setUseRegisteredAddress(useRegistered);
    if (useRegistered && currentUser) {
      // Restaurar datos del usuario registrado
      setDeliveryData({
        nombre: currentUser.nombre || currentUser.name || '',
        apellido: currentUser.apellido || '',
        email: currentUser.email || '',
        telefono: currentUser.telefono || '',
        run: currentUser.run || '',
        direccion: currentUser.direccion || '',
        departamento: currentUser.departamento || '',
        ciudad: currentUser.ciudad || '',
        region: currentUser.region || '',
        codigoPostal: currentUser.codigoPostal || '',
        indicacionesEntrega: currentUser.indicacionesEntrega || ''
      });
    }
  };

  const handlePaymentDataChange = (data) => {
    setPaymentData(data);
  };

  // Simulación de errores basada en números de tarjeta específicos (Opción 1)
  const simulatePaymentError = (cardData, paymentMethod) => {
    if (paymentMethod === 'transfer') return null; // Transferencias no fallan aquí
    
    const cardNumber = cardData.cardNumber?.replace(/\s/g, '');
    
    // Números de tarjeta que generan errores específicos para testing
    const errorScenarios = {
      '4000000000000002': 'declined', // Tarjeta declinada
      '4000000000000127': 'insufficient_funds', // Fondos insuficientes
      '4000000000000119': 'processing_error', // Error de procesamiento
      '4000000000000341': 'expired_card', // Tarjeta expirada
      '4000000000000028': 'invalid_cvc', // CVC inválido
      '4000000000000069': 'security_check_failed', // Falla verificación de seguridad
      '4000000000000101': 'amount_limit_exceeded', // Límite de monto excedido
      '4000000000000036': 'fraud_detected', // Fraude detectado
      '4242424242424242': 'network_error', // Error de red (tarjeta Stripe de prueba)
    };
    
    return errorScenarios[cardNumber] || null;
  };

  // Simulación de errores aleatorios (Opción 2)
  const generateRandomError = () => {
    const random = Math.random();
    
    // 12% de probabilidad total de errores aleatorios
    if (random < 0.03) return 'network_error'; // 3% error de red
    if (random < 0.05) return 'declined'; // 2% declinada
    if (random < 0.07) return 'timeout'; // 2% timeout
    if (random < 0.09) return 'server_unavailable'; // 2% servidor no disponible
    if (random < 0.11) return 'processing_error'; // 2% error de procesamiento
    if (random < 0.12) return 'maintenance_mode'; // 1% mantenimiento
    
    return null; // 88% de éxito
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular proceso de pago con validación de errores
    setTimeout(() => {
      let errorType = null;
      
      // 1. Verificar errores específicos por número de tarjeta (Opción 1)
      if (paymentMethod !== 'transfer') {
        errorType = simulatePaymentError(paymentData, paymentMethod);
      }
      
      // 2. Si no hay error específico, verificar errores aleatorios (Opción 2)
      if (!errorType) {
        errorType = generateRandomError();
      }
      
      setLoading(false);
      
      // Si hay error, mostrar alerta de error
      if (errorType) {
        console.log('Error de pago detectado:', errorType); // Debug
        paymentErrorAlert(errorType, (action) => {
          console.log('Acción seleccionada:', action); // Debug
          if (action === 'cancel') {
            navigate('/shoppingcart');
          }
          // Si action === 'retry', simplemente se queda en la página para intentar de nuevo
        });
        return;
      }
      
      // Si no hay errores, procesar pago exitoso
      clearCart();
      successAlert(() => {
        navigate('/home');
      });
    }, 2000);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return deliveryData.nombre && deliveryData.apellido && deliveryData.email && 
               deliveryData.telefono && deliveryData.run && deliveryData.direccion && 
               deliveryData.ciudad && deliveryData.region;
      case 2:
        if (paymentMethod === 'transfer') return true;
        return paymentData.cardNumber && paymentData.cardHolder && 
               paymentData.expiryDate && paymentData.cvv;
      default:
        return true;
    }
  };

  const subtotal = getPriceCart();
  const envio = 5000; // Costo fijo de envío
  
  // Calcular descuentos totales
  const calcularDescuentosTotal = () => {
    return productos.reduce((total, producto) => {
      if (esOfertaActiva(producto)) {
        const ahorroUnitario = getPrecioOriginal(producto) - getPrecioFinal(producto);
        return total + (ahorroUnitario * producto.cantidad);
      }
      return total;
    }, 0);
  };
  
  const descuentosTotal = calcularDescuentosTotal();
  const total = subtotal + envio;

  if (productos.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>No hay productos en el carrito</h2>
          <p>Agrega algunos productos antes de proceder al checkout</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finalizar Compra</h1>
        <p>Completa tus datos para proceder con el pago</p>
        
        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Datos de Entrega</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Método de Pago</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmación</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            {/* Paso 1: Datos de Entrega */}
            {currentStep === 1 && (
              <div className="form-section">
                <h3>📍 Datos de Entrega</h3>
              
              {/* Toggle para usar dirección registrada */}
              <div className="address-toggle">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="addressOption"
                    checked={useRegisteredAddress}
                    onChange={() => handleAddressToggle(true)}
                  />
                  <span>Usar dirección registrada</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="addressOption"
                    checked={!useRegisteredAddress}
                    onChange={() => handleAddressToggle(false)}
                  />
                  <span>Usar otra dirección</span>
                </label>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={deliveryData.nombre}
                    onChange={handleInputChange}
                    disabled={useRegisteredAddress}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={deliveryData.apellido}
                    onChange={handleInputChange}
                    disabled={useRegisteredAddress}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={deliveryData.email}
                    onChange={handleInputChange}
                    disabled={useRegisteredAddress}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={deliveryData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: +56 9 1234 5678"
                    required
                  />
                  
                </div>

                <div className="form-group">
                  <label>RUN *</label>
                  <input
                    type="text"
                    name="run"
                    value={deliveryData.run}
                    onChange={handleInputChange}
                    disabled={useRegisteredAddress}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Dirección *</label>
                  <input
                    type="text"
                    name="direccion"
                    value={deliveryData.direccion}
                    onChange={handleInputChange}
                    disabled={useRegisteredAddress}
                    placeholder="Calle y número"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Departamento</label>
                  <input
                    type="text"
                    name="departamento"
                    value={deliveryData.departamento}
                    onChange={handleInputChange}
                    placeholder="Ej: Depto 301, Casa B"
                  />
                  
                </div>

                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={deliveryData.ciudad}
                    onChange={handleInputChange}
                    placeholder="Ej: Santiago, Valparaíso, Concepción"
                    required
                  />
                  
                </div>

                <div className="form-group">
                  <label>Región *</label>
                  <select
                    name="region"
                    value={deliveryData.region}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar región</option>
                    <option value="metropolitana">Región Metropolitana</option>
                    <option value="valparaiso">Valparaíso</option>
                    <option value="biobio">Biobío</option>
                    <option value="araucania">La Araucanía</option>
                    <option value="los-lagos">Los Lagos</option>
                    <option value="antofagasta">Antofagasta</option>
                    <option value="atacama">Atacama</option>
                    <option value="coquimbo">Coquimbo</option>
                    <option value="ohiggins">O'Higgins</option>
                    <option value="maule">Maule</option>
                    <option value="nuble">Ñuble</option>
                    <option value="los-rios">Los Ríos</option>
                    <option value="aysen">Aysén</option>
                    <option value="magallanes">Magallanes</option>
                    <option value="arica-parinacota">Arica y Parinacota</option>
                    <option value="tarapaca">Tarapacá</option>
                  </select>
                  
                </div>

                <div className="form-group">
                  <label>Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={deliveryData.codigoPostal}
                    onChange={handleInputChange}
                    placeholder="Ej: 7500000"
                  />
                  
                </div>

                <div className="form-group full-width">
                  <label>Indicaciones para la entrega</label>
                  <textarea
                    name="indicacionesEntrega"
                    value={deliveryData.indicacionesEntrega}
                    onChange={handleInputChange}
                    placeholder="Ej: Tocar timbre 2 veces, entregar al portero, horario preferido..."
                    rows="3"
                  />
                  
                </div>
              </div>

              <div className="step-navigation">
                <button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={!isStepValid(1)}
                  className="btn-next"
                >
                  Continuar al Pago →
                </button>
              </div>
            </div>
            )}

            {/* Paso 2: Método de Pago */}
            {currentStep === 2 && (
              <div className="form-section">
                <h3>💳 Método de Pago</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Tarjeta de Crédito</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="debit"
                      checked={paymentMethod === 'debit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Tarjeta de Débito</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>🏦 Transferencia Bancaria</span>
                  </label>
                </div>

                {/* Componente Payment */}
                <Payment 
                  paymentMethod={paymentMethod}
                  onPaymentDataChange={handlePaymentDataChange}
                  paymentData={paymentData}
                />

                <div className="step-navigation">
                  <button 
                    type="button" 
                    onClick={handlePrevStep}
                    className="btn-prev"
                  >
                    ← Volver
                  </button>
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    disabled={!isStepValid(2)}
                    className="btn-next"
                  >
                    Revisar Pedido →
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación */}
            {currentStep === 3 && (
              <div className="form-section">
                <h3>✅ Confirmación del Pedido</h3>
                
                <div className="confirmation-summary">
                  <div className="summary-section">
                    <h4>📍 Datos de Entrega</h4>
                    <p><strong>{deliveryData.nombre} {deliveryData.apellido}</strong></p>
                    <p>{deliveryData.direccion}{deliveryData.departamento && `, ${deliveryData.departamento}`}</p>
                    <p>{deliveryData.ciudad}, {deliveryData.region}</p>
                    <p>📧 {deliveryData.email} | 📱 {deliveryData.telefono}</p>
                    {deliveryData.indicacionesEntrega && (
                      <p><strong>Indicaciones:</strong> {deliveryData.indicacionesEntrega}</p>
                    )}
                  </div>

                  <div className="summary-section">
                    <h4>💳 Método de Pago</h4>
                    <p>
                      {paymentMethod === 'credit' && '💳 Tarjeta de Crédito'}
                      {paymentMethod === 'debit' && '💳 Tarjeta de Débito'}
                      {paymentMethod === 'transfer' && '🏦 Transferencia Bancaria'}
                    </p>
                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && paymentData.cardNumber && (
                      <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                    )}
                  </div>
                </div>

                <div className="step-navigation">
                  <button 
                    type="button" 
                    onClick={handlePrevStep}
                    className="btn-prev"
                  >
                    ← Volver
                  </button>
                  <button 
                    type="submit" 
                    className="checkout-btn"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : `Confirmar y Pagar ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="order-summary">
          <h3>📦 Resumen del Pedido</h3>
          
          <div className="summary-products">
            {productos.map(producto => (
              <div key={producto.id} className="summary-item">
                <img src={producto.imagenUrl} alt={producto.titulo} />
                <div className="item-details">
                  <h4>{producto.titulo}</h4>
                  <p>Cantidad: {producto.cantidad}</p>
                  
                  {/* Mostrar información de descuento si está en oferta */}
                  {esOfertaActiva(producto) && (
                    <div className="checkout-offer-info">
                      <span className="checkout-offer-badge">-{producto.descuento}% OFF</span>
                      <div className="checkout-price-comparison">
                        <span className="checkout-original-price">{formatPrice(getPrecioOriginal(producto))}</span>
                        <span className="checkout-current-price">{formatPrice(getPrecioFinal(producto))}</span>
                      </div>
                    </div>
                  )}
                  
                  <span className="item-price">
                    {formatPrice(getPrecioFinal(producto) * producto.cantidad)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Envío:</span>
              <span>{formatPrice(envio)}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="delivery-info">
            <p><strong>🚚 Tiempo de entrega:</strong> 3-5 días hábiles</p>
            <p><strong>Soporte:</strong> +56 9 1234 5678</p>
          </div>
        </div>
      </div>
    </div>
  );
}
