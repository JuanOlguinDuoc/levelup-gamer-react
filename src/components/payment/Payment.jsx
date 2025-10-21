import React, { useState } from 'react';
import './Payment.css';

/*
NÚMEROS DE TARJETA DE PRUEBA PARA TESTING DE ERRORES (CHILE):

✅ ÉXITO (números válidos chilenos):
- 4111111111111111 (Visa genérica)
- 5555555555554444 (Mastercard genérica)
- 4005519200000004 (Visa Chile)
- 5204740009900014 (Mastercard Chile)

❌ ERRORES ESPECÍFICOS:
- 4000000000000002 → Tarjeta declinada
- 4000000000000127 → Fondos insuficientes  
- 4000000000000119 → Error de procesamiento
- 4000000000000341 → Tarjeta expirada
- 4000000000000028 → CVC inválido
- 4000000000000069 → Falla verificación de seguridad
- 4000000000000101 → Límite de monto excedido
- 4000000000000036 → Fraude detectado
- 4242424242424242 → Error de red

⚠️ ERRORES ALEATORIOS:
Cualquier número válido tiene ~12% de probabilidad de generar errores aleatorios:
- Error de red (3%)
- Tarjeta declinada (2%)
- Timeout (2%)
- Servidor no disponible (2%)
- Error de procesamiento (2%)
- Modo mantenimiento (1%)

📝 NOTA: Solo se aceptan Visa y Mastercard (mercado chileno)
*/

export default function Payment({ paymentMethod, onPaymentDataChange, paymentData = {} }) {
  const [cardData, setCardData] = useState({
    cardNumber: paymentData.cardNumber || '',
    cardHolder: paymentData.cardHolder || '',
    expiryDate: paymentData.expiryDate || '',
    cvv: paymentData.cvv || '',
    ...paymentData
  });

  const [errors, setErrors] = useState({});

  // Formatear número de tarjeta (espacios cada 4 dígitos - formato chileno)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Solo permitir 16 dígitos (Visa y Mastercard estándar en Chile)
    const match = v.substring(0, 16);
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Formatear fecha de expiración (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  // Validar número de tarjeta usando algoritmo de Luhn (solo Visa y Mastercard)
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    // Solo aceptar 16 dígitos (estándar chileno)
    if (cleanNumber.length !== 16) return false;
    
    // Verificar que sea Visa o Mastercard
    if (!cleanNumber.match(/^4/) && !cleanNumber.match(/^5[1-5]/)) {
      return false;
    }
    
    let sum = 0;
    let alternate = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cleanNumber.charAt(i), 10);
      if (alternate) {
        n *= 2;
        if (n > 9) n = (n % 10) + 1;
      }
      sum += n;
      alternate = !alternate;
    }
    return (sum % 10) === 0;
  };

  // Detectar tipo de tarjeta (solo Visa y Mastercard usadas en Chile)
  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.match(/^4/)) return 'visa';
    if (cleanNumber.match(/^5[1-5]/)) return 'mastercard';
    return 'unknown';
  };

  // Validar fecha de expiración
  const validateExpiryDate = (date) => {
    if (!date.match(/^\d{2}\/\d{2}$/)) return false;
    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
    
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let newErrors = { ...errors };

    // Aplicar formateo según el campo
    switch (name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        if (formattedValue && !validateCardNumber(formattedValue)) {
          newErrors.cardNumber = 'Número de tarjeta inválido';
        } else {
          delete newErrors.cardNumber;
        }
        break;
      
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        if (formattedValue.length === 5 && !validateExpiryDate(formattedValue)) {
          newErrors.expiryDate = 'Fecha de expiración inválida';
        } else {
          delete newErrors.expiryDate;
        }
        break;
      
      case 'cvv':
        formattedValue = value.replace(/\D/g, '').substring(0, 3); // Solo 3 dígitos en Chile
        if (formattedValue.length < 3) {
          newErrors.cvv = 'CVV debe tener 3 dígitos';
        } else {
          delete newErrors.cvv;
        }
        break;
      
      case 'cardHolder':
        formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        if (formattedValue.length < 2) {
          newErrors.cardHolder = 'Nombre del titular requerido';
        } else {
          delete newErrors.cardHolder;
        }
        break;
    }

    const updatedCardData = {
      ...cardData,
      [name]: formattedValue
    };

    setCardData(updatedCardData);
    setErrors(newErrors);
    
    // Notificar al componente padre
    onPaymentDataChange(updatedCardData);
  };

  // Solo mostrar campos de tarjeta si el método es crédito o débito
  if (paymentMethod !== 'credit' && paymentMethod !== 'debit') {
    return (
      <div className="payment-container">
        <div className="payment-info">
          <h3>💳 Información de Pago</h3>
          {paymentMethod === 'transfer' && (
            <div className="transfer-info">
              <p><strong>Transferencia Bancaria</strong></p>
              <div className="bank-details">
                <p><strong>Banco:</strong> Banco Estado</p>
                <p><strong>Cuenta Corriente:</strong> 12345678-9</p>
                <p><strong>RUT:</strong> 76.123.456-7</p>
                <p><strong>Titular:</strong> LevelUp Gamer SpA</p>
              </div>
              <div className="transfer-note">
                <p>⚠️ <strong>Importante:</strong> Debes realizar la transferencia y enviar el comprobante a <strong>ventas@levelupgamer.cl</strong> para confirmar tu pedido.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const cardType = getCardType(cardData.cardNumber);

  return (
    <div className="payment-container">
      <div className="payment-info">
        <h3>💳 Datos de la Tarjeta</h3>
        <p>Ingresa los datos de tu tarjeta de {paymentMethod === 'credit' ? 'crédito' : 'débito'}</p>
      </div>

      <div className="card-form">
        {/* Número de tarjeta */}
        <div className="form-group">
          <label>Número de Tarjeta *</label>
          <div className="card-input-container">
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`card-input ${errors.cardNumber ? 'error' : ''} ${cardType !== 'unknown' ? cardType : ''}`}
              required
            />
            <div className="card-type-icon">
              {cardType === 'visa' && '💙'}
              {cardType === 'mastercard' && '🔴'}
              {cardType === 'unknown' && cardData.cardNumber && '❌'}
            </div>
          </div>
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          {cardType === 'unknown' && cardData.cardNumber && (
            <span className="error-message">Solo se aceptan tarjetas Visa y Mastercard</span>
          )}
        </div>

        {/* Nombre del titular */}
        <div className="form-group">
          <label>Nombre del Titular *</label>
          <input
            type="text"
            name="cardHolder"
            value={cardData.cardHolder}
            onChange={handleInputChange}
            placeholder="Como aparece en la tarjeta"
            className={errors.cardHolder ? 'error' : ''}
            required
          />
          {errors.cardHolder && <span className="error-message">{errors.cardHolder}</span>}
        </div>

        <div className="form-row">
          {/* Fecha de expiración */}
          <div className="form-group">
            <label>Fecha de Expiración *</label>
            <input
              type="text"
              name="expiryDate"
              value={cardData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength="5"
              className={errors.expiryDate ? 'error' : ''}
              required
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>

          {/* CVV */}
          <div className="form-group">
            <label>CVV *</label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="3"
              className={errors.cvv ? 'error' : ''}
              required
            />
            {errors.cvv && <span className="error-message">{errors.cvv}</span>}
          </div>
        </div>

        <div className="security-info">
          <p>🔒 <strong>Seguridad:</strong> Tus datos están protegidos con encriptación SSL de 256 bits</p>
        </div>
      </div>
    </div>
  );
}
