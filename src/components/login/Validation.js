export function validationEmail(email){
    const emailRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
}

export function validationPassword(password) {
  return password.length >= 4 && password.length <= 10;
}

