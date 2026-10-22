import { getLast4, onlyDigits } from '../helpers/formatters'

const DECLINED_CARD = '4000000000000002'
const PAYMENT_DELAY_MS = 1500

export type ApprovedPayment = { status: 'approved'; orderId: string; last4: string }
export type RejectedPayment = { status: 'rejected'; message: string }
export type PaymentResult = ApprovedPayment | RejectedPayment

export const processPayment = async (cardNumber: string): Promise<PaymentResult> => {
    await new Promise((resolve) => setTimeout(resolve, PAYMENT_DELAY_MS))

    if (onlyDigits(cardNumber) === DECLINED_CARD) {
        return { status: 'rejected', message: 'El pago fue rechazado por el banco' }
    }

    return {
        status: 'approved',
        orderId: `ORD-${Date.now()}`,
        last4: getLast4(cardNumber),
    }
}
