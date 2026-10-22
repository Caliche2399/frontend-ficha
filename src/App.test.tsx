import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const advance = (ms: number) =>
    act(async () => {
        await vi.advanceTimersByTimeAsync(ms)
    })

const openCheckout = async (user: ReturnType<typeof userEvent.setup>) => {
    render(<App />)
    await user.selectOptions(screen.getAllByLabelText('Cantidad')[0], '2')
    await user.click(screen.getAllByRole('button', { name: /comprar/i })[0])
}

const fillForm = async (user: ReturnType<typeof userEvent.setup>, cardNumber = '4111111111111111') => {
    await user.type(screen.getByLabelText('Nombre del titular'), 'Juan Perez')
    await user.type(screen.getByLabelText('Número de tarjeta'), cardNumber)
    await user.type(screen.getByLabelText('Vencimiento'), '1299')
    await user.type(screen.getByLabelText('CVV'), '123')
    await user.type(screen.getByLabelText('Email'), 'juan@correo.com')
}

describe('flujo de compra', () => {
    let user: ReturnType<typeof userEvent.setup>

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
        user = userEvent.setup({ delay: null })
    })

    afterEach(() => {
        vi.useRealTimers()
        localStorage.clear()
    })

    it('abre el formulario de pago al comprar', async () => {
        await openCheckout(user)

        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Comprar Producto 1 x 2')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Pagar Q200' })).toBeInTheDocument()
    })

    it('muestra el error de un campo al salir de él', async () => {
        await openCheckout(user)
        const holder = screen.getByLabelText('Nombre del titular')

        expect(holder).toHaveAttribute('aria-invalid', 'false')

        await user.click(holder)
        await user.tab()

        expect(holder).toHaveAttribute('aria-invalid', 'true')
        expect(holder).toHaveAccessibleDescription('El nombre es obligatorio')
    })

    it('muestra todos los errores al enviar vacío y no procesa el pago', async () => {
        await openCheckout(user)

        await user.click(screen.getByRole('button', { name: 'Pagar Q200' }))

        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('El número de tarjeta es obligatorio')).toBeInTheDocument()
        expect(screen.getByText('Usa el formato MM/AA')).toBeInTheDocument()
        expect(screen.getByText('El CVV debe tener 3 dígitos')).toBeInTheDocument()
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Pagar Q200' })).toBeEnabled()
    })

    it('formatea el número de tarjeta y muestra la marca', async () => {
        await openCheckout(user)
        const cardNumber = screen.getByLabelText('Número de tarjeta')

        await user.type(cardNumber, '4111111111111111')
        expect(cardNumber).toHaveValue('4111 1111 1111 1111')
        expect(screen.getByText('Marca: Visa')).toBeInTheDocument()

        await user.clear(cardNumber)
        await user.type(cardNumber, '378282246310005')
        expect(screen.getByText('Marca: Amex')).toBeInTheDocument()
    })

    it('aprueba el pago, muestra la orden y descuenta el stock', async () => {
        await openCheckout(user)
        await fillForm(user)

        await user.click(screen.getByRole('button', { name: 'Pagar Q200' }))
        expect(screen.getByRole('button', { name: 'Procesando...' })).toBeDisabled()
        expect(screen.getByText('Stock disponible: 10')).toBeInTheDocument()

        await advance(1500)

        expect(screen.getByText('Compra exitosa')).toBeInTheDocument()
        expect(screen.getByText(/^ORD-\d+$/)).toBeInTheDocument()
        expect(screen.getByText('Terminada en 1111')).toBeInTheDocument()
        expect(screen.getByText('Stock disponible: 8')).toBeInTheDocument()
        expect(screen.queryByLabelText('Número de tarjeta')).not.toBeInTheDocument()
        expect(screen.queryByLabelText('CVV')).not.toBeInTheDocument()
        expect(localStorage.length).toBe(0)
    })

    it('cierra el modal al terminar la compra', async () => {
        await openCheckout(user)
        await fillForm(user)
        await user.click(screen.getByRole('button', { name: 'Pagar Q200' }))
        await advance(1500)

        await user.click(screen.getByRole('button', { name: 'Cerrar' }))
        await advance(500)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('rechaza la tarjeta de prueba, no descuenta stock y permite reintentar', async () => {
        await openCheckout(user)
        await fillForm(user, '4000000000000002')

        await user.click(screen.getByRole('button', { name: 'Pagar Q200' }))
        await advance(1500)

        expect(screen.getByText('El pago fue rechazado por el banco')).toBeInTheDocument()
        expect(screen.getByText('Stock disponible: 10')).toBeInTheDocument()
        expect(screen.getByLabelText('CVV')).toHaveValue('')
        expect(screen.getByRole('button', { name: 'Pagar Q200' })).toBeEnabled()

        const cardNumber = screen.getByLabelText('Número de tarjeta')
        await user.clear(cardNumber)
        await user.type(cardNumber, '4111111111111111')
        await user.type(screen.getByLabelText('CVV'), '123')
        await user.click(screen.getByRole('button', { name: 'Pagar Q200' }))
        await advance(1500)

        expect(screen.getByText('Compra exitosa')).toBeInTheDocument()
        expect(screen.getByText('Stock disponible: 8')).toBeInTheDocument()
    })

    it('cancelar cierra el modal sin descontar stock', async () => {
        await openCheckout(user)

        await user.click(screen.getByRole('button', { name: 'Cancelar' }))
        await advance(500)

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(screen.getByText('Stock disponible: 10')).toBeInTheDocument()
    })
})
