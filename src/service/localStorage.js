const productos = [
  {
    id: 1,
    imagenUrl: '/images/products/fondo.png',
    titulo: 'Resident Evil 4 Remake',
    atributos: 'Survival Horror',
    precio: '60000',
    plataforma: ['PC'],
  },
  {
    id: 2,
    imagenUrl: '/images/products/fondo2.png',
    titulo: 'Dark Souls III',
    atributos: 'Action RPG, Souls-like, Adventure',
    precio: '40000',
    plataforma: ['PC', 'PS', 'Xbox'],
  },
  {
    id: 3,
    imagenUrl: '/images/products/fondo3.png',
    titulo: 'Devil May Cry 5',
    atributos: 'Action, Hack and Slash, Action-Adventure',
    precio: '30000',
    plataforma: ['PC', 'PS', 'Xbox'],
  },
  {
    id: 4,
    imagenUrl: '/images/products/fondo4.png',
    titulo: 'Dead Cells',
    atributos: 'Roguelike, Metroidvania, Action, Indie',
    precio: '20000',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 5,
    imagenUrl: '/images/products/fondo5.jpg',
    titulo: 'Hollow Knight: Silksong',
    atributos: 'Action, Adventure, Indie, Metroidvania',
    precio: '10300',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 6,
    imagenUrl: '/images/products/fondo6.png',
    titulo: 'Elden Ring Nightreing',
    atributos: 'Action RPG, Open World',
    precio: '70000',
    plataforma: ['PC', 'PS', 'Xbox'],
  },
  {
    id: 7,
    imagenUrl: '/images/products/fondo7.png',
    titulo: 'Doom',
    atributos: 'First-Person Shooter, Action',
    precio: '35000',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 8,
    imagenUrl: '/images/products/fondo8.png',
    titulo: 'The Last Faith',
    atributos: 'Action, Adventure, Indie, Metroidvania, Souls-like',
    precio: '25000',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 9,
    imagenUrl: '/images/products/fondo9.png',
    titulo: 'Moonscars',
    atributos: 'Action, Platformer, Souls-like, 2D',
    precio: '45000',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 10,
    imagenUrl: '/images/products/fondo10.png',
    titulo: 'Death\'s Gambit',
    atributos: 'Action, RPG, Platformer, Souls-like, 2D',
    precio: '55000',
    plataforma: ['PC', 'PS', 'Xbox', 'NS'],
  },
  {
    id: 11,
    imagenUrl: '/images/products/fondo11.png',
    titulo: 'Nioh',
    atributos: 'Action RPG, Souls-like, Dark Fantasy',
    precio: '38000',
    plataforma: ['PC', 'PS'],
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