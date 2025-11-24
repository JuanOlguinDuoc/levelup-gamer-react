# Sistema de Protección de Rutas por Rol

## Descripción

Este documento explica cómo funciona el sistema de protección de rutas basado en roles en la aplicación Level Up Gamer.

## Componentes Implementados

### 1. AdminRoute (`/src/components/AdminRoute.jsx`)

Componente de React que protege las rutas que solo deben ser accesibles para usuarios con rol de administrador.

**Características:**
- Verifica si el usuario está autenticado
- Verifica si el usuario tiene rol de administrador
- Redirige al login si no está autenticado
- Redirige al home y muestra un mensaje de error si no tiene permisos

**Uso:**
```jsx
<Route path="/admin" element={
  <AdminRoute>
    <Admin />
  </AdminRoute>
} />
```

### 2. Funciones Helper en localStorage.js

Se agregaron las siguientes funciones para manejar roles:

#### `getUserRole()`
Obtiene el rol del usuario actual desde la sesión.

```javascript
const role = getUserRole();
// Retorna: 'administrador', 'cliente', 'usuario', o null
```

#### `isUserAdmin()`
Verifica si el usuario actual es administrador.

```javascript
if (isUserAdmin()) {
  // Usuario es administrador
}
```

### 3. DataInitializer (Backend)

Inicializa automáticamente los roles en la base de datos al arrancar la aplicación:
- `administrador`
- `cliente`
- `usuario`

## Flujo de Autenticación

1. **Registro:**
   - El usuario se registra con rol "cliente" por defecto
   - El backend guarda el usuario con el rol asignado
   - El rol se incluye en la respuesta del registro

2. **Login:**
   - El usuario inicia sesión
   - El backend retorna el token JWT
   - El frontend obtiene los datos del usuario incluyendo el rol
   - Se guarda en localStorage mediante `setUserSession()`

3. **Protección de Rutas:**
   - Al intentar acceder a `/admin`, `AdminRoute` verifica:
     - ¿Está autenticado? → No → Redirige a `/login`
     - ¿Es administrador? → No → Redirige a `/home` con mensaje de error
     - ¿Es administrador? → Sí → Permite acceso

## Cómo Crear Más Rutas Protegidas

### Opción 1: Crear un componente genérico de ruta protegida por rol

```jsx
// RoleProtectedRoute.jsx
export default function RoleProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = isUserLoggedIn();
  const userRole = getUserRole();

  if (!isLoggedIn) {
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    showErrorToast('No tienes permisos para acceder a esta página');
    return <Navigate to="/home" replace />;
  }

  return children;
}

// Uso:
<Route path="/dashboard" element={
  <RoleProtectedRoute allowedRoles={['administrador', 'cliente']}>
    <Dashboard />
  </RoleProtectedRoute>
} />
```

### Opción 2: Reutilizar AdminRoute para otras rutas de admin

```jsx
<Route path="/admin/users" element={
  <AdminRoute>
    <UserManagement />
  </AdminRoute>
} />
```

## Estructura de Datos del Usuario

Cuando el usuario inicia sesión, `setUserSession()` normaliza los datos:

```javascript
{
  id: 1,
  run: "12345678-9",
  nombre: "Juan",
  apellidos: "Pérez",
  email: "juan@duoc.cl",
  role: "administrador", // o { id: 1, name: "administrador" }
  telefono: "+56912345678",
  direccion: "Calle Falsa 123",
  // ... otros campos
}
```

## Crear un Usuario Administrador

### Opción 1: Desde el código (para desarrollo)

Modifica `DataInitializer.java` para crear un usuario admin por defecto:

```java
@Autowired
private UserRepo userRepo;

@Autowired
private PasswordEncoder passwordEncoder;

@Override
public void run(String... args) throws Exception {
    // Crear roles...
    
    // Crear usuario admin si no existe
    if (userRepo.findByEmail("admin@duoc.cl").isEmpty()) {
        User admin = new User();
        admin.setRun("11111111-1");
        admin.setFirstName("Admin");
        admin.setLastName("Sistema");
        admin.setEmail("admin@duoc.cl");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(roleRepo.findByName("administrador").get());
        userRepo.save(admin);
        System.out.println("✓ Usuario admin creado");
    }
}
```

### Opción 2: Actualizar un usuario existente

1. Accede a H2 Console: http://localhost:8080/h2-console
2. Ejecuta:
```sql
-- Ver roles disponibles
SELECT * FROM roles;

-- Actualizar rol de un usuario (ejemplo: id_rol=1 es 'administrador')
UPDATE users SET role_id = 1 WHERE email = 'usuario@duoc.cl';
```

### Opción 3: Crear endpoint para promover usuarios (recomendado)

```java
@PutMapping("/{id}/promote-admin")
@PreAuthorize("hasRole('administrador')")
public ResponseEntity<Object> promoteToAdmin(@PathVariable Long id) {
    User user = userRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
    Role adminRole = roleRepo.findByName("administrador")
        .orElseThrow(() -> new RuntimeException("Rol administrador no encontrado"));
    
    user.setRole(adminRole);
    userRepo.save(user);
    
    return ResponseEntity.ok(Map.of("message", "Usuario promovido a administrador"));
}
```

## Seguridad Adicional

### Backend (Spring Security)

Asegúrate de proteger los endpoints en `SecurityConfig.java`:

```java
.authorizeHttpRequests(authz -> authz
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/admin/**").hasRole("administrador")
    .anyRequest().authenticated())
```

### Frontend

El componente `AdminRoute` es solo una capa de UI. La seguridad real debe estar en el backend.

## Troubleshooting

### El usuario no puede acceder a /admin

1. Verifica que el usuario tenga el rol correcto:
```javascript
console.log(getCurrentUser());
console.log(getUserRole());
console.log(isUserAdmin());
```

2. Verifica que el rol se guardó correctamente en el backend:
```sql
SELECT u.email, r.name as role 
FROM users u 
JOIN roles r ON u.role_id = r.id;
```

3. Verifica que los roles existan en la base de datos:
```sql
SELECT * FROM roles;
```

### El rol no se guarda al registrar

Verifica que el `AuthController.register()` esté asignando el rol correctamente y que `DataInitializer` haya creado los roles.

## Próximos Pasos

1. Implementar más roles específicos (vendedor, moderador, etc.)
2. Crear un panel de administración para gestionar roles
3. Implementar permisos más granulares (CRUD específico por recurso)
4. Agregar logs de auditoría para acciones de administrador
