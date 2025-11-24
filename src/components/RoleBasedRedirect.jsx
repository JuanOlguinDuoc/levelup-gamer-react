import { Navigate } from 'react-router-dom';
import { isUserVendedor } from '../service/localStorage';

/**
 * Componente que redirige según el rol del usuario
 * - Vendedores van a /vendedor
 * - Otros usuarios van a /home
 */
export default function RoleBasedRedirect() {
  const vendedor = isUserVendedor();
  
  if (vendedor) {
    return <Navigate to="/vendedor" replace />;
  }
  
  return <Navigate to="/home" replace />;
}
