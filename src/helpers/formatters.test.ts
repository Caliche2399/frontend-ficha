import { formatCardNumber, formatExpiry, getLast4, onlyDigits } from './formatters'

describe('onlyDigits', () => {
    it('quita todo lo que no sea número', () => {
        expect(onlyDigits('4111-1111 abc')).toBe('41111111')
    })
})

describe('formatCardNumber', () => {
    it('agrupa en bloques de 4', () => {
        expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111')
    })

    it('no deja espacio al final cuando el grupo está completo', () => {
        expect(formatCardNumber('4111')).toBe('4111')
    })

    it('ignora letras y símbolos', () => {
        expect(formatCardNumber('abc4111-1111')).toBe('4111 1111')
    })

    it('limita a 19 dígitos', () => {
        expect(formatCardNumber('4'.repeat(25))).toBe('4444 4444 4444 4444 444')
    })
})

describe('formatExpiry', () => {
    it('no agrega la barra antes del tercer dígito', () => {
        expect(formatExpiry('12')).toBe('12')
    })

    it('agrega la barra desde el tercer dígito', () => {
        expect(formatExpiry('122')).toBe('12/2')
        expect(formatExpiry('1228')).toBe('12/28')
    })

    it('quita la barra al borrar el tercer dígito', () => {
        expect(formatExpiry('12/')).toBe('12')
    })
})

describe('getLast4', () => {
    it('devuelve los últimos 4 dígitos', () => {
        expect(getLast4('4000 0000 0000 0002')).toBe('0002')
    })
})
