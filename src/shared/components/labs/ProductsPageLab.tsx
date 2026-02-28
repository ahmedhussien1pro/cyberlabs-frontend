import { useEffect, useState } from "react"
import { ProductCard, type Product } from "./ProductCard"

export default function ProductsPageLab() {
    const [products, setProducts] = useState<Product[]>([])
    const [cart, setCart] = useState<Product[]>(() => {
        const storedCart = localStorage.getItem("lab_cart")
        return storedCart ? JSON.parse(storedCart) : []
    })

    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((res) => res.json())
            .then((data: Product[]) => setProducts(data))
    }, [])

    const addToCart = (product: Product) => {
        const existing = cart.find((item) => item.id === product.id)

        let updatedCart: Product[]

        if (existing) {
            updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: (item as any).quantity + 1 }
                    : item
            )
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 } as any]
        }

        setCart(updatedCart)
        localStorage.setItem("lab_cart", JSON.stringify(updatedCart))
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
                <h1 className="text-3xl font-bold tracking-tight text-center">
                    Our Products
                </h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                        />
                    ))}
                </div>
            </main>

            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © 2025 CyberLabs. All rights reserved.
            </footer>
        </div>
    )
}