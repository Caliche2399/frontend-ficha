import { useState } from "react";
import { Card, Button, Form } from "react-bootstrap"
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
        <Card style={{ width: '18rem' }}>
            <Card.Img
                variant="top"
                style={{ maxHeight: '250px' }}
                src={product.image}
                alt={product.name}
            />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Precio: ${product.price}</Card.Text>
                <Card.Text>Stock disponible: {product.stock}</Card.Text>

                <Form.Group controlId={`quantity-${product.id}`} className="mb-3">
                    <Form.Label>Cantidad</Form.Label>
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

                <Card.Text>Total: ${total}</Card.Text>

                <Button variant="primary" disabled={outOfStock} onClick={handleBuy}>
                    <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                    {outOfStock ? 'Agotado' : 'Comprar'}
                </Button>
            </Card.Body>
        </Card>
    )
}
