export const onlyDigits = (value: string) => value.replace(/\D/g, '')

export const formatCardNumber = (value: string) => {
    const digits = onlyDigits(value).slice(0, 19)
    return digits.replace(/(.{4})/g, '$1 ').trim()
}

export const formatExpiry = (value: string) => {
    const digits = onlyDigits(value).slice(0, 4)
    if (digits.length < 3) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export const getLast4 = (cardNumber: string) => onlyDigits(cardNumber).slice(-4)
