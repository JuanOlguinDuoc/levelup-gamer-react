import Swal from "sweetalert2";
import { clearUserSession } from "../service/localStorage.js";

export const confirmLogout = (navigate) => {
    Swal.fire({
        title: "¿Estás seguro que deseas cerrar sesión?",
        text: "Perderás el acceso a tu cuenta",
        icon: "warning",
        showCancelButton: true,
        
        // Colores personalizados del proyecto
        background: '#0e011b', // Mismo fondo oscuro del navbar
        color: '#F5F5F5', // Texto claro
        
        // Botones personalizados
        confirmButtonColor: '#5459AC', // Color primario oscuro
        cancelButtonColor: '#52357B', // Color fondo oscuro
        
        // Textos de botones
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        
        // Estilos adicionales
        customClass: {
            popup: 'dark-popup',
            title: 'dark-title',
            content: 'dark-content'
        },
        
        // Efectos
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            clearUserSession();
            
            Swal.fire({
                title: "¡Sesión cerrada!",
                text: "Has cerrado sesión exitosamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                
                // Mismo tema para el mensaje de éxito
                background: '#0e011b',
                color: '#F5F5F5',
                
                // Color del icono de éxito
                iconColor: '#7CEBB9', // Color acento verde
                
                customClass: {
                    popup: 'dark-popup success-popup',
                    title: 'dark-title success-title'
                }
            }).then(() => {
                navigate('/login'); // ← Usar React Router navigation
            });
        }
    });
};

export const confirmClearCart = (onConfirm) => {
    Swal.fire({
        title: "¿Estás seguro que deseas vaciar el carrito?",
        text: "Se eliminarán todos los productos seleccionados",
        icon: "warning",
        showCancelButton: true,
        
        // Colores personalizados del proyecto
        background: '#0e011b',
        color: '#F5F5F5',
        
        // Botones personalizados
        confirmButtonColor: '#d33', // Rojo para acción destructiva
        cancelButtonColor: '#52357B',
        
        // Textos de botones
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar',
        
        // Estilos adicionales
        customClass: {
            popup: 'dark-popup',
            title: 'dark-title',
            content: 'dark-content'
        },
        
        // Efectos
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Ejecutar la función que se pasa como parámetro
            onConfirm();
            
            Swal.fire({
                title: "¡Carrito vaciado!",
                text: "Todos los productos han sido eliminados.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                
                // Mismo tema para el mensaje de éxito
                background: '#0e011b',
                color: '#F5F5F5',
                
                // Color del icono de éxito
                iconColor: '#7CEBB9',
                
                customClass: {
                    popup: 'dark-popup success-popup',
                    title: 'dark-title success-title'
                }
            });
        }
    });
};

export const confirmDeleteProduct = (onConfirm) => {
    Swal.fire({
        title: "¿Estás seguro que deseas eliminar este producto?",
        text: "Se eliminará el producto seleccionado",
        icon: "warning",
        showCancelButton: true,
        
        // Colores personalizados del proyecto
        background: '#0e011b',
        color: '#F5F5F5',
        
        // Botones personalizados
        confirmButtonColor: '#d33', // Rojo para acción destructiva
        cancelButtonColor: '#52357B',
        
        // Textos de botones
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        
        // Estilos adicionales
        customClass: {
            popup: 'dark-popup',
            title: 'dark-title',
            content: 'dark-content'
        },
        
        // Efectos
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Ejecutar la función que se pasa como parámetro
            onConfirm();
            
            Swal.fire({
                title: "¡Producto eliminado!",
                text: "El producto ha sido eliminado del carrito.",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
                
                // Mismo tema para el mensaje de éxito
                background: '#0e011b',
                color: '#F5F5F5',
                
                // Color del icono de éxito
                iconColor: '#7CEBB9',
                
                customClass: {
                    popup: 'dark-popup success-popup',
                    title: 'dark-title success-title'
                }
            });
        }
    });
};

export const successAlert = (navigate) => {
    Swal.fire({
        title: "¡Comprado!",
        text: "Tu compra se ha realizado con éxito.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        
        // Mismo tema para el mensaje de éxito
        background: '#0e011b',
        color: '#F5F5F5',
        
        // Color del icono de éxito
        iconColor: '#7CEBB9',
        
        customClass: {
            popup: 'dark-popup success-popup',
            title: 'dark-title success-title'
        }
    }).then(() => {
        navigate('/home');
    });
}

// Función para mostrar errores de pago específicos
export const paymentErrorAlert = (errorType, callback) => {
  const errorMessages = {
    declined: {
      title: "💳 Pago Declinado",
      text: "Tu tarjeta fue declinada por el banco. Por favor, verifica tus datos o intenta con otra tarjeta.",
      icon: "error"
    },
    insufficient_funds: {
      title: "💰 Fondos Insuficientes", 
      text: "No tienes suficiente saldo en tu tarjeta para completar esta compra. Verifica tu saldo disponible.",
      icon: "warning"
    },
    processing_error: {
      title: "⚠️ Error de Procesamiento",
      text: "Hubo un problema procesando tu pago. Por favor, intenta nuevamente en unos momentos.",
      icon: "error"
    },
    expired_card: {
      title: "📅 Tarjeta Expirada",
      text: "Tu tarjeta ha expirado. Por favor, verifica la fecha de expiración o usa otra tarjeta.",
      icon: "warning"
    },
    invalid_cvc: {
      title: "🔒 Código de Seguridad Inválido",
      text: "El código de seguridad (CVV/CVC) es incorrecto. Verifica los 3 dígitos en el reverso de tu tarjeta.",
      icon: "warning"
    },
    security_check_failed: {
      title: "🛡️ Verificación de Seguridad Fallida",
      text: "La transacción fue bloqueada por medidas de seguridad. Contacta a tu banco para autorizar el pago.",
      icon: "error"
    },
    amount_limit_exceeded: {
      title: "🚫 Límite Excedido",
      text: "El monto excede tu límite diario de compras. Intenta con un monto menor o contacta a tu banco.",
      icon: "warning"
    },
    fraud_detected: {
      title: "⚠️ Actividad Sospechosa Detectada",
      text: "La transacción fue marcada como sospechosa. Por tu seguridad, contacta a tu banco para verificar.",
      icon: "error"
    },
    network_error: {
      title: "🌐 Error de Conexión",
      text: "Hubo un problema de conexión con el sistema de pagos. Verifica tu internet e intenta nuevamente.",
      icon: "error"
    },
    timeout: {
      title: "⏱️ Tiempo Agotado",
      text: "La transacción expiró por tiempo de espera. Por favor, intenta realizar el pago nuevamente.",
      icon: "warning"
    },
    server_unavailable: {
      title: "🖥️ Servidor No Disponible",
      text: "El servidor de pagos no está disponible temporalmente. Intenta nuevamente en unos minutos.",
      icon: "error"
    },
    maintenance_mode: {
      title: "🔧 Mantenimiento en Progreso",
      text: "El sistema de pagos está en mantenimiento. Intenta realizar tu compra más tarde.",
      icon: "info"
    }
  };

  const error = errorMessages[errorType] || {
    title: "❌ Error de Pago",
    text: "Ocurrió un error inesperado durante el procesamiento del pago. Intenta nuevamente.",
    icon: "error"
  };

  // Configuración más simple y robusta
  const swalConfig = {
    title: error.title,
    text: error.text,
    icon: error.icon,
    
    // Colores personalizados del proyecto
    background: '#0e011b',
    color: '#F5F5F5',
    
    // Botones
    showCancelButton: true,
    confirmButtonColor: '#7CEBB9',
    cancelButtonColor: '#ff6b6b',
    confirmButtonText: 'Intentar Nuevamente',
    cancelButtonText: 'Volver al Carrito',
    
    // Configuración para asegurar que se puede cerrar
    allowEscapeKey: true,
    allowOutsideClick: true,
    focusConfirm: false,
    buttonsStyling: true,
    
    // Estilos más simples
    customClass: {
      popup: 'dark-popup',
      title: 'dark-title',
      content: 'dark-content'
    }
  };

  return Swal.fire(swalConfig).then((result) => {
    // Asegurar que siempre se ejecute el callback
    const action = result.isConfirmed ? 'retry' : 'cancel';
    console.log('SweetAlert resultado:', result, 'Acción:', action); // Debug
    
    if (callback && typeof callback === 'function') {
      try {
        callback(action);
      } catch (err) {
        console.error('Error en callback de paymentErrorAlert:', err);
      }
    }
    
    return action;
  }).catch((err) => {
    console.error('Error en SweetAlert:', err);
    // En caso de error, ejecutar callback con cancel
    if (callback && typeof callback === 'function') {
      callback('cancel');
    }
  });
};