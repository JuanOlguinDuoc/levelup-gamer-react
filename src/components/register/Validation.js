export function validationRun(run) {
    const runRegex = /^\d{8}-[0-9kK]$/;
    return runRegex.test(run)
}

export function validationName(nombre) {
    if (typeof nombre !== 'string') {
        return false;
    } else if (nombre === null || nombre.trim() === '') {
        return false;
    } else {

        const nameRegex = /^[A-Za-z]+( [A-Za-z]+)?$/;
        return nameRegex.test(nombre)
    }
}

export function validationApellidos(apellidos) {
    const apellidosRegex = /^[A-Za-z]+ [A-Za-z]+$/;
    return apellidosRegex.test(apellidos)
}

export function validationDireccion(direccion) {
    return !!(direccion && direccion.trim().length > 0)
}

export function validationEmail(email) {
    const emailRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email)
}

export function validationPassword(password) {
    return password.length >= 4 && password.length <= 10
}

export function validationConfirmPassword(password, confirmPassword) {
    return password === confirmPassword && password.length > 0
} 