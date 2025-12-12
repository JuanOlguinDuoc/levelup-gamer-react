import { Navigate } from 'react-router-dom';
import { isUserVendedor } from '../service/localStorage';

/**
 * Componente que protege rutas que NO deben ser accesibles para vendedores
 * Si el usuario es vendedor, lo redirige a /vendedor
 */
export default function VendedorRoute({ children }) {
  const vendedor = isUserVendedor();
  
  if (vendedor) {
    return <Navigate to="/vendedor" replace />;
  }
  
  return children;
}
