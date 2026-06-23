'use client'

import { useState } from 'react'
import { useCart, type CartItem } from '@/providers/cart-context'

// Przyjmuje dane produktu (bez ilości) od strony produktu (Server Component
// przekazuje je jako propsy) i dokłada je do koszyka po kliknięciu.
type Props = { product: Omit<CartItem, 'quantity'> }

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(product)
    setAdded(true)
    // krótki feedback "Dodano ✓", potem wracamy do normalnego napisu
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-8 w-full rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white transition hover:bg-neutral-700"
    >
      {added ? 'Dodano ✓' : 'Dodaj do koszyka'}
    </button>
  )
}
