import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { AlertComponent } from './AlertComponent'
import { FormField } from './FormField'
import { formatCardNumber, formatExpiry, onlyDigits } from '../helpers/formatters'
import {
    detectBrand,
    validateCardholder,
    validateCardNumber,
    validateCvv,
    validateEmail,
    validateExpiry,
} from '../helpers/validators'
import type { CardBrand } from '../helpers/validators'
import { processPayment } from '../services/paymentService'
import type { ApprovedPayment } from '../services/paymentService'

type Field = 'holder' | 'cardNumber' | 'expiry' | 'cvv' | 'email'

const brandNames: Record<CardBrand, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'Amex',
    unknown: '',
}

const notTouched: Record<Field, boolean> = {
    holder: false,
    cardNumber: false,
    expiry: false,
    cvv: false,
    email: false,
}

interface PaymentFormProps {
    total: number
    onApproved: (payment: ApprovedPayment) => void
    onCancel: () => void
}

export const PaymentForm = ({ total, onApproved, onCancel }: PaymentFormProps) => {
    const [holder, setHolder] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [email, setEmail] = useState('')
    const [touched, setTouched] = useState(notTouched)
    const [submitted, setSubmitted] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [rejectedMessage, setRejectedMessage] = useState<string | null>(null)

    const brand = detectBrand(cardNumber)

    const errors: Record<Field, string | null> = {
        holder: validateCardholder(holder),
        cardNumber: validateCardNumber(cardNumber),
        expiry: validateExpiry(expiry),
        cvv: validateCvv(cvv, brand),
        email: validateEmail(email),
    }
    const hasErrors = Object.values(errors).some(Boolean)

    const touch = (field: Field) => setTouched((current) => ({ ...current, [field]: true }))
    const errorFor = (field: Field) => (touched[field] || submitted ? errors[field] : null)

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitted(true)
        if (hasErrors || processing) return

        setProcessing(true)
        setRejectedMessage(null)
        const result = await processPayment(cardNumber)
        setProcessing(false)

        if (result.status === 'approved') {
            onApproved(result)
            return
        }

        setRejectedMessage(result.message)
        setCvv('')
        setSubmitted(false)
        setTouched((current) => ({ ...current, cvv: false }))
    }

    return (
        <Form noValidate onSubmit={handleSubmit}>
            {rejectedMessage && <AlertComponent variant="danger" message={rejectedMessage} />}

            <FormField
                id="holder"
                label="Nombre del titular"
                value={holder}
                error={errorFor('holder')}
                autoComplete="cc-name"
                placeholder="Juan Pérez"
                disabled={processing}
                onChange={setHolder}
                onBlur={() => touch('holder')}
            />

            <FormField
                id="cardNumber"
                label="Número de tarjeta"
                value={cardNumber}
                error={errorFor('cardNumber')}
                hint={brandNames[brand] ? `Marca: ${brandNames[brand]}` : undefined}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4111 1111 1111 1111"
                disabled={processing}
                onChange={(value) => setCardNumber(formatCardNumber(value))}
                onBlur={() => touch('cardNumber')}
            />

            <Row>
                <Col>
                    <FormField
                        id="expiry"
                        label="Vencimiento"
                        value={expiry}
                        error={errorFor('expiry')}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        disabled={processing}
                        onChange={(value) => setExpiry(formatExpiry(value))}
                        onBlur={() => touch('expiry')}
                    />
                </Col>
                <Col>
                    <FormField
                        id="cvv"
                        label="CVV"
                        type="password"
                        value={cvv}
                        error={errorFor('cvv')}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        disabled={processing}
                        onChange={(value) => setCvv(onlyDigits(value).slice(0, 4))}
                        onBlur={() => touch('cvv')}
                    />
                </Col>
            </Row>

            <FormField
                id="email"
                label="Email"
                value={email}
                error={errorFor('email')}
                inputMode="email"
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                disabled={processing}
                onChange={setEmail}
                onBlur={() => touch('email')}
            />

            <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" disabled={processing} onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Procesando...' : `Pagar Q${total}`}
                </Button>
            </div>
        </Form>
    )
}
