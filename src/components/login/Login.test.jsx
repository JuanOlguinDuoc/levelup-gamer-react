import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import Login from "./Login.jsx"

describe('Login Component', () => {
    it('debe mostrar todos los textos y placeholders del formulario', () => {
        const html = renderToString(<Login />)

        // Título del formulario
        expect(html).toContain('Inicio de sesión')

        // Placeholders de los inputs
        expect(html).toContain('Correo Electrónico *')
        expect(html).toContain('Contraseña *')

        // Botón
        expect(html).toContain('Iniciar sesión')

        // Mensaje de registro
        expect(html).toContain('¿No tienes una cuenta?')
        expect(html).toContain('Crear cuenta')
    })
})
