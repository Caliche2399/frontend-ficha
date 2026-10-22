import { Button } from 'react-bootstrap'
import { AlertComponent } from './AlertComponent'
import type { Product } from '../helpers/types'

interface PaymentSuccessProps {
    orderId: string
    last4: string
    product: Product
    quantity: number
    total: number
    onClose: () => void
}

export const PaymentSuccess = ({ orderId, last4, product, quantity, total, onClose }: PaymentSuccessProps) => {
    return (
        <div>
            <AlertComponent variant="success" message="¡Pago aprobado! Gracias por tu compra." />

            <dl className="mb-4">
                <dt>Número de orden</dt>
                <dd>{orderId}</dd>
                <dt>Tarjeta</dt>
                <dd>Terminada en {last4}</dd>
                <dt>Producto</dt>
                <dd>{product.name} x {quantity}</dd>
                <dt>Total</dt>
                <dd>Q{total}</dd>
            </dl>

            <div className="d-flex justify-content-end">
                <Button onClick={onClose}>Cerrar</Button>
            </div>
        </div>
    )
}
