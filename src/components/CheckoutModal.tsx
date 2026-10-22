import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { PaymentForm } from './PaymentForm'
import { PaymentSuccess } from './PaymentSuccess'
import type { Product } from '../helpers/types'
import type { ApprovedPayment } from '../services/paymentService'

interface CheckoutModalProps {
    product: Product
    quantity: number
    onApproved: () => void
    onClose: () => void
}

export const CheckoutModal = ({ product, quantity, onApproved, onClose }: CheckoutModalProps) => {
    const [payment, setPayment] = useState<ApprovedPayment | null>(null)

    const total = product.price * quantity

    const handleApproved = (approved: ApprovedPayment) => {
        setPayment(approved)
        onApproved()
    }

    return (
        <Modal show centered backdrop="static" keyboard={false} aria-labelledby="checkout-title">
            <Modal.Header>
                <Modal.Title id="checkout-title">
                    {payment ? 'Compra exitosa' : `Comprar ${product.name} x ${quantity}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {payment ? (
                    <PaymentSuccess
                        orderId={payment.orderId}
                        last4={payment.last4}
                        product={product}
                        quantity={quantity}
                        total={total}
                        onClose={onClose}
                    />
                ) : (
                    <PaymentForm total={total} onApproved={handleApproved} onCancel={onClose} />
                )}
            </Modal.Body>
        </Modal>
    )
}
