import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaStore } from 'react-icons/fa'
import { CheckoutModal } from './components/CheckoutModal'
import { ProductCard } from './components/ProductCard'
import type { Product } from './helpers/types'

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Producto 1",
    description: "Descripcion 1",
    price: 100,
    image: "https://picsum.photos/id/237/200/300",
    stock: 10
  },
  {
    id: 2,
    name: "Producto 2",
    description: "Descripcion 2",
    price: 200,
    image: "https://picsum.photos/id/238/200/300",
    stock: 20
  },
  {
    id: 3,
    name: "Producto 3",
    description: "Descripcion 3",
    price: 300,
    image: "https://picsum.photos/id/239/200/300",
    stock: 30
  }
]

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [purchase, setPurchase] = useState<{ product: Product; quantity: number } | null>(null)

  const decreaseStock = (productId: number, quantity: number) => {
    setProducts((current) =>
      current.map((p) =>
        p.id === productId ? { ...p, stock: p.stock - quantity } : p
      )
    )
  }

  const handleBuy = (product: Product, quantity: number) => {
    setPurchase({ product, quantity })
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">
            <FaStore className="me-2" aria-hidden="true" />
            Ficha
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#">Inicio</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-4">
        <div className="d-flex align-items-center gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onBuy={handleBuy} />
          ))}
        </div>
      </Container>

      {purchase && (
        <CheckoutModal
          product={purchase.product}
          quantity={purchase.quantity}
          onApproved={() => decreaseStock(purchase.product.id, purchase.quantity)}
          onClose={() => setPurchase(null)}
        />
      )}
    </>
  )
}

export default App
