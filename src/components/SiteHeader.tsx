'use client'

import Link from 'next/link'
import { useCart } from '@/providers/cart-context'

// Nagłówek widoczny na każdej stronie. Pokazuje licznik sztuk w koszyku —
// dlatego musi być klientem (czyta żywy stan z useCart()).
export function SiteHeader() {
  const { count } = useCart()

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Kadruj
        </Link>
        <Link href="/produkty" className='text-neutral-500 justify-center'> Zobacz wszystkie produkty</Link>
        <Link href="/koszyk" className="relative text-sm font-medium hover:text-neutral-600">
          Koszyk
          {count > 0 && (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-xs text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
