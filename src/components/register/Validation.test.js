import { describe, expect, it } from 'vitest';
import {
    validationRun,
    validationName,
    validationApellidos,
    validationDireccion,
    validationEmail,
    validationPassword,
    validationConfirmPassword
} from './Validation';

describe ('Test de validaciones del registro', () => {

    it('validación del run', () => {
        expect(validationRun('12345678-k')).toBe(true);
        expect(validationRun('12345678-9')).toBe(true);
        expect(validationRun('11111111-1')).toBe(true);
    })

    it('debe rechazar RUNs con formato incorrecto', () => {
        expect(validationRun('123456789')).toBe(false);        
        expect(validationRun('12345678')).toBe(false);         
        expect(validationRun('1234567-8')).toBe(false);       
        expect(validationRun('123456789-0')).toBe(false);     
        expect(validationRun('12.345.678-9')).toBe(false);    
    })

    it('debe rechazar RUNs con caracteres inválidos', () => {
        expect(validationRun('1234567a-9')).toBe(false);      
        expect(validationRun('12345678-x')).toBe(false);       
        expect(validationRun('abcdefgh-9')).toBe(false);      
    })

    it('debe manejar casos extremos', () => {
        expect(validationRun('')).toBe(false);                
        expect(validationRun(null)).toBe(false);              
        expect(validationRun(undefined)).toBe(false);         
        expect(validationRun('   ')).toBe(false);             
        expect(validationRun('12345678-')).toBe(false);       
    })

    it('debe manejar espacios correctamente', () => {
        expect(validationRun(' 12345678-9 ')).toBe(false);    
        expect(validationRun('12345678 - 9')).toBe(false);   
        expect(validationRun('12 345 678-9')).toBe(false);   
    })

    it('debe ser case-insensitive para K', () => {
        expect(validationRun('12345678-k')).toBe(true);
        expect(validationRun('12345678-K')).toBe(true);
    })

    it('debe manejar diferentes tipos de entrada', () => {
        expect(validationRun(12345678)).toBe(false);         
        expect(validationRun({})).toBe(false);               
        expect(validationRun(true)).toBe(false);             
        expect(validationRun(false)).toBe(false);            
        expect(validationRun(0)).toBe(false);                
        expect(validationRun([1,2,3,4,5,6,7,8,'-',9])).toBe(false); 
    })

    //Validacion de la dirección
    it('debe rechazar direcciones vacías o solo espacios', () => {
        expect(validationDireccion('')).toBe(false);
        expect(validationDireccion('   ')).toBe(false);
    })

    it('debe aceptar direcciones válidas', () => {
        expect(validationDireccion('Calle Falsa 123')).toBe(true);
        expect(validationDireccion('Av. Siempre Viva 742')).toBe(true);
    })

    it('El nombre solo debe contener letras y un espacio opcional', () => {
        expect(validationName(1111111111)).toBe(false);
        expect(validationName('.-,$"%$ " " "')).toBe(false);
        expect(validationName('Juan123')).toBe(false);
        expect(validationName('')).toBe(false);
        expect(validationName('   ')).toBe(false);
        expect(validationName(null)).toBe(false);
    })

    it('Validacion del nombre correcto', () => {
        expect(validationName('Juan')).toBe(true);
        expect(validationName('Juan Perez')).toBe(true);
    })
})