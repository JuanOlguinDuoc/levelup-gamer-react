import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register.jsx";


describe('Componentes del Registro', () => {
    it('Debe mostrar todos los textos y placeholders del registro', () => {
        const html = renderToString(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(html).toContain('Registro')
        expect(html).toContain('RUN EJ: 12345678-9*')
        expect(html).toContain('Nombre *')
        expect(html).toContain('Apellidos *')
        expect(html).toContain('Dirección *')
        expect(html).toContain('Correo Electrónico *')
        expect(html).toContain('Contraseña *')
        expect(html).toContain('Confirmar Contraseña *')
        expect(html).toContain('Crear cuenta')
        expect(html).toContain('¿Ya tienes una cuenta?')
        expect(html).toContain('Iniciar sesión')
    })

    it('Debe renderizar elementos del formulario', () => {
        const html = renderToString(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(html).toContain('input')
        expect(html).toContain('type="email"')
        expect(html).toContain('type="password"')
        expect(html).toContain('<button')
    })

    it('Debe mostrar placeholders informativos', () => {
        const html = renderToString(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(html).toContain('placeholder=')
    })

    it('Debe tener estructura de navegación', () => {
        const html = renderToString(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(html).toContain('¿Ya tienes una cuenta?')
        expect(html).toContain('Iniciar sesión')
    })

    it('Debe aplicar clases CSS', () => {
        const html = renderToString(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(html).toContain('class=')
        expect(html).toContain('form')
    })

    it('Debe validar botón de envío', () => {
        const html = renderToString(
            <MemoryRouter>
                <Register/>
            </MemoryRouter>
        )

        expect(html).toContain('Crear cuenta')
        expect(html).toContain('type="submit"')
    })
}) 