import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    getProductos,
    getProductoById,
    getCart,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getPriceCart,
    getProductosByCategoria,
    getCategorias,
    calcularPrecioConDescuento,
    getPrecioFinal,
    esOfertaActiva,
    setUserSession,
    clearUserSession,
    isUserLoggedIn
} from './localStorage.js';

describe('localStorage Functions Tests', () => {

    // Tests de Productos
    describe('Funciones de Productos', () => {
        it('getProductos debe retornar un array', () => {
            const productos = getProductos();
            expect(Array.isArray(productos)).toBe(true);
            expect(productos.length).toBeGreaterThan(0);
        });

        it('getProductoById debe retornar producto específico', () => {
            const producto = getProductoById(1);
            expect(producto).toBeDefined();
            expect(producto.id).toBe(1);
        });

        it('getProductoById debe retornar undefined para ID inexistente', () => {
            const producto = getProductoById(999);
            expect(producto).toBeUndefined();
        });

        it('getProductosByCategoria debe filtrar correctamente', () => {
            const juegos = getProductosByCategoria('juegos');
            expect(Array.isArray(juegos)).toBe(true);
            juegos.forEach(producto => {
                expect(producto.categoria).toBe('juegos');
            });
        });

        it('getCategorias debe retornar array de categorías únicas', () => {
            const categorias = getCategorias();
            expect(Array.isArray(categorias)).toBe(true);
            expect(categorias.length).toBeGreaterThan(0);
            expect(categorias.includes('juegos')).toBe(true);
        });
    });

    // Tests de Carrito
    describe('Funciones de Carrito', () => {
        beforeEach(() => {
            clearCart();
        });

        it('getCart debe retornar array vacío inicialmente', () => {
            const cart = getCart();
            expect(Array.isArray(cart)).toBe(true);
            expect(cart.length).toBe(0);
        });

        it('addToCart debe agregar producto al carrito', () => {
            const mockProduct = { id: 1, titulo: 'Test Product', precio: 1000 };
            addToCart(mockProduct);
            
            const cart = getCart();
            expect(cart.length).toBe(1);
            expect(cart[0].id).toBe(1);
        });

        it('clearCart debe vaciar el carrito', () => {
            const mockProduct = { id: 1, titulo: 'Test Product', precio: 1000 };
            addToCart(mockProduct);
            
            clearCart();
            const cart = getCart();
            expect(cart.length).toBe(0);
        });

        it('removeFromCart debe eliminar producto específico', () => {
            const mockProduct1 = { id: 1, titulo: 'Product 1', precio: 1000 };
            const mockProduct2 = { id: 2, titulo: 'Product 2', precio: 2000 };
            
            addToCart(mockProduct1);
            addToCart(mockProduct2);
            removeFromCart(1);
            
            const cart = getCart();
            expect(cart.length).toBe(1);
            expect(cart[0].id).toBe(2);
        });

        it('updateQuantity debe actualizar cantidad del producto', () => {
            const mockProduct = { id: 1, titulo: 'Test Product', precio: 1000 };
            addToCart(mockProduct);
            updateQuantity(1, 3);
            
            const cart = getCart();
            expect(cart[0].cantidad).toBe(3);
        });

        it('getPriceCart debe calcular total correctamente', () => {
            const mockProduct1 = { id: 1, titulo: 'Product 1', precio: 1000 };
            const mockProduct2 = { id: 2, titulo: 'Product 2', precio: 2000 };
            
            addToCart(mockProduct1);
            addToCart(mockProduct2);
            
            const total = getPriceCart();
            expect(typeof total).toBe('number');
            expect(total).toBeGreaterThan(0);
        });
    });

    // Tests de Cálculos de Precios
    describe('Funciones de Precios y Ofertas', () => {
        it('calcularPrecioConDescuento debe calcular correctamente', () => {
            const precioOriginal = 1000;
            const descuento = 20;
            const precioFinal = calcularPrecioConDescuento(precioOriginal, descuento);
            
            expect(precioFinal).toBe(800);
        });

        it('calcularPrecioConDescuento debe manejar descuento 0', () => {
            const precioOriginal = 1000;
            const descuento = 0;
            const precioFinal = calcularPrecioConDescuento(precioOriginal, descuento);
            
            expect(precioFinal).toBe(1000);
        });

        it('getPrecioFinal debe retornar precio con descuento si hay oferta', () => {
            const productoEnOferta = {
                precio: 1000,
                enOferta: true,
                descuento: 20,
                fechaInicioOferta: '2024-01-01',
                fechaFinOferta: '2025-12-31'
            };
            
            const precioFinal = getPrecioFinal(productoEnOferta);
            expect(precioFinal).toBeLessThan(productoEnOferta.precio);
        });

        it('esOfertaActiva debe validar fechas correctamente', () => {
            const productoOfertaActiva = {
                enOferta: true,
                fechaInicioOferta: '2024-01-01',
                fechaFinOferta: '2025-12-31'
            };
            
            const productoOfertaVencida = {
                enOferta: true,
                fechaInicioOferta: '2020-01-01',
                fechaFinOferta: '2020-12-31'
            };
            
            expect(esOfertaActiva(productoOfertaActiva)).toBe(true);
            expect(esOfertaActiva(productoOfertaVencida)).toBe(false);
        });

        it('esOfertaActiva debe manejar fechas de inicio mayor a fecha fin', () => {
            const productoFechasInvalidas = {
                enOferta: true,
                fechaInicioOferta: '2025-12-31',
                fechaFinOferta: '2024-01-01'
            };
            
            expect(esOfertaActiva(productoFechasInvalidas)).toBe(false);
        });

        it('esOfertaActiva debe manejar producto sin fechas', () => {
            const productoSinFechas = {
                enOferta: true
            };
            
            expect(esOfertaActiva(productoSinFechas)).toBe(false);
        });

        it('esOfertaActiva debe manejar fechas inválidas', () => {
            const productoFechaInvalida = {
                enOferta: true,
                fechaInicioOferta: 'fecha-invalida',
                fechaFinOferta: '2025-12-31'
            };
            
            expect(esOfertaActiva(productoFechaInvalida)).toBe(false);
        });
    });

    // Tests de Sesión de Usuario
    describe('Funciones de Usuario', () => {
        beforeEach(() => {
            clearUserSession();
        });

        it('isUserLoggedIn debe retornar false inicialmente', () => {
            expect(isUserLoggedIn()).toBe(false);
        });

        it('setUserSession debe establecer sesión de usuario', () => {
            const mockUser = {
                email: 'test@duoc.cl',
                nombre: 'Test User'
            };
            
            setUserSession(mockUser);
            expect(isUserLoggedIn()).toBe(true);
        });

        it('clearUserSession debe limpiar sesión', () => {
            const mockUser = {
                email: 'test@duoc.cl',
                nombre: 'Test User'
            };
            
            setUserSession(mockUser);
            clearUserSession();
            expect(isUserLoggedIn()).toBe(false);
        });
    });

    // Tests de Casos Extremos
    describe('Casos Extremos', () => {
        it('debe manejar parámetros nulos o undefined', () => {
            expect(() => getProductoById(null)).not.toThrow();
            expect(() => getProductoById(undefined)).not.toThrow();
            expect(() => getProductosByCategoria(null)).not.toThrow();
        });

        it('debe manejar categorías inexistentes', () => {
            const productos = getProductosByCategoria('categoria-inexistente');
            expect(Array.isArray(productos)).toBe(true);
            expect(productos.length).toBe(0);
        });

        it('debe manejar descuentos inválidos', () => {
            expect(() => calcularPrecioConDescuento(1000, -10)).not.toThrow();
            expect(() => calcularPrecioConDescuento(1000, 110)).not.toThrow();
        });
    });


    //Intento de test con mocks
    // Tests CON Mocks
    describe('Tests con Mocks', () => {
        let originalLocalStorage;
        
        beforeEach(() => {
            // Guardar localStorage original
            originalLocalStorage = global.localStorage;
            
            // Crear mock de localStorage
            global.localStorage = {
                getItem: vi.fn(),
                setItem: vi.fn(),
                clear: vi.fn(),
                removeItem: vi.fn()
            };
        });

        afterEach(() => {
            // Restaurar localStorage original
            global.localStorage = originalLocalStorage;
        });

        it('getProductos con mock debe retornar productos mockeados', () => {
            const mockProductos = [
                { id: 1, titulo: 'Producto Mock 1', precio: 1000, categoria: 'juegos' },
                { id: 2, titulo: 'Producto Mock 2', precio: 2000, categoria: 'consolas' }
            ];
            
            localStorage.getItem.mockReturnValue(JSON.stringify(mockProductos));
            
            const productos = getProductos();
            expect(productos).toEqual(mockProductos);
            expect(localStorage.getItem).toHaveBeenCalledWith('productos');
        });

        it('getCart con mock debe retornar carrito mockeado', () => {
            const mockCarrito = [
                { id: 1, titulo: 'Mock Product', precio: 1000, cantidad: 2 }
            ];
            
            localStorage.getItem.mockReturnValue(JSON.stringify(mockCarrito));
            
            const carrito = getCart();
            expect(carrito).toEqual(mockCarrito);
            expect(localStorage.getItem).toHaveBeenCalledWith('carrito');
        });

        it('addToCart con mock debe llamar setItem', () => {
            const mockCarritoExistente = [];
            const mockProduct = { id: 1, titulo: 'Test Product', precio: 1000 };
            
            localStorage.getItem.mockReturnValue(JSON.stringify(mockCarritoExistente));
            
            addToCart(mockProduct);
            
            expect(localStorage.setItem).toHaveBeenCalled();
            expect(localStorage.getItem).toHaveBeenCalledWith('carrito');
        });

        it('clearCart con mock debe llamar setItem con array vacío', () => {
            clearCart();
            
            expect(localStorage.setItem).toHaveBeenCalledWith('carrito', JSON.stringify([]));
        });

        it('isUserLoggedIn con mock debe verificar localStorage', () => {
            localStorage.getItem.mockReturnValue('true');
            
            const isLoggedIn = isUserLoggedIn();
            
            expect(localStorage.getItem).toHaveBeenCalledWith('isLoggedIn');
            expect(isLoggedIn).toBe(true);
        });

        it('setUserSession con mock debe guardar datos del usuario', () => {
            const mockUserData = { email: 'test@duoc.cl', nombre: 'Test User' };
            
            setUserSession(mockUserData);
            
            expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
            expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUserData));
        });
    });

    // Tests de Mock de Fechas
    describe('Tests con Mock de Fechas', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('esOfertaActiva con fecha mockeada debe validar correctamente', () => {
            // Mockear fecha actual al 15 de junio de 2024
            const mockFecha = new Date('2024-06-15');
            vi.setSystemTime(mockFecha);

            const productoOfertaActiva = {
                enOferta: true,
                fechaInicioOferta: '2024-01-01',
                fechaFinOferta: '2024-12-31'
            };

            const productoOfertaVencida = {
                enOferta: true,
                fechaInicioOferta: '2023-01-01',
                fechaFinOferta: '2023-12-31'
            };

            expect(esOfertaActiva(productoOfertaActiva)).toBe(true);
            expect(esOfertaActiva(productoOfertaVencida)).toBe(false);
        });

        it('esOfertaActiva con diferentes fechas mockeadas', () => {
            // Fecha antes del período de oferta
            vi.setSystemTime(new Date('2023-12-31'));
            
            const producto = {
                enOferta: true,
                fechaInicioOferta: '2024-01-01',
                fechaFinOferta: '2024-12-31'
            };

            expect(esOfertaActiva(producto)).toBe(false);

            // Fecha después del período de oferta
            vi.setSystemTime(new Date('2025-01-01'));
            expect(esOfertaActiva(producto)).toBe(false);

            // Fecha dentro del período de oferta
            vi.setSystemTime(new Date('2024-06-15'));
            expect(esOfertaActiva(producto)).toBe(true);
        });
    });

    // Tests de Casos de Error con Mocks
    describe('Tests de Casos de Error con Mocks', () => {
        let originalLocalStorage;
        
        beforeEach(() => {
            originalLocalStorage = global.localStorage;
            global.localStorage = {
                getItem: vi.fn(),
                setItem: vi.fn(),
                clear: vi.fn(),
                removeItem: vi.fn()
            };
        });

        afterEach(() => {
            global.localStorage = originalLocalStorage;
        });

        it('setUserSession con datos nulos debe manejar error', () => {
            expect(() => setUserSession(null)).not.toThrow();
            expect(() => setUserSession(undefined)).not.toThrow();
            
            // Verificar que se llama localStorage incluso con datos nulos
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        it('setUserSession con datos incompletos', () => {
            const datosIncompletos = { nombre: 'Juan' }; // Sin email
            
            expect(() => setUserSession(datosIncompletos)).not.toThrow();
            expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
            expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(datosIncompletos));
        });

        it('setUserSession con tipos de datos incorrectos', () => {
            expect(() => setUserSession('string')).not.toThrow();
            expect(() => setUserSession(123)).not.toThrow();
            expect(() => setUserSession([])).not.toThrow();
            expect(() => setUserSession(true)).not.toThrow();
            
            // Verificar que siempre trata de guardar algo
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        it('addToCart con producto inválido debe manejar error', () => {
            localStorage.getItem.mockReturnValue(JSON.stringify([]));
            
            expect(() => addToCart(null)).not.toThrow();
            expect(() => addToCart({})).not.toThrow(); // Sin ID
            expect(() => addToCart({ id: 'abc' })).not.toThrow(); // ID no numérico
            expect(() => addToCart({ precio: 'gratis' })).not.toThrow(); // Precio no numérico
        });

        it('getProductoById con localStorage corrupto debe lanzar error', () => {
            localStorage.getItem.mockReturnValue('datos-corruptos-no-json');
            
            expect(() => getProductoById(1)).toThrow();
        });

        it('getCart con localStorage corrupto debe lanzar error', () => {
            localStorage.getItem.mockReturnValue('no-es-json-valido');
            
            expect(() => getCart()).toThrow();
        });

        it('localStorage.setItem que falla debe lanzar error', () => {
            localStorage.setItem.mockImplementation(() => {
                throw new Error('LocalStorage is full');
            });
            
            const mockUser = { email: 'test@duoc.cl', nombre: 'Test User' };
            expect(() => setUserSession(mockUser)).toThrow();
        });

        it('localStorage.getItem que retorna null', () => {
            localStorage.getItem.mockReturnValue(null);
            
            const productos = getProductos();
            const carrito = getCart();
            const isLoggedIn = isUserLoggedIn();
            
            expect(Array.isArray(productos)).toBe(true);
            expect(Array.isArray(carrito)).toBe(true);
            expect(typeof isLoggedIn).toBe('boolean');
        });

        it('calcularPrecioConDescuento con valores extremos', () => {
            // Descuentos negativos
            expect(() => calcularPrecioConDescuento(1000, -50)).not.toThrow();
            
            // Descuentos mayores al 100%
            expect(() => calcularPrecioConDescuento(1000, 150)).not.toThrow();
            
            // Precios negativos
            expect(() => calcularPrecioConDescuento(-1000, 20)).not.toThrow();
            
            // Valores no numéricos
            expect(() => calcularPrecioConDescuento('mil', 'veinte')).not.toThrow();
        });

        it('esOfertaActiva con datos malformados', () => {
            const productosInvalidos = [
                { enOferta: 'si', fechaInicioOferta: 'ayer', fechaFinOferta: 'mañana' },
                { enOferta: undefined },
                {}
            ];
            
            productosInvalidos.forEach(producto => {
                expect(() => esOfertaActiva(producto)).not.toThrow();
                expect(esOfertaActiva(producto)).toBe(false);
            });
        });

        it('esOfertaActiva con null debe lanzar error', () => {
            expect(() => esOfertaActiva(null)).toThrow();
            expect(() => esOfertaActiva(undefined)).toThrow();
        });

        it('esOfertaActiva con tipos incorrectos debe retornar false', () => {
            expect(esOfertaActiva('no-es-objeto')).toBe(false);
            expect(esOfertaActiva(123)).toBe(false);
            expect(esOfertaActiva(true)).toBe(false);
            expect(esOfertaActiva([])).toBe(false);
        });

        it('updateQuantity con cantidades inválidas', () => {
            localStorage.getItem.mockReturnValue(JSON.stringify([
                { id: 1, titulo: 'Test', precio: 1000, cantidad: 1 }
            ]));
            
            expect(() => updateQuantity(1, -5)).not.toThrow(); // Cantidad negativa
            expect(() => updateQuantity(1, 0)).not.toThrow();  // Cantidad cero
            expect(() => updateQuantity(1, 'cinco')).not.toThrow(); // No numérico
            expect(() => updateQuantity(999, 3)).not.toThrow(); // ID inexistente
        });

        it('removeFromCart con ID inexistente', () => {
            localStorage.getItem.mockReturnValue(JSON.stringify([
                { id: 1, titulo: 'Test', precio: 1000 }
            ]));
            
            expect(() => removeFromCart(999)).not.toThrow();
            expect(() => removeFromCart(null)).not.toThrow();
            expect(() => removeFromCart('abc')).not.toThrow();
        });
    });
});
