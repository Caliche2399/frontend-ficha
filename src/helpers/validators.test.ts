import {
    detectBrand,
    isValidLuhn,
    validateCardholder,
    validateCardNumber,
    validateCvv,
    validateEmail,
    validateExpiry,
} from './validators'

describe('detectBrand', () => {
    it('detecta Visa', () => {
        expect(detectBrand('4111 1111')).toBe('visa')
    })

    it('detecta Amex', () => {
        expect(detectBrand('34')).toBe('amex')
        expect(detectBrand('37')).toBe('amex')
    })

    it('detecta Mastercard por el rango 51-55', () => {
        expect(detectBrand('51')).toBe('mastercard')
        expect(detectBrand('55')).toBe('mastercard')
        expect(detectBrand('50')).toBe('unknown')
        expect(detectBrand('56')).toBe('unknown')
    })

    it('detecta Mastercard por el rango 2221-2720', () => {
        expect(detectBrand('2221')).toBe('mastercard')
        expect(detectBrand('2720')).toBe('mastercard')
        expect(detectBrand('2220')).toBe('unknown')
        expect(detectBrand('2721')).toBe('unknown')
    })

    it('devuelve unknown si todavía no hay suficientes dígitos', () => {
        expect(detectBrand('')).toBe('unknown')
        expect(detectBrand('5')).toBe('unknown')
        expect(detectBrand('22')).toBe('unknown')
    })
})

describe('isValidLuhn', () => {
    it('acepta tarjetas de prueba válidas', () => {
        expect(isValidLuhn('4111111111111111')).toBe(true)
        expect(isValidLuhn('4000 0000 0000 0002')).toBe(true)
        expect(isValidLuhn('5555555555554444')).toBe(true)
        expect(isValidLuhn('378282246310005')).toBe(true)
    })

    it('rechaza un dígito cambiado', () => {
        expect(isValidLuhn('4111111111111112')).toBe(false)
    })
})

describe('validateCardholder', () => {
    it('exige el nombre', () => {
        expect(validateCardholder('   ')).toBe('El nombre es obligatorio')
    })

    it('exige mínimo 3 caracteres', () => {
        expect(validateCardholder('Jo')).toBe('Debe tener al menos 3 caracteres')
    })

    it('rechaza números y símbolos', () => {
        expect(validateCardholder('Juan3')).toBe('Solo se permiten letras y espacios')
    })

    it('acepta tildes y espacios', () => {
        expect(validateCardholder('José Núñez')).toBeNull()
    })
})

describe('validateCardNumber', () => {
    it('exige el número', () => {
        expect(validateCardNumber('')).toBe('El número de tarjeta es obligatorio')
    })

    it('exige entre 13 y 19 dígitos', () => {
        expect(validateCardNumber('4111 1111')).toBe('Debe tener entre 13 y 19 dígitos')
    })

    it('rechaza números que no pasan Luhn', () => {
        expect(validateCardNumber('4111 1111 1111 1112')).toBe('El número de tarjeta no es válido')
    })

    it('acepta números válidos con espacios', () => {
        expect(validateCardNumber('4111 1111 1111 1111')).toBeNull()
        expect(validateCardNumber('3782 8224 6310 005')).toBeNull()
    })
})

describe('validateExpiry', () => {
    const now = new Date(2026, 5, 15)

    it('exige el formato MM/AA', () => {
        expect(validateExpiry('1', now)).toBe('Usa el formato MM/AA')
        expect(validateExpiry('1226', now)).toBe('Usa el formato MM/AA')
    })

    it('exige un mes entre 01 y 12', () => {
        expect(validateExpiry('00/28', now)).toBe('El mes debe estar entre 01 y 12')
        expect(validateExpiry('13/28', now)).toBe('El mes debe estar entre 01 y 12')
    })

    it('rechaza fechas vencidas', () => {
        expect(validateExpiry('05/26', now)).toBe('La tarjeta está vencida')
        expect(validateExpiry('12/25', now)).toBe('La tarjeta está vencida')
    })

    it('acepta el mes actual y fechas futuras', () => {
        expect(validateExpiry('06/26', now)).toBeNull()
        expect(validateExpiry('01/27', now)).toBeNull()
    })
})

describe('validateCvv', () => {
    it('pide 3 dígitos para Visa y Mastercard', () => {
        expect(validateCvv('123', 'visa')).toBeNull()
        expect(validateCvv('1234', 'visa')).toBe('El CVV debe tener 3 dígitos')
        expect(validateCvv('123', 'mastercard')).toBeNull()
    })

    it('pide 4 dígitos para Amex', () => {
        expect(validateCvv('1234', 'amex')).toBeNull()
        expect(validateCvv('123', 'amex')).toBe('El CVV debe tener 4 dígitos')
    })

    it('rechaza letras y vacío', () => {
        expect(validateCvv('12a', 'visa')).toBe('El CVV debe tener 3 dígitos')
        expect(validateCvv('', 'unknown')).toBe('El CVV debe tener 3 dígitos')
    })
})

describe('validateEmail', () => {
    it('exige el email', () => {
        expect(validateEmail('')).toBe('El email es obligatorio')
    })

    it('rechaza formatos inválidos', () => {
        expect(validateEmail('a@b')).toBe('El email no es válido')
        expect(validateEmail('a b@c.com')).toBe('El email no es válido')
    })

    it('acepta un email válido', () => {
        expect(validateEmail('juan@correo.com')).toBeNull()
    })
})
