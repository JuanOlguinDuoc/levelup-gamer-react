# 🧪 Documentación de Tests - Level Up Gamer React

## 📋 **Resumen General**

Este proyecto cuenta con una **suite completa de tests** que abarca desde validaciones de componentes hasta pruebas de lógica de negocio con mocks. Los tests están organizados en diferentes categorías para garantizar la calidad y robustez de la aplicación de e-commerce gaming.

---

## 📊 **Estadísticas de Testing**

| Categoría | Archivos | Tests | Descripción |
|-----------|----------|-------|-------------|
| **Componentes UI** | 2 | 10 | Tests de renderizado de Login/Register |
| **Validaciones** | 2 | 11+ | Tests de validación de formularios |
| **Lógica de Negocio** | 1 | 47 | Tests del core de la aplicación |
| **TOTAL** | **5** | **~68** | **Suite completa de testing** |

---

## 🗂️ **Estructura de Tests**

### **📁 `/src/components/login/`**
```
Login.test.jsx          (4 tests)
Validation.test.js      (4 tests)
```

### **📁 `/src/components/register/`**
```
Register.test.jsx       (6 tests)
Validation.test.js      (5+ tests)
```

### **📁 `/src/service/`**
```
localStorage.test.js    (47 tests)
```

---

## 🔐 **Tests de Login**

### **📄 `Login.test.jsx`** (4 tests)

#### **✅ Tests de UI:**
1. **`debe mostrar todos los textos y placeholders del formulario`**
   - Verifica renderizado de elementos básicos
   - Valida textos: "Inicio de sesión", campos obligatorios
   - Confirma presencia de botones y enlaces

#### **✅ Tests de Navegación:**
2. **`debe tener enlace correcto para navegar al registro`**
   - Verifica enlace "Crear Cuenta" → `/register`
   - Valida estructura HTML de React Router

3. **`debe tener elementos de formulario para envío`**
   - Confirma presencia de `<form>`, inputs y botón submit
   - Valida tipos: email, password

4. **`debe tener estructura correcta para navegación condicional`**
   - Verifica manejo de parámetros de redirección
   - Valida UX de navegación entre páginas

### **📄 `login/Validation.test.js`** (4 tests)

#### **✅ Tests de Email:**
- **Emails válidos:** @duoc.cl, @profesor.duoc.cl, @gmail.com
- **Emails inválidos:** otros dominios, formatos incorrectos

#### **✅ Tests de Password:**
- **Válidos:** 4-10 caracteres
- **Inválidos:** muy cortos (<4) o muy largos (>10)

---

## 📝 **Tests de Registro**

### **📄 `Register.test.jsx`** (6 tests)

#### **✅ Tests de Renderizado:**
1. **`Debe mostrar todos los textos y placeholders del registro`**
   - Campos: RUN, Nombre, Apellidos, Dirección, Email, Contraseñas
   - Botones y enlaces de navegación

2. **`Debe renderizar elementos del formulario`**
   - Tipos de input correctos
   - Estructura HTML válida

3. **`Debe mostrar placeholders informativos`**
   - Ayudas visuales para el usuario

4. **`Debe tener estructura de navegación`**
   - Enlaces al login

5. **`Debe aplicar clases CSS`**
   - Estilos y diseño

6. **`Debe validar botón de envío`**
   - Botón submit funcional

### **📄 `register/Validation.test.js`** (5+ tests)

#### **✅ Tests de RUN Chileno:**
- **Válidos:** Formato 12345678-9, 12345678-K
- **Inválidos:** Formatos incorrectos, caracteres no válidos
- **Casos extremos:** null, undefined, espacios
- **Manejo de mayúsculas/minúsculas** para dígito K

---

## 💾 **Tests de Lógica de Negocio**

### **📄 `localStorage.test.js`** (47 tests)

#### **🛍️ 1. Funciones de Productos (5 tests)**
- `getProductos()` - Verificar catálogo
- `getProductoById()` - Búsqueda por ID
- `getProductosByCategoria()` - Filtros
- `getCategorias()` - Lista de categorías

#### **🛒 2. Funciones de Carrito (6 tests)**
- `getCart()` - Estado del carrito
- `addToCart()` - Agregar productos
- `removeFromCart()` - Eliminar productos
- `updateQuantity()` - Modificar cantidades
- `clearCart()` - Vaciar carrito
- `getPriceCart()` - Cálculo de totales

#### **💰 3. Precios y Ofertas (7 tests)**
- `calcularPrecioConDescuento()` - Aplicar descuentos
- `getPrecioFinal()` - Precio final con ofertas
- `esOfertaActiva()` - Validación de fechas de oferta
- Casos especiales: fechas inválidas, ofertas vencidas

#### **👤 4. Gestión de Usuarios (3 tests)**
- `setUserSession()` - Iniciar sesión
- `clearUserSession()` - Cerrar sesión
- `isUserLoggedIn()` - Estado de autenticación

#### **⚠️ 5. Casos Extremos (3 tests)**
- Parámetros nulos/undefined
- Categorías inexistentes
- Descuentos inválidos

#### **🎭 6. Tests con Mocks (23 tests)**

##### **6.1 Mock de localStorage (6 tests):**
- Simulación completa del localStorage del navegador
- Control total de datos de entrada y salida
- Verificación de llamadas a métodos específicos

##### **6.2 Mock de Fechas (2 tests):**
- Control de fecha actual para tests de ofertas
- Verificación de lógica temporal

##### **6.3 Tests de Casos de Error (15 tests):**
- localStorage corrupto
- Datos malformados
- Tipos de datos incorrectos
- Fallos de almacenamiento
- Validación de robustez

---

## 🛠️ **Tecnologías de Testing**

### **Framework Principal:**
- **Vitest** - Framework de testing rápido y moderno
- **React Testing Library** - Testing de componentes React
- **jsdom** - Simulación del DOM del navegador

### **Técnicas Utilizadas:**
- **Server-Side Rendering** (`renderToString`) - Tests de componentes
- **Mocks con vi** - Simulación de dependencias
- **MemoryRouter** - Testing de navegación React Router
- **Fake Timers** - Control de fechas para tests temporales

---

## 📈 **Cobertura de Testing**

### **✅ Componentes Cubiertos:**
- Login completo (UI + Validaciones + Navegación)
- Register completo (UI + Validaciones)
- Lógica de negocio completa (localStorage)

### **✅ Funcionalidades Cubiertas:**
- **Autenticación** - Login/Logout/Registro
- **E-commerce** - Carrito, productos, precios
- **Validaciones** - Formularios, datos, tipos
- **Navegación** - Enlaces, rutas, redirecciones
- **Manejo de Errores** - Casos extremos, fallos

### **✅ Tipos de Testing:**
- **Unit Tests** - Funciones individuales
- **Component Tests** - Renderizado de UI
- **Integration Tests** - Flujos completos
- **Mock Tests** - Dependencias simuladas
- **Error Tests** - Manejo de excepciones

---

## 🚀 **Ejecutar Tests**

### **Comandos Disponibles:**
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con interfaz visual
npm run test --ui

# Ejecutar tests en modo watch
npm run test --watch

# Ejecutar tests con cobertura
npm run test --coverage
```

### **Archivos de Configuración:**
- `vitest.config.js` - Configuración de Vitest
- `jsdom` - Entorno de navegador simulado

---

## 📋 **Beneficios de la Suite de Tests**

### **🔒 Calidad Asegurada:**
- **Detección temprana** de bugs
- **Refactoring seguro** del código
- **Documentación viva** de funcionalidades

### **🚀 Desarrollo Ágil:**
- **Feedback inmediato** en cambios
- **Integración continua** preparada
- **Mantenimiento simplificado**

### **👥 Colaboración:**
- **Especificaciones claras** de comportamiento
- **Onboarding rápido** para nuevos desarrolladores
- **Estándares de calidad** consistentes

---

## 🎯 **Próximos Pasos Sugeridos**

### **Expansión de Tests:**
- Tests de componentes adicionales (Navbar, Products, ShoppingCart)
- Tests de integración end-to-end
- Tests de performance

### **Mejoras Técnicas:**
- Aumentar cobertura de código al 95%+
- Implementar tests de accesibilidad
- Agregar tests de responsive design

---

## 👨‍💻 **Mantenimiento**

### **Al agregar nuevas funcionalidades:**
1. **Escribir tests primero** (TDD)
2. **Mantener convenciones** de naming
3. **Documentar casos de uso** complejos
4. **Actualizar esta documentación**

### **Revisión periódica:**
- **Verificar tests obsoletos**
- **Optimizar performance de tests**
- **Actualizar dependencias de testing**

---

*Documentación generada para Level Up Gamer React - Proyecto de E-commerce Gaming*
*Última actualización: Octubre 2025*
