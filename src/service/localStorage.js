const productos = [
  // JUEGOS
  {
    id: 1,
    imagenUrl: '/images/products/fondo.png',
    titulo: 'Resident Evil 4 Remake',
    atributos: 'Survival Horror',
    precio: '60000',
    categoria: 'juegos',
    plataforma: ['PC'],
  },
  {
    id: 2,
    imagenUrl: '/images/products/fondo2.png',
    titulo: 'Dark Souls III',
    atributos: 'Action RPG, Souls-like, Adventure',
    precio: '40000',
    categoria: 'juegos',
    plataforma: ['PC', 'PS', 'Xbox'],
  },
  {
    id: 3,
    imagenUrl: '/images/products/fondo3.png',
    titulo: 'Devil May Cry 5',
    atributos: 'Action, Hack and Slash, Action-Adventure',
    precio: '30000',
    categoria: 'juegos',
    plataforma: ['PC', 'PS', 'Xbox'],
  },
  {
    id: 4,
    imagenUrl: '/images/products/fondo4.png',
    titulo: 'Dead Cells',
    atributos: 'Roguelike, Metroidvania, Action, Indie',
    precio: '20000',
    categoria: 'juegos',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 5,
    imagenUrl: '/images/products/fondo5.jpg',
    titulo: 'Hollow Knight: Silksong',
    atributos: 'Action, Adventure, Indie, Metroidvania',
    precio: '10300',
    categoria: 'juegos',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },

  // MONITORES
  {
    id: 6,
    imagenUrl: '/images/products/ASUS ROG monitor 27 inch.jpeg',
    titulo: 'Monitor Gaming ASUS ROG 27"',
    atributos: '144Hz, 1ms, QHD 2560x1440, G-Sync',
    precio: '450000',
    categoria: 'monitores',
    plataforma: ['PC'],
  },
  {
    id: 7,
    imagenUrl: '/images/products/LG UltraGear 24 inch monitor.jpeg',
    titulo: 'Monitor LG UltraGear 24"',
    atributos: '165Hz, IPS, Full HD, FreeSync Premium',
    precio: '280000',
    categoria: 'monitores',
    plataforma: ['PC'],
  },
  {
    id: 8,
    imagenUrl: '/images/products/Samsung Odyssey G7 32 inch.jpeg',
    titulo: 'Monitor Samsung Odyssey 32"',
    atributos: '240Hz, Curvo, QHD, HDR10',
    precio: '650000',
    categoria: 'monitores',
    plataforma: ['PC'],
  },

  // PC ARMADOS
  {
    id: 9,
    imagenUrl: '/images/products/Gaming PC RTX 4060 Ti setup.jpeg',
    titulo: 'PC Gamer RTX 4060 Ti',
    atributos: 'Intel i5-13400F, 16GB RAM, RTX 4060 Ti, SSD 1TB',
    precio: '1200000',
    categoria: 'pc-armados',
    plataforma: ['PC'],
  },
  {
    id: 10,
    imagenUrl: '/images/products/Gaming PC RTX 4070 Super build.jpeg',
    titulo: 'PC Gamer RTX 4070 Super',
    atributos: 'AMD Ryzen 7 7700X, 32GB RAM, RTX 4070 Super, SSD 2TB',
    precio: '1800000',
    categoria: 'pc-armados',
    plataforma: ['PC'],
  },
  {
    id: 11,
    imagenUrl: '/images/products/Budget gaming PC GTX 1660.jpeg',
    titulo: 'PC Gamer Básico GTX 1660',
    atributos: 'Intel i3-12100F, 8GB RAM, GTX 1660 Super, SSD 500GB',
    precio: '650000',
    categoria: 'pc-armados',
    plataforma: ['PC'],
  },

  // JOYSTICKS/CONTROLES
  {
    id: 12,
    imagenUrl: '/images/products/Xbox Wireless Controller EVA.jpeg',
    titulo: 'Control Xbox Wireless',
    atributos: 'Bluetooth, Compatible PC/Xbox, Batería 40hrs',
    precio: '65000',
    categoria: 'controles',
    plataforma: ['PC', 'Xbox'],
  },
  {
    id: 13,
    imagenUrl: '/images/products/PS5 DualSense controller pro.jpeg',
    titulo: 'Control DualSense PS5',
    atributos: 'Haptic Feedback, Gatillos Adaptativos, USB-C',
    precio: '70000',
    categoria: 'controles',
    plataforma: ['PS'],
  },
  {
    id: 14,
    imagenUrl: '/images/products/Nintendo Switch Pro Controller.jpeg',
    titulo: 'Control Pro Nintendo Switch',
    atributos: 'Gyroscopio, NFC, Batería 40hrs, HD Rumble',
    precio: '75000',
    categoria: 'controles',
    plataforma: ['NS'],
  },

  // CONSOLAS
  {
    id: 15,
    imagenUrl: '/images/products/PlayStation 5 Slim console.jpeg',
    titulo: 'PlayStation 5 Slim',
    atributos: '1TB SSD, 4K Gaming, Ray Tracing, Control incluido',
    precio: '650000',
    categoria: 'consolas',
    plataforma: ['PS'],
  },
  {
    id: 16,
    imagenUrl: '/images/products/Xbox Series X console.png',
    titulo: 'Xbox Series X',
    atributos: '1TB SSD, 4K/120fps, Quick Resume, Game Pass',
    precio: '620000',
    categoria: 'consolas',
    plataforma: ['Xbox'],
  },
  {
    id: 17,
    imagenUrl: '/images/products/Nintendo Switch OLED model.jpeg',
    titulo: 'Nintendo Switch OLED',
    atributos: 'Pantalla OLED 7", 64GB, Dock incluido, Joy-Con',
    precio: '420000',
    categoria: 'consolas',
    plataforma: ['NS'],
  }
];

localStorage.clear();
localStorage.setItem('productos', JSON.stringify(productos));

if (!localStorage.getItem('catalogo')) {
  localStorage.setItem('catalogo', JSON.stringify([]));
}

const productosRecuperados = JSON.parse(localStorage.getItem('productos'));
console.log('Productos recuperados del localStorage:', productosRecuperados);

export const getProductos = () => {
  return JSON.parse(localStorage.getItem('productos')) || []
}

export const getProductoById = (id) => {
  const productos = JSON.parse(localStorage.getItem('productos')) || []
  return productos.find(producto => producto.id === parseInt(id))
}

export const getSelectedProduct = () => {
  return JSON.parse(localStorage.getItem('selectedProduct')) || null
}

export const getProductosByCategoria = (categoria) => {
  const productos = JSON.parse(localStorage.getItem('productos')) || []
  return productos.filter(producto => producto.categoria === categoria)
}

export const getCategorias = () => {
  const productos = JSON.parse(localStorage.getItem('productos')) || []
  const categorias = [...new Set(productos.map(producto => producto.categoria))]
  return categorias
}

// Funciones para manejo de sesión de usuario
export const setUserSession = (userData) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', JSON.stringify(userData));
}

export const clearUserSession = () => {
  localStorage.setItem('isLoggedIn', 'false');
  localStorage.removeItem('currentUser');
}

export const isUserLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
}

export const getCurrentUser = () => {
  if (isUserLoggedIn()) {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  }
  return null;
}

// Función para registrar un nuevo usuario
export const registerUser = (userData) => {
  console.log('Datos recibidos para registro:', userData);
  
  // Obtener usuarios existentes o crear array vacío
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  console.log('Usuarios existentes:', existingUsers);
  
  // Verificar si el email ya existe
  const userEmailExists = existingUsers.find(user => user.email === userData.email);
  
  // Verificar RUN
  const userRunExists = existingUsers.find(user => user.run === userData.run);
  
  console.log('RUN a verificar:', userData.run);
  console.log('¿RUN existe?:', userRunExists);
  console.log('¿Email existe?:', userEmailExists);
  
  if (userRunExists) {
    return { success: false, message: 'El RUN ya está registrado' };
  }

  if (userEmailExists) {
    return { success: false, message: 'El correo ya está registrado' };
  }
  
  // Agregar nuevo usuario
  const newUser = {
    ...userData,
    id: Date.now(), // ID único basado en timestamp
    registrationDate: new Date().toISOString(),
    role: 'user' // Por defecto todos son usuarios normales
  };
  
  existingUsers.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  
  // Crear sesión automáticamente después del registro exitoso
  setUserSession({
    email: newUser.email,
    name: newUser.nombre,
    run: newUser.run,
    role: newUser.role,
    loginTime: new Date().toISOString()
  });
  
  console.log('Usuario registrado exitosamente:', newUser);
  console.log('Sesión creada automáticamente');
  
  return { success: true, message: 'Usuario registrado exitosamente', user: newUser };
};

// Modificar validateLogin para incluir usuarios registrados
export const validateLogin = (email, password) => {
  // Usuarios hardcodeados (admin y test)
  const hardcodedUsers = [
    { 
      email: 'admin@duoc.cl', 
      password: 'admin123',
      name: 'Administrador',
      role: 'admin'
    }
  ];
  
  // Usuarios registrados dinámicamente
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  
  // Combinar ambos arrays
  const allUsers = [...hardcodedUsers, ...registeredUsers];
  
  const user = allUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    setUserSession({
      email: user.email,
      name: user.name || user.nombre, // Compatibility
      role: user.role,
      loginTime: new Date().toISOString()
    });
    return { success: true, user };
  }
  
  return { success: false, message: 'Credenciales inválidas' };
};