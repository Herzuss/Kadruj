'use client'

import Link from 'next/link'
import { useCart } from '@/providers/cart-context'

// Nagłówek widoczny na każdej stronie. Pokazuje licznik sztuk w koszyku —
// dlatego musi być klientem (czyta żywy stan z useCart()).
export function SiteHeader() {
  const { count } = useCart()

  return (
    // sticky top-0 = nagłówek "przykleja się" do góry przy scrollu, więc nawigacja
    // i koszyk są zawsze pod ręką. backdrop-blur + bg-white/80 = lekko przezroczyste
    // tło z rozmyciem, żeby treść pod spodem ładnie prześwitywała.
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Wordmark = logo z samej typografii (font-display). To nasze "logo". */}
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Kadruj
        </Link>

        {/* Nawigacja na środku. Ukryta na mobile (sm:flex) — menu mobilne dorobimy później. */}
        <nav className="hidden gap-8 text-sm font-medium text-neutral-600 sm:flex">
          <Link href="/produkty" className="hover:text-neutral-900">
            Produkty
          </Link>
          <Link href="#" className="hover:text-neutral-900">
            Kontakt
          </Link>
        </nav>

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
