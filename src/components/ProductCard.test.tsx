import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from './ProductCard'
import type { Product } from '../helpers/types'

const product: Product = {
    id: 1,
    name: 'Producto de prueba',
    description: 'Descripcion de prueba',
    price: 100,
    image: 'imagen.png',
    stock: 5,
}

describe('ProductCard', () => {
    it('muestra nombre, descripción, precio, stock y total inicial', () => {
        render(<ProductCard product={product} onBuy={vi.fn()} />)

        expect(screen.getByText('Producto de prueba')).toBeInTheDocument()
        expect(screen.getByText('Descripcion de prueba')).toBeInTheDocument()
        expect(screen.getByText('Stock disponible: 5')).toBeInTheDocument()
        expect(screen.getAllByText('Q100')).toHaveLength(2)
    })

    it('ofrece cantidades de 1 hasta el stock', () => {
        render(<ProductCard product={product} onBuy={vi.fn()} />)

        const options = screen.getAllByRole('option').map((option) => option.textContent)
        expect(options).toEqual(['1', '2', '3', '4', '5'])
    })

    it('actualiza el total al cambiar la cantidad', async () => {
        const user = userEvent.setup()
        render(<ProductCard product={product} onBuy={vi.fn()} />)

        await user.selectOptions(screen.getByLabelText('Cantidad'), '3')

        expect(screen.getByText('Q300')).toBeInTheDocument()
        expect(screen.getByText('Q100')).toBeInTheDocument()
    })

    it('llama a onBuy con el producto y la cantidad elegida', async () => {
        const user = userEvent.setup()
        const onBuy = vi.fn()
        render(<ProductCard product={product} onBuy={onBuy} />)

        await user.selectOptions(screen.getByLabelText('Cantidad'), '3')
        await user.click(screen.getByRole('button', { name: /comprar/i }))

        expect(onBuy).toHaveBeenCalledWith(product, 3)
    })

    it('deshabilita la compra cuando no hay stock', () => {
        render(<ProductCard product={{ ...product, stock: 0 }} onBuy={vi.fn()} />)

        expect(screen.getByRole('button', { name: /agotado/i })).toBeDisabled()
        expect(screen.getByLabelText('Cantidad')).toBeDisabled()
    })
})
