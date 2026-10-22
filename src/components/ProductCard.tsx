import { useState } from "react";
import { Badge, Card, Button, Form } from "react-bootstrap"
import type { Product } from "../helpers/types"
import { FaShoppingCart } from "react-icons/fa";


interface ProductCardProps {
    product: Product
    onBuy: (product: Product, quantity: number) => void
}

export const ProductCard = ({ product, onBuy }: ProductCardProps) => {
    const [quantity, setQuantity] = useState(1)

    const total = product.price * quantity
    const outOfStock = product.stock === 0

    const handleBuy = () => {
        onBuy(product, quantity)
        setQuantity(1)
    }

    return (
        <Card className="shadow-sm" style={{ width: '18rem' }}>
            <Card.Img
                variant="top"
                style={{ height: '220px', objectFit: 'cover' }}
                src={product.image}
                alt={product.name}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{product.name}</Card.Title>
                <Card.Text className="text-muted">{product.description}</Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-4 fw-semibold text-primary">${product.price}</span>
                    <Badge bg={outOfStock ? 'danger' : 'success'}>
                        Stock disponible: {product.stock}
                    </Badge>
                </div>

                <Form.Group controlId={`quantity-${product.id}`} className="mb-3">
                    <Form.Label className="small text-muted mb-1">Cantidad</Form.Label>
                    <Form.Select
                        value={quantity}
                        disabled={outOfStock}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                        {Array.from({ length: product.stock }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <div className="mt-auto">
                    <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                        <span>Total</span>
                        <span>Q{total}</span>
                    </div>

                    <Button
                        variant={outOfStock ? 'secondary' : 'primary'}
                        className="w-100"
                        disabled={outOfStock}
                        onClick={handleBuy}
                    >
                        <FaShoppingCart className="me-2" />
                        {outOfStock ? 'Agotado' : 'Comprar'}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}
