import React, { useState } from 'react'
import { showSuccessToast, showErrorToast } from '../../utils/toast'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.correo || !formData.comentario) {
      showErrorToast('Por favor, completa todos los campos requeridos.');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      showErrorToast('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Simular envío del formulario
    console.log('Datos del formulario:', formData);
    showSuccessToast('¡Mensaje enviado correctamente! Te contactaremos pronto.');
    
    // Limpiar formulario
    setFormData({
      nombre: '',
      correo: '',
      comentario: ''
    });
  };



  return (
    <div className="contact-container">
      <div className="contenedor">
        <div className="contact-info">
          <h1>Contacto</h1>
          <h2>Información de Contacto</h2>
          <p>Si tienes alguna pregunta sobre nuestros productos, tu pedido o simplemente quieres saludar, no dudes
            en contactarnos.</p>

          <ul>
            <li><strong>Correo:</strong> contacto@level-up.cl</li>
            <li><strong>Teléfono:</strong> +56 9 1234 5678</li>
            <li><strong>Dirección:</strong> Av. Ejemplo 123, Santiago, Chile</li>
          </ul>
        </div>
        
        <div className="formulario">
          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Envíanos un mensaje</h2>

            <div className="form-group">
              <label htmlFor="nombre">Nombre completo *</label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre *"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico *</label>
              <input 
                type="email" 
                id="correo" 
                name="correo" 
                value={formData.correo}
                onChange={handleChange}
                placeholder="ejemplo@correo.com *"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="comentario">Tu Mensaje *</label>
              <textarea 
                id="comentario" 
                name="comentario" 
                rows="5"
                value={formData.comentario}
                onChange={handleChange}
                placeholder="Escribe tu mensaje aquí... *"
                required
              />
            </div>

            <button type="submit" className="btn">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
