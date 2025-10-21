import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Login from "./Login.jsx"

describe('Login Component', () => {
    it('debe mostrar todos los textos y placeholders del formulario', () => {
        const html = renderToString(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(html).toContain('Inicio de sesión')

        expect(html).toContain('Correo Electrónico *')
        expect(html).toContain('Contraseña *')

        expect(html).toContain('Iniciar sesión')

        expect(html).toContain('¿No tienes una cuenta?')
        expect(html).toContain('Crear Cuenta')
    })


    it('debe tener enlace correcto para navegar al registro', () => {
        const html = renderToString(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(html).toContain('Crear Cuenta')
        expect(html).toContain('href="/register')
        expect(html).toContain('<a')
    })

    it('debe tener elementos de formulario para envío', () => {
        const html = renderToString(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(html).toContain('<form')
        expect(html).toContain('type="submit"')
        expect(html).toContain('type="email"')
        expect(html).toContain('type="password"')
        expect(html).toContain('name="email"')
        expect(html).toContain('name="password"')
    })

    it('debe tener estructura correcta para navegación condicional', () => {
        const html = renderToString(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )

        expect(html).toContain('¿No tienes una cuenta?')
        expect(html).toContain('Crear Cuenta')
        expect(html).toContain('href="/register')
        expect(html).toContain('redirect=')
    })
})
