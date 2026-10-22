import { onlyDigits } from './formatters'

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown'

// Cada validate* devuelve el mensaje de error, o null si el valor es válido

export const detectBrand = (cardNumber: string): CardBrand => {
    const digits = onlyDigits(cardNumber)
    const firstTwo = Number(digits.slice(0, 2))
    const firstFour = Number(digits.slice(0, 4))

    if (digits.startsWith('4')) return 'visa'
    if (firstTwo === 34 || firstTwo === 37) return 'amex'
    if (
        (firstTwo >= 51 && firstTwo <= 55) ||
        (digits.length >= 4 && firstFour >= 2221 && firstFour <= 2720)
    ) {
        return 'mastercard'
    }
    return 'unknown'
}

export const isValidLuhn = (cardNumber: string) => {
    const digits = onlyDigits(cardNumber)
    let sum = 0

    // Se recorre de derecha a izquierda duplicando uno de cada dos dígitos
    for (let i = 0; i < digits.length; i++) {
        let digit = Number(digits[digits.length - 1 - i])
        if (i % 2 === 1) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
    }

    return sum % 10 === 0
}

export const validateCardholder = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return 'El nombre es obligatorio'
    if (!/^[\p{L}\p{M} ]+$/u.test(trimmed)) return 'Solo se permiten letras y espacios'
    if (trimmed.length < 3) return 'Debe tener al menos 3 caracteres'
    return null
}

export const validateCardNumber = (cardNumber: string) => {
    const digits = onlyDigits(cardNumber)
    if (!digits) return 'El número de tarjeta es obligatorio'
    if (digits.length < 13 || digits.length > 19) return 'Debe tener entre 13 y 19 dígitos'
    if (!isValidLuhn(digits)) return 'El número de tarjeta no es válido'
    return null
}

// "now" es parámetro para poder probarlo con una fecha fija
export const validateExpiry = (expiry: string, now = new Date()) => {
    const match = /^(\d{2})\/(\d{2})$/.exec(expiry)
    if (!match) return 'Usa el formato MM/AA'

    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    if (month < 1 || month > 12) return 'El mes debe estar entre 01 y 12'

    // La tarjeta vale hasta el final del mes que indica
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return 'La tarjeta está vencida'
    }
    return null
}

export const validateCvv = (cvv: string, brand: CardBrand) => {
    const length = brand === 'amex' ? 4 : 3
    if (!/^\d+$/.test(cvv) || cvv.length !== length) {
        return `El CVV debe tener ${length} dígitos`
    }
    return null
}

export const validateEmail = (email: string) => {
    const trimmed = email.trim()
    if (!trimmed) return 'El email es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'El email no es válido'
    return null
}
