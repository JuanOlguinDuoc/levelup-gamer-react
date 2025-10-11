import { validationEmail, validationPassword } from './Validation.js';

describe('Validation functions', () => {
  
  // Tests de email
  it('valida emails correctos', () => {
    expect(validationEmail('juan@duoc.cl')).toBe(true);
    expect(validationEmail('juan@profesor.duoc.cl')).toBe(true);
    expect(validationEmail('juan@gmail.com')).toBe(true);
  });

  it('rechaza emails incorrectos', () => {
    expect(validationEmail('juan@hotmail.com')).toBe(false);
    expect(validationEmail('juan@otra.cl')).toBe(false);
    expect(validationEmail('juanpurbea')).toBe(false);
  });

  // Tests de password
  it('acepta passwords entre 4 y 10 caracteres', () => {
    expect(validationPassword('1234')).toBe(true);
    expect(validationPassword('abcd123')).toBe(true);
    expect(validationPassword('1234567890')).toBe(true);
  });

  it('rechaza passwords fuera de rango', () => {
    expect(validationPassword('123')).toBe(false);         // demasiado corto
    expect(validationPassword('12345678901')).toBe(false); // demasiado largo
  });
});