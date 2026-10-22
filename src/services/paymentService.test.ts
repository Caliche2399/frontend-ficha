import { processPayment } from './paymentService'

describe('processPayment', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('no responde antes de 1.5 segundos', async () => {
        let finished = false
        processPayment('4111 1111 1111 1111').then(() => {
            finished = true
        })

        await vi.advanceTimersByTimeAsync(1499)
        expect(finished).toBe(false)

        await vi.advanceTimersByTimeAsync(1)
        expect(finished).toBe(true)
    })

    it('aprueba y devuelve número de orden y últimos 4 dígitos', async () => {
        const promise = processPayment('4111 1111 1111 1111')
        await vi.advanceTimersByTimeAsync(1500)

        expect(await promise).toEqual({
            status: 'approved',
            orderId: expect.stringMatching(/^ORD-\d+$/),
            last4: '1111',
        })
    })

    it('no incluye el número completo en la respuesta', async () => {
        const promise = processPayment('4111 1111 1111 1111')
        await vi.advanceTimersByTimeAsync(1500)

        const result = await promise
        expect(JSON.stringify(result)).not.toContain('4111111111111111')
        expect(JSON.stringify(result)).not.toContain('4111 1111 1111 1111')
    })

    it('rechaza la tarjeta de prueba 4000 0000 0000 0002', async () => {
        const promise = processPayment('4000 0000 0000 0002')
        await vi.advanceTimersByTimeAsync(1500)

        expect(await promise).toEqual({
            status: 'rejected',
            message: 'El pago fue rechazado por el banco',
        })
    })
})
